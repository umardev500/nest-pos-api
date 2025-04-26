import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductUseCase {
  getProducts() {
    return 'products';
  }
}
