import { Prisma } from 'prisma/generated';

// Build type based on selected fields
export type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    ProductVariant: {
      include: {
        ProductVariantOption: {
          include: {
            variantOption: {
              include: {
                variantGroup: true;
              };
            };
          };
        };
      };
    };
  };
}>;
