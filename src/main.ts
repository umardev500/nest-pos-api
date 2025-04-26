import { ValidationPipe } from '@nestjs/common'; // 👈 import this
import { NestFactory } from '@nestjs/core';
import { ClsInterceptor } from 'src/common/interceptors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalInterceptors(app.get(ClsInterceptor));

  // 👇 Add this!
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 enable auto-transform (string -> number)
      whitelist: true, // 👈 automatically strip unvalidated fields (optional but recommended)
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
