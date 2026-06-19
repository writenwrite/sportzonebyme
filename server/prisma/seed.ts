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
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'UltraBoost Pro - Side View', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', alt: 'UltraBoost Pro - Top View', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', alt: 'UltraBoost Pro - Detail', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', alt: 'UltraBoost Pro - lifestyle', isPrimary: false },
      ],
      variants: [
        { name: 'Black/White', sku: 'UB-PRO-001-BW', size: '10', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Black/White', sku: 'UB-PRO-001-BW-11', size: '11', color: 'Black', colorCode: '#000000', stock: 25 },
        { name: 'White/Black', sku: 'UB-PRO-001-WB', size: '10', color: 'White', colorCode: '#FFFFFF', stock: 20 },
        { name: 'Red', sku: 'UB-PRO-001-RED', size: '10', color: 'Red', colorCode: '#E53E3E', stock: 15 },
        { name: 'Blue', sku: 'UB-PRO-001-BLU', size: '11', color: 'Blue', colorCode: '#3182CE', stock: 18 },
      ],
    },
    {
      name: 'AirMax Runner',
      slug: 'airmax-runner',
      description:
        'Lightweight running shoe with air cushion technology. Perfect for daily runs and training sessions.',
      price: 159.99,
      comparePrice: 189.99,
      sku: 'AMR-001',
      brand: 'SportZone',
      categoryId: categories[0].id,
      stock: 120,
      tags: JSON.stringify(['running', 'lightweight', 'air-cushion']),
      images: [
        { url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800', alt: 'AirMax Runner - Side', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', alt: 'AirMax Runner - Front', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800', alt: 'AirMax Runner - Back', isPrimary: false },
      ],
      variants: [
        { name: 'White', sku: 'AMR-001-WHT', size: '9', color: 'White', colorCode: '#FFFFFF', stock: 25 },
        { name: 'White', sku: 'AMR-001-WHT-10', size: '10', color: 'White', colorCode: '#FFFFFF', stock: 30 },
        { name: 'Black', sku: 'AMR-001-BLK', size: '10', color: 'Black', colorCode: '#000000', stock: 28 },
        { name: 'Gray', sku: 'AMR-001-GRY', size: '11', color: 'Gray', colorCode: '#718096', stock: 20 },
      ],
    },
    {
      name: 'TrailBlazer Hiking Boot',
      slug: 'trailblazer-hiking-boot',
      description:
        'Durable hiking boot with waterproof membrane and aggressive outsole for maximum grip on any terrain.',
      price: 219.99,
      comparePrice: 259.99,
      sku: 'TBH-001',
      brand: 'SportZone',
      categoryId: categories[0].id,
      stock: 80,
      tags: JSON.stringify(['hiking', 'boot', 'waterproof']),
      images: [
        { url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800', alt: 'TrailBlazer Boot - Side', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800', alt: 'TrailBlazer Boot - Front', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1605812860320-3e8d87e2e8e0?w=800', alt: 'TrailBlazer Boot - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'Brown', sku: 'TBH-001-BRN', size: '10', color: 'Brown', colorCode: '#8B4513', stock: 20 },
        { name: 'Brown', sku: 'TBH-001-BRN-11', size: '11', color: 'Brown', colorCode: '#8B4513', stock: 18 },
        { name: 'Black', sku: 'TBH-001-BLK', size: '10', color: 'Black', colorCode: '#000000', stock: 22 },
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
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt: 'AeroFit Tee - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', alt: 'AeroFit Tee - Back', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', alt: 'AeroFit Tee - Folded', isPrimary: false },
      ],
      variants: [
        { name: 'Black', sku: 'AFT-TEE-001-BLK', size: 'M', color: 'Black', colorCode: '#000000', stock: 50 },
        { name: 'Black', sku: 'AFT-TEE-001-BLK-L', size: 'L', color: 'Black', colorCode: '#000000', stock: 50 },
        { name: 'White', sku: 'AFT-TEE-001-WHT', size: 'M', color: 'White', colorCode: '#FFFFFF', stock: 40 },
        { name: 'White', sku: 'AFT-TEE-001-WHT-L', size: 'L', color: 'White', colorCode: '#FFFFFF', stock: 35 },
        { name: 'Gray', sku: 'AFT-TEE-001-GRY', size: 'M', color: 'Gray', colorCode: '#718096', stock: 25 },
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
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', alt: 'ProRunner Jacket - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1544923246-77307dd270d3?w=800', alt: 'ProRunner Jacket - Back', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', alt: 'ProRunner Jacket - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'Navy', sku: 'PRJ-001-NVY', size: 'L', color: 'Navy', colorCode: '#1E3A5F', stock: 20 },
        { name: 'Black', sku: 'PRJ-001-BLK', size: 'L', color: 'Black', colorCode: '#000000', stock: 25 },
        { name: 'Red', sku: 'PRJ-001-RED', size: 'M', color: 'Red', colorCode: '#E53E3E', stock: 15 },
      ],
    },
    {
      name: 'Performance Hoodie',
      slug: 'performance-hoodie',
      description:
        'Soft fleece hoodie with kangaroo pocket. Perfect for warm-ups and casual wear.',
      price: 89.99,
      comparePrice: 109.99,
      sku: 'PH-001',
      brand: 'SportZone',
      categoryId: categories[1].id,
      stock: 100,
      tags: JSON.stringify(['hoodie', 'casual', 'warm-up']),
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', alt: 'Performance Hoodie - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1578768079470-38a66aedb63e?w=800', alt: 'Performance Hoodie - Side', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', alt: 'Performance Hoodie - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'Black', sku: 'PH-001-BLK', size: 'M', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Black', sku: 'PH-001-BLK-L', size: 'L', color: 'Black', colorCode: '#000000', stock: 28 },
        { name: 'Gray', sku: 'PH-001-GRY', size: 'M', color: 'Gray', colorCode: '#718096', stock: 22 },
        { name: 'Navy', sku: 'PH-001-NVY', size: 'L', color: 'Navy', colorCode: '#1E3A5F', stock: 20 },
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
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: 'Sport Backpack - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800', alt: 'Sport Backpack - Side', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800', alt: 'Sport Backpack - Open', isPrimary: false },
      ],
      variants: [],
    },
    {
      name: 'Gym Duffle Bag',
      slug: 'gym-duffle-bag',
      description:
        'Spacious duffle bag with separate shoe compartment and water-resistant base.',
      price: 69.99,
      comparePrice: 89.99,
      sku: 'GDB-001',
      brand: 'SportZone',
      categoryId: categories[2].id,
      stock: 75,
      tags: JSON.stringify(['bag', 'gym', 'duffle']),
      images: [
        { url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800', alt: 'Gym Duffle - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', alt: 'Gym Duffle - Side', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: 'Gym Duffle - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'Black', sku: 'GDB-001-BLK', size: 'One Size', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Navy', sku: 'GDB-001-NVY', size: 'One Size', color: 'Navy', colorCode: '#1E3A5F', stock: 25 },
      ],
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
        { url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800', alt: 'Running Shorts - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', alt: 'Running Shorts - Side', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800', alt: 'Running Shorts - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'Black', sku: 'SER-001-BLK-M', size: 'M', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Black', sku: 'SER-001-BLK-L', size: 'L', color: 'Black', colorCode: '#000000', stock: 30 },
        { name: 'Gray', sku: 'SER-001-GRY-M', size: 'M', color: 'Gray', colorCode: '#718096', stock: 25 },
      ],
    },
    {
      name: 'Sport Performance Socks',
      slug: 'sport-performance-socks',
      description:
        'Cushioned performance socks with arch support and moisture-wicking fabric. Pack of 3.',
      price: 24.99,
      sku: 'SPS-001',
      brand: 'SportZone',
      categoryId: categories[2].id,
      stock: 300,
      tags: JSON.stringify(['socks', 'basics', 'pack']),
      images: [
        { url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c87?w=800', alt: 'Performance Socks - Pack', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', alt: 'Performance Socks - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'White', sku: 'SPS-001-WHT-M', size: 'M', color: 'White', colorCode: '#FFFFFF', stock: 80 },
        { name: 'White', sku: 'SPS-001-WHT-L', size: 'L', color: 'White', colorCode: '#FFFFFF', stock: 75 },
        { name: 'Black', sku: 'SPS-001-BLK-M', size: 'M', color: 'Black', colorCode: '#000000', stock: 70 },
      ],
    },
    {
      name: 'Sport Watch Pro',
      slug: 'sport-watch-pro',
      description:
        'Multi-sport GPS watch with heart rate monitor and 7-day battery life.',
      price: 299.99,
      comparePrice: 349.99,
      sku: 'SWP-001',
      brand: 'SportZone',
      categoryId: categories[2].id,
      stock: 50,
      tags: JSON.stringify(['watch', 'gps', 'tech']),
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', alt: 'Sport Watch - Front', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800', alt: 'Sport Watch - Side', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800', alt: 'Sport Watch - Detail', isPrimary: false },
      ],
      variants: [
        { name: 'Black', sku: 'SWP-001-BLK', size: 'One Size', color: 'Black', colorCode: '#000000', stock: 25 },
        { name: 'White', sku: 'SWP-001-WHT', size: 'One Size', color: 'White', colorCode: '#FFFFFF', stock: 20 },
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
