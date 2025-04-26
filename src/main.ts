import { ValidationPipe } from '@nestjs/common'; // 👈 import this
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Add this!
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 enable auto-transform (string -> number)
      whitelist: true, // 👈 automatically strip unvalidated fields (optional but recommended)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
