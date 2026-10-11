-- Upgrade only the legacy journal-easy schema. Run on a backed-up database copy first.
BEGIN;
-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('READ', 'WRITE');

-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('NEW', 'UPDATE', 'NONE');

-- CreateEnum
CREATE TYPE "PubDocStatus" AS ENUM ('PUBLISHED', 'FROZEN', 'UNPUBLISHED');

-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "content" SET DATA TYPE TEXT USING
  CASE WHEN jsonb_typeof("content"::jsonb) = 'string' THEN "content"::jsonb #>> '{}'
       ELSE "content"::text END;
WITH ordered AS (
  SELECT "id", (ROW_NUMBER() OVER (PARTITION BY "userId", "parentId" ORDER BY "createdAt", "id") * 1024)::integer AS position
  FROM "Doc"
)
UPDATE "Doc" SET "sortOrder" = ordered.position FROM ordered WHERE "Doc"."id" = ordered."id";
ALTER TABLE "Doc" ALTER COLUMN "sortOrder" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TokenUsage" ALTER COLUMN "tokensLimit" SET DEFAULT 100000;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InvitationCode" ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DocVersion" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentBinary" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareRelation" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "access" "AccessType" NOT NULL DEFAULT 'READ',
    "noticeType" "NoticeType" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "ShareRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PubDoc" (
    "id" TEXT NOT NULL,
    "publishId" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "PubDocStatus" NOT NULL DEFAULT 'PUBLISHED',
    "statusReason" TEXT,
    "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdatedBy" TEXT,
    "thumbUpCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PubDoc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocVersion_docId_createdAt_idx" ON "DocVersion"("docId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "PubDoc_publishId_key" ON "PubDoc"("publishId");

-- CreateIndex
CREATE INDEX "Doc_userId_parentId_sortOrder_idx" ON "Doc"("userId", "parentId", "sortOrder");

-- AddForeignKey
ALTER TABLE "DocVersion" ADD CONSTRAINT "DocVersion_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocVersion" ADD CONSTRAINT "DocVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareRelation" ADD CONSTRAINT "ShareRelation_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareRelation" ADD CONSTRAINT "ShareRelation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareRelation" ADD CONSTRAINT "ShareRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PubDoc" ADD CONSTRAINT "PubDoc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PubDoc" ADD CONSTRAINT "PubDoc_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;


COMMIT;
