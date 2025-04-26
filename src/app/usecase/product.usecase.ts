import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Prisma } from 'prisma/generated';
import { ProductFilterDto, VariantFormatted } from 'src/app/dto';
import { ProductWithVariants, TokenClaims } from 'src/domain/entities';
import { ProductRepositoryImpl } from 'src/infra/repositories';

@Injectable()
export class ProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryImpl,
    private readonly cls: ClsService,
  ) {}

  /**
   * Formats a list of products, extracting and organizing relevant data like variants,
   * total stock, price, and other product details into a structured format.
   *
   * @param products - List of products to be formatted, fetched from the database.
   * @returns A new list of products with structured data including variants, stock, price, and more.
   */
  private formatProducts(products: ProductWithVariants[]) {
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
    const products = await this.productRepository.find(where);

    // Format the fetched products
    return this.formatProducts(products);
  }
}
