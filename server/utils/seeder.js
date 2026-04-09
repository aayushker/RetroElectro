const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const dotenv = require("dotenv");
const prisma = require("../lib/prisma");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const recommenderDir = path.resolve(__dirname, "../../recommender");
const venvPython = path.resolve(recommenderDir, "venv/bin/python");
const pythonCommand = fs.existsSync(venvPython) ? venvPython : "python3";

const runSeedScript = () => {
  const scriptPath = path.resolve(
    __dirname,
    "../../recommender/scripts/seed_neon.py",
  );
  const args = [scriptPath];

  if (process.argv.includes("--skip-embeddings")) {
    args.push("--skip-embeddings");
  }

  const processRef = spawn(pythonCommand, args, {
    cwd: recommenderDir,
    stdio: "inherit",
    env: process.env,
  });

  processRef.on("close", (code) => {
    process.exit(code ?? 0);
  });
};

const deleteData = async () => {
  try {
    const deleted = await prisma.product.deleteMany();
    console.log(`Deleted ${deleted.count} products from products table.`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

if (process.argv.includes("-d")) {
  void deleteData();
} else {
  runSeedScript();
}
