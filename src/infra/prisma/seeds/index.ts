import seedProducts from 'src/infra/prisma/seeds/product.seed';
import seedVariants from 'src/infra/prisma/seeds/variant.seed';

async function main() {
  console.log('🌱 Starting seeding...');
  await seedVariants();
  await seedProducts();
  console.log('✅ Seeding complete!');
}

main().catch((error) => {
  console.error(error);
});
