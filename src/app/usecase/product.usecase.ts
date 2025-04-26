import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated';
import { ProductFilterDto } from 'src/app/dto';
import { ProductRepositoryImpl } from 'src/infra/repositories';

@Injectable()
export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryImpl) {}

  async getProducts(filters?: ProductFilterDto) {
    // Initialize the `where` object for Prisma query
    const where: Prisma.ProductWhereInput = {};

    // Conditionally add filters to the `where` object
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters?.categoryId) {
      where.categoryId = Number(filters.categoryId);
    }

    // Pass the `where` object to the repository method to fetch the products
    return this.productRepository.find(where);
  }
}
