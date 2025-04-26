import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated';
import { ProductWithVariants } from 'src/domain/entities';
import { ProductRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches a single product from the database based on unique identifiers (e.g., id, sku).
   * It includes related data such as product variants and their options with additional group information.
   *
   * @param where - Unique filter criteria to identify the product (e.g., { id: 'product-id' }).
   * @returns A single product record including its variants and variant options.
   */
  private fetchProduct(where: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.findUnique({
      where,
      include: {
        ProductVariant: {
          include: {
            ProductVariantOption: {
              include: {
                variantOption: {
                  include: {
                    variantGroup: true,
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
          include: {
            ProductVariantOption: {
              include: {
                variantOption: {
                  include: {
                    variantGroup: true,
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
  async find(where: Prisma.ProductWhereInput): Promise<ProductWithVariants[]> {
    // Fetch products from the database with optional filters
    const products = await this.fetchProducts(where);

    return products;
  }

  /**
   * Fetches a single product by its unique identifier.
   * Includes related variants and their options.
   *
   * @param where - The unique filter for identifying the product (e.g., { id, merchantId }).
   * @returns The product with variants or null if not found.
   */
  async findById(
    where: Prisma.ProductWhereUniqueInput,
  ): Promise<ProductWithVariants | null> {
    return await this.fetchProduct(where);
  }

  /**
   * Deletes a product based on its unique identifier (id + merchantId).
   *
   * @param where - The unique filter for identifying the product (e.g., { id, merchantId }).
   */
  async deleteById(where: Prisma.ProductWhereUniqueInput): Promise<void> {
    await this.prisma.product.delete({
      where,
    });
  }

  /**
   * Creates a new product in the database, including any related variants if provided.
   *
   * @param data - The data needed to create a product.
   * @returns The newly created product with its variants.
   */
  async create(data: Prisma.ProductCreateInput): Promise<ProductWithVariants> {
    try {
      const createdProduct = await this.prisma.product.create({
        data,
        include: {
          ProductVariant: {
            include: {
              ProductVariantOption: {
                include: {
                  variantOption: {
                    include: {
                      variantGroup: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return createdProduct;
    } catch (error) {
      // You can add error handling here if needed
      throw new Error('Error creating product: ' + error.message);
    }
  }

  /**
   * Updates an existing product in the database.
   *
   * @param where - The unique identifier for the product to update.
   * @param data - The data to update the product with.
   * @returns The updated product, including any related variants if updated.
   */
  async update(
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductWithVariants> {
    return this.prisma.product.update({
      where,
      data,
      include: {
        ProductVariant: {
          include: {
            ProductVariantOption: {
              include: {
                variantOption: {
                  include: {
                    variantGroup: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
