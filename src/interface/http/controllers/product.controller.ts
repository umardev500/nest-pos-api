import { Controller, Get, Query } from '@nestjs/common';
import { ProductFilterDto } from 'src/app/dto';
import { ProductUseCase } from 'src/app/usecase/product.usecase';

@Controller('products')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Get()
  getProducts(@Query() filters?: ProductFilterDto) {
    return this.productUseCase.getProducts(filters);
  }
}
