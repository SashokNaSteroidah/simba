-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "main";

-- CreateEnum
CREATE TYPE "main"."Roles" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "main"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" CHAR(80) NOT NULL,
    "role" "main"."Roles" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."tokens" (
    "id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."token" (
    "id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "main"."users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "main"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "main"."users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "posts_id_key" ON "main"."posts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_id_key" ON "main"."tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_client_name_key" ON "main"."tokens"("client_name");

-- CreateIndex
CREATE UNIQUE INDEX "token_id_key" ON "auth"."token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "token_client_name_key" ON "auth"."token"("client_name");
