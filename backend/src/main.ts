import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://email-analyzer-ivory.vercel.app',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Email Analyzer Backend running on http://localhost:${port}`);
}

bootstrap();