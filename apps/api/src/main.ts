import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Important : Autoriser les CORS pour ton front-end
  app.enableCors();
  
  // Si tu as un préfixe global (ex: /api)
  app.setGlobalPrefix('api');

  await app.listen(3000);
  return app;
}

// CETTE LIGNE EST LA CLÉ POUR VERCEL
export const handler = bootstrap(); 

// Pour certains déploiements NestJS sur Vercel, on utilise aussi souvent cette syntaxe :
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};