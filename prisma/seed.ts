import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@statsmaths.com" },
    update: {},
    create: {
      email: "admin@statsmaths.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create test student user
  const studentPassword = await hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      email: "student@test.com",
      name: "Test Student",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  // Create sample resources
  const resources = [
    {
      title: "Advanced Calculus Complete Guide",
      description: "Comprehensive guide covering limits, derivatives, integrals, and multivariable calculus with solved examples and practice problems.",
      price: 29.99,
      category: "Mathematics",
      featured: true,
      fileUrl: "https://example.com/calculus-guide.pdf",
      previewUrl: "https://example.com/calculus-preview.pdf",
    },
    {
      title: "Statistics Fundamentals",
      description: "Master probability distributions, hypothesis testing, regression analysis, and statistical inference with real-world applications.",
      price: 24.99,
      category: "Statistics",
      featured: true,
      fileUrl: "https://example.com/stats-fundamentals.pdf",
      previewUrl: "https://example.com/stats-preview.pdf",
    },
    {
      title: "Linear Algebra Essentials",
      description: "Complete coverage of vectors, matrices, eigenvalues, linear transformations, and applications in data science.",
      price: 19.99,
      category: "Mathematics",
      featured: false,
      fileUrl: "https://example.com/linear-algebra.pdf",
      previewUrl: "https://example.com/linear-preview.pdf",
    },
    {
      title: "Probability Theory Workbook",
      description: "500+ solved problems in probability theory, from basic concepts to advanced stochastic processes.",
      price: 34.99,
      category: "Both",
      featured: true,
      fileUrl: "https://example.com/probability-workbook.pdf",
      previewUrl: "https://example.com/probability-preview.pdf",
    },
    {
      title: "Differential Equations Solutions Manual",
      description: "Step-by-step solutions to ordinary and partial differential equations with applications in physics and engineering.",
      price: 27.99,
      category: "Mathematics",
      featured: false,
      fileUrl: "https://example.com/diff-equations.pdf",
      previewUrl: "https://example.com/diff-preview.pdf",
    },
    {
      title: "Data Analysis with R",
      description: "Learn statistical computing and graphics with R programming. Includes datasets and case studies.",
      price: 39.99,
      category: "Statistics",
      featured: false,
      fileUrl: "https://example.com/r-analysis.pdf",
      previewUrl: "https://example.com/r-preview.pdf",
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { 
        title: resource.title 
      },
      update: {},
      create: resource,
    });
  }

  console.log("Seed data created successfully!");
  console.log("Admin login: admin@statsmaths.com / admin123");
  console.log("Student login: student@test.com / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
