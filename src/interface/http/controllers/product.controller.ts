import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductFilterDto } from 'src/app/dto';
import { ProductUseCase } from 'src/app/usecase/product.usecase';
import { JwtAuthGuard } from 'src/interface/http/guards';

@Controller('products')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  /**
   * Retrieves a list of products with optional filters.
   * @param filters - Optional query parameters for filtering products (e.g., by category, price, etc.)
   * @returns A list of products matching the filters.
   */
  @Get()
  @UseGuards(JwtAuthGuard) // Protect the route with JWT auth
  getProducts(@Query() filters?: ProductFilterDto) {
    return this.productUseCase.getProducts(filters); // Fetch and return products based on filters
  }

  /**
   * Retrieves a single product by its ID and merchant ID.
   * @param productId - The unique identifier of the product.
   * @returns The product with its variants and options, or 404 if not found.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Protect the route with JWT auth
  async getProductByIdAndMerchantId(
    @Param('id') productId: number, // Get the productId from the URL params
  ) {
    const product =
      await this.productUseCase.getProductByIdAndMerchantId(productId);
    if (!product) {
      // If no product is found, throw a NotFoundException with a relevant message
      throw new NotFoundException({
        message: `Product with id ${productId} not found`,
      });
    }
    return product; // Return the found product
  }
}
