import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    
    // Important : Autoriser les CORS pour ton front-end
    app.enableCors();
    
    // Si tu as un préfixe global (ex: /api)
    app.setGlobalPrefix('api');

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// Handler pour Vercel Serverless
export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  return server(req, res);
};

// Pour le développement local (exécuté si non déployé sur Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.listen(3000);
    console.log('Local server started on port 3000');
  }
  bootstrapLocal();
}