import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  find() {
    return 'hallo';
  }
}
