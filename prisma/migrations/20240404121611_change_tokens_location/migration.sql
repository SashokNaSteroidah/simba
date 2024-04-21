/*
  Warnings:

  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "auth"."token";

-- DropTable
DROP TABLE "main"."tokens";

-- CreateTable
CREATE TABLE "auth"."tokens" (
    "id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_id_key" ON "auth"."tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_client_name_key" ON "auth"."tokens"("client_name");
