import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated';
import { VariantFormatted } from 'src/app/dto';
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
   * Formats a list of products, extracting and organizing relevant data like variants,
   * total stock, price, and other product details into a structured format.
   *
   * @param products - List of products to be formatted, fetched from the database.
   * @returns A new list of products with structured data including variants, stock, price, and more.
   */
  private formatProducts(
    products: Awaited<ReturnType<typeof this.fetchProducts>>,
  ) {
    return products.map((product) => {
      // Check if the product has variants (size, color, etc.)
      const hasVariants = product.ProductVariant.length > 0;

      // Process the variants to extract necessary details like size, color, price, and stock
      const variants: VariantFormatted[] = product.ProductVariant.map(
        (variant) => {
          // Extract size and color from variant options
          const size = variant.ProductVariantOption.find(
            (opt) => opt.variantOption.variantGroup.name === 'Size',
          )?.variantOption.value;

          const color = variant.ProductVariantOption.find(
            (opt) => opt.variantOption.variantGroup.name === 'Color',
          )?.variantOption.value;

          return {
            size,
            color,
            price: variant.price.toString(),
            stock: variant.quantity,
          };
        },
      );

      // Calculate the total stock based on variants, or use the product's main quantity if no variants
      const totalQuantity = hasVariants
        ? variants.reduce((sum, v) => sum + v.stock, 0)
        : product.quantity;

      // Select the price of the product, considering variants if available
      const price = !hasVariants
        ? product.price.toString()
        : (variants[0]?.price ?? '0');

      // Return the fully formatted product with its details
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        photo: product.photo,
        quantity: totalQuantity,
        capital: product.capital,
        price,
        discount: product.discount,
        barcode: product.barcode,
        variants, // Include the variants in the formatted result
      };
    });
  }

  /**
   * Fetches and formats a list of products based on optional filtering conditions.
   * It retrieves products from the database and applies formatting to ensure the data is structured correctly.
   *
   * @param where - Optional filter conditions to refine the products being fetched (e.g., category, price range).
   * @returns A list of formatted products, including variant details and structured data.
   */
  async find(where?: Prisma.ProductWhereInput) {
    // Fetch products from the database with optional filters
    const products = await this.fetchProducts(where);

    // Format the fetched products to include necessary details like variants, prices, stock, etc.
    const formattedProducts = this.formatProducts(products);

    // Return the formatted products
    return formattedProducts;
  }
}
