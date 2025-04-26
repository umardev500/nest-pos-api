import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    const products = await this.prisma.product.findMany({
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

    const formatted = products.map((product) => {
      const hasVariants = product.ProductVariant.length > 0;

      const variants = product.ProductVariant.map((variant) => {
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
      });

      const totalQuantity = hasVariants
        ? variants.reduce((sum, v) => sum + v.stock, 0)
        : product.quantity;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        photo: product.photo,
        quantity: totalQuantity,
        variants,
      };
    });

    return formatted;
  }
}
