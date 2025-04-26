import { Controller, Get } from '@nestjs/common';
import { ProductUseCase } from 'src/app/usecase/product.usecase';

@Controller('products')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Get()
  getProducts() {
    return this.productUseCase.getProducts();
  }
}
