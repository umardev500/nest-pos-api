import { Injectable } from '@nestjs/common';
import { ProductRepositoryImpl } from 'src/infra/repositories';

@Injectable()
export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryImpl) {}

  getProducts() {
    return this.productRepository.find();
  }
}
