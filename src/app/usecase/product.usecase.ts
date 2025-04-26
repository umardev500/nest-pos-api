import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Prisma } from 'prisma/generated';
import { PrismaClientKnownRequestError } from 'prisma/generated/runtime/library';
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
    return products.map((product) => this.formatProduct(product)); // Use helper method for single product formatting
  }

  /**
   * Formats a single product, extracting and organizing relevant data like variants,
   * total stock, price, and other product details into a structured format.
   *
   * @param product - A single product to be formatted, fetched from the database.
   * @returns A formatted product with structured data including variants, stock, price, and more.
   */
  private formatProduct(product: ProductWithVariants) {
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
          price: parseFloat(variant.price.toString()),
          stock: variant.quantity,
        };
      },
    );

    // Calculate the total stock based on variants, or use the product's main quantity if no variants
    const totalQuantity = hasVariants
      ? variants.reduce((sum, v) => sum + v.stock, 0)
      : product.quantity;

    // Select the price of the product, considering variants if available
    const price = !hasVariants ? product.price.toString() : 0;

    // Return the fully formatted product with its details
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      photo: product.photo,
      quantity: totalQuantity,
      capital: parseFloat(product.capital.toString()),
      price,
      discount: parseFloat(product.discount.toString()),
      barcode: product.barcode,
      variants, // Include the variants in the formatted result
    };
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

  /**
   * Fetches a product by its ID and merchant ID.
   * @param productId - The unique identifier of the product.
   * @returns The product with its variants and options or null if not found.
   */
  async getProductByIdAndMerchantId(productId: number) {
    const claims = this.cls.get<TokenClaims>('claims');

    // Fetch the product with the given ID and merchantId from claims
    const product = await this.productRepository.findById({
      id: productId,
      merchantId: claims.merchantId,
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return this.formatProduct(product);
  }

  /**
   * Deletes a product by its ID and merchant ID.
   *
   * This method first checks if the product exists in the database for the given product ID and merchant ID.
   * If the product exists, it proceeds with deleting it. If any errors occur during the deletion process,
   * such as the product not being found or a foreign key constraint violation, they are handled appropriately.
   *
   * @param productId - The unique identifier of the product to be deleted.
   * @throws NotFoundException if the product does not exist.
   * @throws InternalServerErrorException if there is a foreign key constraint violation or any other unexpected error.
   */
  async deleteProductById(productId: number): Promise<void> {
    // Retrieve the claims (e.g., merchantId) from the session or token
    const claims = this.cls.get<TokenClaims>('claims');

    try {
      // Check if the product exists first by looking up using the productId and merchantId
      const product = await this.productRepository.findById({
        id: productId,
        merchantId: claims.merchantId, // Ensure that the product belongs to the current merchant
      });

      console.log(product);

      // If the product is not found, throw a NotFoundException with a relevant message
      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      // If the product exists, proceed with deletion
      await this.productRepository.deleteById({
        id: productId,
        merchantId: claims.merchantId, // Use the merchantId from claims to ensure proper authorization
      });
    } catch (error) {
      // Handle the specific Prisma error for a non-existent record (P2025)
      if (
        (error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025') ||
        error instanceof NotFoundException
      ) {
        // If the product was not found in the database, throw a NotFoundException
        throw new NotFoundException('Product not found. Unable to delete.');
      }

      // Handle foreign key violation error (P2003)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        // If there's a foreign key constraint violation (e.g., related records preventing deletion),
        // throw an InternalServerErrorException
        throw new InternalServerErrorException(
          'Cannot delete the product due to a foreign key constraint violation. Please check related records.',
        );
      }

      // Catch all other unexpected errors and throw a generic InternalServerErrorException
      throw new InternalServerErrorException(
        'An unexpected error occurred during product deletion.',
      );
    }
  }
}
