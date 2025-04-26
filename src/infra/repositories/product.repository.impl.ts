import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    // Fetch all products along with their variants and nested variant options/groups
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

    // Transform raw product data into desired format
    const formatted = products.map((product) => {
      const hasVariants = product.ProductVariant.length > 0;

      // Format variant data with size, color, price, and stock
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
          price: variant.price.toString(), // Convert Decimal to string for output
          stock: variant.quantity,
        };
      });

      // Use total variant stock if variants exist, otherwise use base product stock
      const totalQuantity = hasVariants
        ? variants.reduce((sum, v) => sum + v.stock, 0)
        : product.quantity;

      const price = !hasVariants ? variants[0].price : product.price.toString();

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        photo: product.photo,
        quantity: totalQuantity,
        capital: product.capital,
        price: price,
        discount: product.discount,
        barcode: product.barcode,
        variants,
      };
    });

    return formatted;
  }
}
