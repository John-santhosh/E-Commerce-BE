/*
  Warnings:

  - Added the required column `user_role_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_role_id" INTEGER NOT NULL;
