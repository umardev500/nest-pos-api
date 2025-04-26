import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from 'prisma/generated';
import { ProductFilterDto } from 'src/app/dto';
import { ProductUseCase } from 'src/app/usecase/product.usecase';
import { ProductWithVariants } from 'src/domain/entities';
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

    return product; // Return the found product
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  /**
   * Deletes a product by its ID and merchant ID.
   * Ensures the product belongs to the merchant before deleting.
   * @param productId - The unique identifier of the product to delete.
   * @returns A success message upon deletion.
   */
  async deleteProductById(@Param('id') productId: number) {
    await this.productUseCase.deleteProductById(productId);
    return { message: 'Product deleted successfully' };
  }

  /**
   * Creates a new product.
   * @param createProductDto - The data required to create the product, including its variants.
   * @returns The newly created product with variants.
   */
  @Post()
  @UseGuards(JwtAuthGuard) // Protect the route with JWT auth
  async createProduct(
    @Body() createProductDto: Prisma.ProductCreateInput,
  ): Promise<ProductWithVariants> {
    return this.productUseCase.createProduct(createProductDto); // Calls the use case to create the product
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') productId: number,
    @Body() updateData: Prisma.ProductUpdateInput,
  ) {
    return this.productUseCase.updateProduct(productId, updateData);
  }
}
