import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductFilterDto } from 'src/app/dto';
import { ProductUseCase } from 'src/app/usecase/product.usecase';
import { JwtAuthGuard } from 'src/interface/http/guards';

@Controller('products')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProducts(@Query() filters?: ProductFilterDto) {
    return this.productUseCase.getProducts(filters);
  }
}
