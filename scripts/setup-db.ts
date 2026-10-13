import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DATABASE_URL = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set in .env.local");
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase DB\n");

    const sqlDir = path.join(process.cwd(), "lib", "supabase");
    const files = ["schema.sql", "seed.sql", "seed_real.sql", "rls-policies.sql"];

    for (const file of files) {
      const sqlPath = path.join(sqlDir, file);
      const sql = fs.readFileSync(sqlPath, "utf-8");
      console.log(`Running ${file}...`);
      try {
        await client.query(sql);
      } catch (err: unknown) {
        // Schema objects use IF NOT EXISTS for tables but plain CREATE for
        // indexes/policies, so re-runs raise "already exists" — safe to skip.
        const message = err instanceof Error ? err.message : String(err);
        if (/already exists|duplicate/i.test(message)) {
          console.log(`  ~ ${file} skipped (already applied)`);
          continue;
        }
        throw err;
      }
      console.log(`  ✓ ${file} done\n`);
    }

    // Verify
    const result = await client.query("SELECT count(*) FROM hospitals");
    console.log(`Hospitals count: ${result.rows[0].count}`);

    const docs = await client.query("SELECT count(*) FROM doctors");
    console.log(`Doctors count: ${docs.rows[0].count}`);

    const meds = await client.query("SELECT count(*) FROM medicines");
    console.log(`Medicines count: ${meds.rows[0].count}`);

    await client.end();
    console.log("\nAll done!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
