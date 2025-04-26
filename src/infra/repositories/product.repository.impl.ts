import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated';
import { VariantFormatted } from 'src/app/dto';
import { ProductRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private fetchProducts(where?: Prisma.ProductWhereInput) {
    return this.prisma.product.findMany({
      where,
      include: {
        ProductVariant: {
          include: {
            ProductVariantOption: {
              include: {
                variantOption: {
                  include: {
                    variantGroup: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private formatProducts(
    products: Awaited<ReturnType<typeof this.fetchProducts>>,
  ) {
    return products.map((product) => {
      const hasVariants = product.ProductVariant.length > 0;

      const variants: VariantFormatted[] = product.ProductVariant.map(
        (variant) => {
          const size = variant.ProductVariantOption.find(
            (opt) => opt.variantOption.variantGroup.name === 'Size',
          )?.variantOption.value;

          const color = variant.ProductVariantOption.find(
            (opt) => opt.variantOption.variantGroup.name === 'Color',
          )?.variantOption.value;

          return {
            size,
            color,
            price: variant.price.toString(),
            stock: variant.quantity,
          };
        },
      );

      const totalQuantity = hasVariants
        ? variants.reduce((sum, v) => sum + v.stock, 0)
        : product.quantity;

      const price = !hasVariants
        ? product.price.toString()
        : (variants[0]?.price ?? '0');

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        photo: product.photo,
        quantity: totalQuantity,
        capital: product.capital,
        price,
        discount: product.discount,
        barcode: product.barcode,
        variants,
      };
    });
  }

  async find(where?: Prisma.ProductWhereInput) {
    // Fetch products based on the hardcoded search
    const products = await this.fetchProducts(where);
    const formattedProducts = this.formatProducts(products);

    return formattedProducts;
  }
}
