import { Module } from '@nestjs/common';
import { ForumsGateway } from './forums.gateway';

@Module({
  providers: [ForumsGateway],
})
export class ForumsModule {}
