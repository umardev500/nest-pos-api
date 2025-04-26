import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
