-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "id_order" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItem_id_order_idx" ON "OrderItem"("id_order");

-- CreateIndex
CREATE INDEX "Order_code_cpf_idx" ON "Order"("code", "cpf");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
