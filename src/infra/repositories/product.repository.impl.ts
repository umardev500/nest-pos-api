import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated';
import { ProductRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches a list of products from the database, with optional filtering conditions.
   * It also includes related data for product variants and their options.
   *
   * @param where - Optional filter conditions for querying products (e.g., category, price range).
   * @returns A list of products, including their variants and variant options with additional related data.
   */
  private fetchProducts(where?: Prisma.ProductWhereInput) {
    return this.prisma.product.findMany({
      where, // Apply optional filtering conditions
      include: {
        ProductVariant: {
          // Include product variants with related options
          include: {
            ProductVariantOption: {
              // Include variant options (like size, color, etc.)
              include: {
                variantOption: {
                  // Include the variant option's details (value, group, etc.)
                  include: {
                    variantGroup: true, // Include the variant group (like 'Size' or 'Color')
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Fetches and formats a list of products based on optional filtering conditions.
   * It retrieves products from the database and applies formatting to ensure the data is structured correctly.
   *
   * @param where - Optional filter conditions to refine the products being fetched (e.g., category, price range).
   * @returns A list of products, including variant details and structured data.
   */
  async find(where?: Prisma.ProductWhereInput) {
    // Fetch products from the database with optional filters
    const products = await this.fetchProducts(where);

    return products;
  }
}
