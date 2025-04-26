import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { ProductFilterDto, ProductFilterRequestDto } from 'src/app/dto';
import { ProductUseCase } from 'src/app/usecase/product.usecase';
import { JwtAuthGuard } from 'src/interface/http/guards';

@Controller('products')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProducts(
    @Query() requestFilter?: ProductFilterRequestDto,
    @Headers('Merchant-Id') merchantId?: number,
  ) {
    // Ensure filters are valid
    const filters: ProductFilterDto = {
      ...requestFilter,
      merchantId: merchantId ? Number(merchantId) : undefined,
    };

    return this.productUseCase.getProducts(filters);
  }
}
