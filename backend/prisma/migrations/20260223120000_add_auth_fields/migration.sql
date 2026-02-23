-- Add password column for credential-based authentication
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Normalize existing null roles before enforcing NOT NULL
UPDATE "User"
SET "role" = 'intern'
WHERE "role" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "role" SET DEFAULT 'intern',
ALTER COLUMN "role" SET NOT NULL;
