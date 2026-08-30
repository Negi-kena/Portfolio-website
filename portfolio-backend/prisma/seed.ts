/// <reference types="node" />

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "kennaakoo143@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin12345!";
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      name: process.env.ADMIN_NAME ?? "Negaso Kena",
      role: "ADMIN",
    },
  });
  console.log(`✔ Admin user ready: ${adminEmail}`);

  // --- Site settings (singleton) ---
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitle: "I'm Negaso Kena",
      heroSubtitle: "A Passionate Full-Stack Developer",
      bio: "I am self tought full-stack developer, dedicated to building high-performance web applications. I focus on clean architecture, intuitive user interfaces, and robust backend logic.",
      email: adminEmail,
      github: "https://github.com/negi-kena",
      linkedin: "https://linkedin.com/in/negi-kena17",
    },
  });
  console.log("✔ Site settings ready");

  // --- Tags ---
  const tagNames = [
    "React",
    "Node.js",
    "TypeScript",
    "MySQL",
    "Express",
    "Tailwind",
  ];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-"),
        },
      }),
    ),
  );
  console.log(`✔ ${tags.length} tags ready`);

  // --- Sample project (placeholder, easy to edit/replace via admin dashboard later) ---
  const reactTag = tags.find((t) => t.name === "React");
  const nodeTag = tags.find((t) => t.name === "Node.js");
  const mysqlTag = tags.find((t) => t.name === "MySQL");

  await prisma.project.upsert({
    where: { slug: "student-management-system" },
    update: {},
    create: {
      title: "Student Management System",
      slug: "student-management-system",
      summary:
        "A CRUD app for managing student records, grades, and enrollment.",
      description:
        "A full-stack application for school administrators to manage students, courses, and grades, with role-based access control.",
      imageUrl: "/uploads/placeholder-project.png",
      featured: true,
      order: 1,
      tags: {
        create: [
          { tagId: reactTag!.id },
          { tagId: nodeTag!.id },
          { tagId: mysqlTag!.id },
        ],
      },
    },
  });
  console.log("✔ Sample project ready");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
