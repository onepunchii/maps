
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const run = async () => {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client);

    console.log("Running migration for poll_comments...");

    try {
        await client`
            CREATE TABLE IF NOT EXISTS "poll_comments" (
                "id" serial PRIMARY KEY NOT NULL,
                "poll_id" integer NOT NULL,
                "user_id" uuid NOT NULL,
                "content" text NOT NULL,
                "created_at" timestamp DEFAULT now()
            );
        `;

        await client`
            ALTER TABLE "poll_comments" ADD CONSTRAINT "poll_comments_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;
        `;

        await client`
            ALTER TABLE "poll_comments" ADD CONSTRAINT "poll_comments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
        `;

        console.log("Migration completed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
};

run();
