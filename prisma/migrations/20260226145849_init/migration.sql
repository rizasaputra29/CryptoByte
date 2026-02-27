-- CreateTable
CREATE TABLE "EncryptionHistory" (
    "id" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "plaintext" TEXT NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "keyUsed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EncryptionHistory_pkey" PRIMARY KEY ("id")
);
