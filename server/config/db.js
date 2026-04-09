const prisma = require("../lib/prisma");

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Add it in your server environment variables.",
    );
  }

  await prisma.$queryRaw`SELECT 1`;
  console.log("PostgreSQL Connected");
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

module.exports = {
  connectDB,
  disconnectDB,
};
