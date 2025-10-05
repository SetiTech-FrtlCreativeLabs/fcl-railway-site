const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@frtlcreativelabs.com' },
      update: {},
      create: {
        email: 'admin@frtlcreativelabs.com',
        password: adminPassword,
        displayName: 'Admin User',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Admin user created');

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: userPassword,
        displayName: 'Test User',
        role: 'USER',
        isActive: true
      }
    });

    console.log('✅ Test user created');

    // Create initiatives
    const initiatives = [
      {
        title: 'Quantum Computing Interface',
        slug: 'quantum-computing-interface',
        summary: 'Revolutionary quantum computing platform for developers',
        longDescription: 'Our quantum computing interface provides developers with the tools and resources needed to build quantum applications. This comprehensive platform includes quantum circuit simulators, algorithm libraries, and extensive documentation.',
        heroImage: 'https://images.unsplash.com/photo-1635070041078-e43c8c05a5e1?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1635070041078-e43c8c05a5e1?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        ],
        featured: true,
        order: 1,
        externalDocsLink: 'https://docs.quantum.example.com',
        status: 'active'
      },
      {
        title: 'Neural Network Optimization',
        slug: 'neural-network-optimization',
        summary: 'Advanced AI optimization techniques for machine learning',
        longDescription: 'Our neural network optimization platform uses cutting-edge techniques to improve model performance, reduce training time, and optimize resource usage. Perfect for enterprise AI applications.',
        heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ccdd014?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1677442136019-21780ccdd014?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        ],
        featured: true,
        order: 2,
        status: 'active'
      },
      {
        title: 'Blockchain Integration Suite',
        slug: 'blockchain-integration-suite',
        summary: 'Comprehensive blockchain development toolkit',
        longDescription: 'Our blockchain integration suite provides developers with everything needed to build decentralized applications. Includes smart contract templates, testing frameworks, and deployment tools.',
        heroImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        ],
        featured: true,
        order: 3,
        status: 'active'
      }
    ];

    for (const initiative of initiatives) {
      await prisma.initiative.upsert({
        where: { slug: initiative.slug },
        update: initiative,
        create: initiative
      });
    }

    console.log('✅ Initiatives created');

    // Create products
    const products = [
      {
        title: 'Quantum Computing Starter Kit',
        sku: 'QCS-001',
        price: 29999, // $299.99 in cents
        currency: 'USD',
        description: 'Complete quantum computing starter kit with development tools, documentation, and sample projects. Perfect for developers looking to explore quantum computing.',
        images: [
          'https://images.unsplash.com/photo-1635070041078-e43c8c05a5e1?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        ],
        inventoryCount: 50,
        initiativeId: 'quantum-computing-interface',
        metadata: {
          category: 'quantum-computing',
          difficulty: 'beginner',
          includes: ['Development tools', 'Documentation', 'Sample projects', 'Community access'],
          features: ['Quantum circuit simulator', 'Algorithm library', 'Tutorials', 'Support']
        },
        stripePriceId: 'price_1234567890',
        cryptoEnabled: true,
        featured: true,
        isActive: true
      },
      {
        title: 'Neural Network Pro License',
        sku: 'NNP-002',
        price: 49999, // $499.99 in cents
        currency: 'USD',
        description: 'Professional license for our Neural Network Optimization platform. Includes advanced features, priority support, and commercial usage rights.',
        images: [
          'https://images.unsplash.com/photo-1677442136019-21780ccdd014?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        ],
        inventoryCount: 25,
        initiativeId: 'neural-network-optimization',
        metadata: {
          category: 'ai-ml',
          difficulty: 'advanced',
          includes: ['Pro features', 'Priority support', 'Commercial license', 'API access'],
          features: ['Advanced optimization', 'Distributed training', 'Real-time monitoring', 'Enterprise support']
        },
        stripePriceId: 'price_2345678901',
        cryptoEnabled: true,
        featured: true,
        isActive: true
      },
      {
        title: 'Blockchain Developer Toolkit',
        sku: 'BDT-003',
        price: 19999, // $199.99 in cents
        currency: 'USD',
        description: 'Comprehensive toolkit for blockchain development. Includes smart contract templates, testing frameworks, and deployment tools.',
        images: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        ],
        inventoryCount: 100,
        initiativeId: 'blockchain-integration-suite',
        metadata: {
          category: 'blockchain',
          difficulty: 'intermediate',
          includes: ['Smart contract templates', 'Testing frameworks', 'Deployment tools', 'Documentation'],
          features: ['Multi-chain support', 'Testing suite', 'Deployment automation', 'Monitoring tools']
        },
        stripePriceId: 'price_3456789012',
        cryptoEnabled: true,
        featured: true,
        isActive: true
      }
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: product,
        create: product
      });
    }

    console.log('✅ Products created');

    // Create site settings
    const siteSettings = [
      {
        key: 'homepage',
        value: JSON.stringify({
          hero: {
            title: 'Welcome to Frtl Creative Labs',
            subtitle: 'Innovation meets creativity in the future of technology',
            ctaText: 'Explore Our Tech'
          },
          whoIsFCL: {
            title: 'Who is Frtl Creative Labs?',
            description: 'We are innovators, creators, and visionaries building the future of technology.'
          }
        })
      },
      {
        key: 'company',
        value: JSON.stringify({
          name: 'Frtl Creative Labs',
          tagline: 'Innovation meets creativity',
          mission: 'Building the future of technology through innovative solutions',
          founded: '2024',
          location: 'Tech City, USA'
        })
      },
      {
        key: 'contact',
        value: JSON.stringify({
          email: 'contact@frtlcreativelabs.com',
          phone: '+1 (555) 123-4567',
          address: '123 Innovation Drive, Tech City, TC 12345'
        })
      }
    ];

    for (const setting of siteSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting
      });
    }

    console.log('✅ Site settings created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@frtlcreativelabs.com / admin123');
    console.log('User: user@example.com / user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
