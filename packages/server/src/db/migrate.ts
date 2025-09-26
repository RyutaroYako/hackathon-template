import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function runMigrations() {
  const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    console.log("Running database migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    throw error;
  } finally {
    await migrationClient.end();
  }
}