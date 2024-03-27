/*
  Warnings:

  - A unique constraint covering the columns `[client_name]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_name` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "client_name" TEXT NOT NULL,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tokens_client_name_key" ON "tokens"("client_name");
