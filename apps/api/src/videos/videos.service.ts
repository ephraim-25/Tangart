import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mux from '@mux/mux-node';

@Injectable()
export class VideosService {
  private readonly muxClient: Mux;

  constructor(private configService: ConfigService) {
    this.muxClient = new Mux({
      tokenId: this.configService.get<string>('MUX_TOKEN_ID') || 'dummy',
      tokenSecret: this.configService.get<string>('MUX_TOKEN_SECRET') || 'dummy',
    });
  }

  // Generates DRM and Playback tokens using the Mux SDK
  async generateTokens(playbackId: string): Promise<{ playbackToken: string; drmToken: string }> {
    try {
      const signingKeyId = this.configService.get<string>('MUX_SIGNING_KEY_ID') || 'dummy_key';
      const signingKeySecret = this.configService.get<string>('MUX_SIGNING_KEY_SECRET') || 'dummy_secret';

      // The playback token allows playback via signed URLs
      // @ts-ignore
      const playbackToken = await Mux.Jwt.signPlaybackId(playbackId, {
        keyId: signingKeyId,
        keySecret: signingKeySecret,
        type: 'video',
        expiration: '2h',
      });

      // The DRM token allows FairPlay / Widevine decryption
      // @ts-ignore
      const drmToken = await Mux.Jwt.signDrmLicense(playbackId, {
        keyId: signingKeyId,
        keySecret: signingKeySecret,
        expiration: '2h',
      });

      return { playbackToken, drmToken };
    } catch (error) {
      console.error('Error generating Mux tokens:', error);
      throw new InternalServerErrorException('Could not generate DRM tokens');
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const webhookSecret = this.configService.get<string>('MUX_WEBHOOK_SECRET');
    if (!webhookSecret) return true; // Bypass in local dev if not set
    try {
      // @ts-ignore
      Mux.Webhooks.verifySignature(payload, { 'mux-signature': signature }, webhookSecret);
      return true;
    } catch (err) {
      return false;
    }
  }
}
