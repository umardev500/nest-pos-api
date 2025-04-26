import { Prisma } from 'prisma/generated';
import { ProductWithVariants } from 'src/domain/entities';

export interface ProductRepository {
  find(where: Prisma.ProductWhereInput): Promise<ProductWithVariants[]>;
  findById(
    where: Prisma.ProductWhereUniqueInput,
  ): Promise<ProductWithVariants | null>;
  deleteById(where: Prisma.ProductWhereUniqueInput): Promise<void>;

  /**
   * Creates a new product in the database, including any related variants if provided.
   *
   * @param data - The data needed to create a product, including details like name, price, categoryId, and variants.
   * @returns The newly created product, including its variants.
   */
  create(data: Prisma.ProductCreateInput): Promise<ProductWithVariants>;
}
