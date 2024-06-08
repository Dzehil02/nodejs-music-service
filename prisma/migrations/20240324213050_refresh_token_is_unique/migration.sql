/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `UserTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserTokens_refreshToken_key" ON "UserTokens"("refreshToken");
