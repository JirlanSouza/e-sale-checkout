-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "coupon_percentage" INTEGER NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "freight" DECIMAL(65,30) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");
