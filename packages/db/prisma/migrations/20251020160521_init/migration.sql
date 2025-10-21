-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shapes" (
    "id" SERIAL NOT NULL,
    "shapeType" TEXT NOT NULL,
    "startOffSetX" INTEGER NOT NULL,
    "startOffSetY" INTEGER NOT NULL,
    "endOffSetX" INTEGER NOT NULL,
    "endOffSetY" INTEGER NOT NULL,
    "radius" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "shapes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_name_key" ON "room"("name");

-- AddForeignKey
ALTER TABLE "shapes" ADD CONSTRAINT "shapes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
