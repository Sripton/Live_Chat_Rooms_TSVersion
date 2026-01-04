-- CreateEnum
CREATE TYPE "RoomRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "RoomRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "status" "RoomRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomRequest_ownerId_idx" ON "RoomRequest"("ownerId");

-- CreateIndex
CREATE INDEX "RoomRequest_roomId_idx" ON "RoomRequest"("roomId");

-- CreateIndex
CREATE INDEX "RoomRequest_userId_idx" ON "RoomRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomRequest_userId_roomId_key" ON "RoomRequest"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "RoomRequest" ADD CONSTRAINT "RoomRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomRequest" ADD CONSTRAINT "RoomRequest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomRequest" ADD CONSTRAINT "RoomRequest_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
