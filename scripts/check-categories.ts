import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Existing categories:');
  categories.forEach(cat => {
    console.log(`  - ${cat.name} (slug: ${cat.slug})`);
  });
  
  if (categories.length === 0) {
    console.log('\n⚠️  No categories found. Run the seed script first!');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

