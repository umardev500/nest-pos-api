import { Module } from '@nestjs/common';
import { ProductUseCase } from 'src/app/usecase/product.usecase';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ProductRepositoryImpl } from 'src/infra/repositories';
import { ProductController } from 'src/interface/http/controllers';

@Module({
  controllers: [ProductController],
  providers: [ProductUseCase, ProductRepositoryImpl, PrismaService],
  exports: [],
})
export class ProductModule {}
