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

  /**
   * Fetches products based on optional filters.
   * @param filters - Optional filters like search text and category.
   * @returns List of products that match the filters.
   */
  async getProducts(filters?: ProductFilterDto) {
    // Get the token claims (e.g., merchantId) from the current session
    const claims = this.cls.get<TokenClaims>('claims');

    // Initialize the Prisma query filter object
    const where: Prisma.ProductWhereInput = {};

    // Apply search filters (name or description contains the search term)
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    // Apply category filter if provided
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Apply merchantId from claims if available
    if (claims.merchantId) {
      where.merchantId = claims.merchantId;
    }

    // Fetch products from the repository using the `where` filter
    return this.productRepository.find(where);
  }
}
