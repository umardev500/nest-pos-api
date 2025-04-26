import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Prisma } from 'prisma/generated';
import { ProductFilterDto } from 'src/app/dto';
import { TokenClaims } from 'src/domain/entities';
import { ProductRepositoryImpl } from 'src/infra/repositories';

@Injectable()
export class ProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryImpl,
    private readonly cls: ClsService,
  ) {}

  async getProducts(filters?: ProductFilterDto) {
    const claims = this.cls.get<TokenClaims>('claims');

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
      where.categoryId = filters.categoryId;
    }

    if (claims.merchantId) {
      where.merchantId = claims.merchantId;
    }

    // Pass the `where` object to the repository method to fetch the products
    return this.productRepository.find(where);
  }
}
