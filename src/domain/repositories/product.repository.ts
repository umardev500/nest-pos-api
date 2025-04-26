import { Prisma } from 'prisma/generated';
import { ProductWithVariants } from 'src/domain/entities';

export interface ProductRepository {
  find(where: Prisma.ProductWhereInput): Promise<ProductWithVariants[]>;
  findById(
    where: Prisma.ProductWhereUniqueInput,
  ): Promise<ProductWithVariants | null>;
}
