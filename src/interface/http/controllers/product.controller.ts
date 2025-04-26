import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
}
