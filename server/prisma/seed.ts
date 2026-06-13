import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sportzone.com' },
    update: {},
    create: {
      email: 'admin@sportzone.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'shoes' },
      update: {},
      create: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Performance and lifestyle footwear',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Athletic and casual wear',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Sports accessories and gear',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'running' },
      update: {},
      create: {
        name: 'Running',
        slug: 'running',
        description: 'Running shoes and gear',
      },
    }),
  ]);
  console.log('Categories created');

  // Create products
  const products = [
    {
      name: 'UltraBoost Pro',
      slug: 'ultraboost-pro',
      description:
        'Experience ultimate comfort with our flagship running shoe. Features responsive cushioning and a sleek design for both performance and style.',
      price: 189.99,
      comparePrice: 219.99,
      sku: 'UB-PRO-001',
      brand: 'SportZone',
      categoryId: categories[0].id,
      stock: 150,
      tags: JSON.stringify(['running', 'comfort', 'bestseller']),
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'UltraBoost Pro', isPrimary: true },
      ],
      variants: [
        { name: 'Black/White', sku: 'UB-PRO-001-BW', size: '10', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Black/White', sku: 'UB-PRO-001-BW-11', size: '11', color: 'Black', colorCode: '#000000', stock: 25 },
        { name: 'White/Black', sku: 'UB-PRO-001-WB', size: '10', color: 'White', colorCode: '#FFFFFF', stock: 20 },
      ],
    },
    {
      name: 'AeroFit Training Tee',
      slug: 'aerofit-training-tee',
      description:
        'Lightweight, breathable training tee with moisture-wicking technology. Perfect for intense workouts.',
      price: 45.99,
      comparePrice: 55.99,
      sku: 'AFT-TEE-001',
      brand: 'SportZone',
      categoryId: categories[1].id,
      stock: 200,
      tags: JSON.stringify(['training', 'basics', 'breathable']),
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt: 'AeroFit Training Tee', isPrimary: true },
      ],
      variants: [
        { name: 'Black', sku: 'AFT-TEE-001-BLK', size: 'M', color: 'Black', colorCode: '#000000', stock: 50 },
        { name: 'Black', sku: 'AFT-TEE-001-BLK-L', size: 'L', color: 'Black', colorCode: '#000000', stock: 50 },
        { name: 'White', sku: 'AFT-TEE-001-WHT', size: 'M', color: 'White', colorCode: '#FFFFFF', stock: 40 },
      ],
    },
    {
      name: 'ProRunner Jacket',
      slug: 'prorunner-jacket',
      description:
        'Water-resistant running jacket with reflective details. Designed for all-weather running.',
      price: 129.99,
      comparePrice: 159.99,
      sku: 'PRJ-001',
      brand: 'SportZone',
      categoryId: categories[1].id,
      stock: 80,
      tags: JSON.stringify(['running', 'jacket', 'weatherproof']),
      images: [
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', alt: 'ProRunner Jacket', isPrimary: true },
      ],
      variants: [
        { name: 'Navy', sku: 'PRJ-001-NVY', size: 'L', color: 'Navy', colorCode: '#1E3A5F', stock: 20 },
        { name: 'Black', sku: 'PRJ-001-BLK', size: 'L', color: 'Black', colorCode: '#000000', stock: 25 },
      ],
    },
    {
      name: 'Sport Classic Backpack',
      slug: 'sport-classic-backpack',
      description:
        'Durable sports backpack with laptop compartment and ventilated shoe pocket.',
      price: 79.99,
      sku: 'SCB-001',
      brand: 'SportZone',
      categoryId: categories[2].id,
      stock: 100,
      tags: JSON.stringify(['backpack', 'accessories', 'daily']),
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: 'Sport Classic Backpack', isPrimary: true },
      ],
      variants: [],
    },
    {
      name: 'SpeedElite Running Shorts',
      slug: 'speedelite-running-shorts',
      description:
        'Ultra-light running shorts with built-in brief and reflective accents.',
      price: 59.99,
      comparePrice: 69.99,
      sku: 'SER-001',
      brand: 'SportZone',
      categoryId: categories[3].id,
      stock: 120,
      tags: JSON.stringify(['running', 'shorts', 'lightweight']),
      images: [
        { url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800', alt: 'SpeedElite Running Shorts', isPrimary: true },
      ],
      variants: [
        { name: 'Black', sku: 'SER-001-BLK-M', size: 'M', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Black', sku: 'SER-001-BLK-L', size: 'L', color: 'Black', colorCode: '#000000', stock: 30 },
      ],
    },
  ];

  for (const product of products) {
    const { images, variants, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
      },
    });
  }
  console.log('Products created');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
