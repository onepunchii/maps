
import postgres from 'postgres';
import dotenv from 'dotenv';
import { users } from '../lib/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';

dotenv.config({ path: '.env.local' });

// FORCE USE OF PORT 6543 (Transaction Pooler) -> Mirroring Production
// Ensure we are using the exact string from env, which has 6543
const connectionString = process.env.DATABASE_URL!;

console.log("Testing connection to:", connectionString.replace(/:[^:]*@/, ":****@")); // Hide password log

// Exact config from src/lib/db/index.ts
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function testConnection() {
    console.log("⏳ Connecting to Transaction Pooler (6543)...");
    try {
        // 1. Simple raw query
        const result = await client`SELECT 1 as connected`;
        console.log("✅ Raw Connection Success:", result);

        // 2. Drizzle Query
        console.log("⏳ Testing Drizzle Select...");
        const userCount = await db.select().from(users).limit(1);
        console.log("✅ Drizzle Query Success. Rows found:", userCount.length);

    } catch (e: any) {
        console.error("❌ Connection Failed!");
        console.error("Error Name:", e.name);
        console.error("Error Message:", e.message);
        console.error("Error Code:", e.code); // Postgres Error Code
        if (e.cause) console.error("Cause:", e.cause);
    } finally {
        await client.end();
    }
}

testConnection();
