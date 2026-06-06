-- CreateTable
CREATE TABLE `funcionarios` (
    `id` VARCHAR(50) NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `telefone` VARCHAR(30) NOT NULL,
    `endereco` VARCHAR(300) NOT NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `nivelPermissao` ENUM('ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR') NOT NULL DEFAULT 'OPERADOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `funcionarios_usuario_key`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aeronaves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(30) NOT NULL,
    `modelo` VARCHAR(100) NOT NULL,
    `tipo` ENUM('COMERCIAL', 'MILITAR') NOT NULL DEFAULT 'COMERCIAL',
    `capacidade` INTEGER NOT NULL DEFAULT 0,
    `alcance` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `aeronaves_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pecas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `tipo` ENUM('NACIONAL', 'IMPORTADA') NOT NULL DEFAULT 'NACIONAL',
    `fornecedor` VARCHAR(150) NOT NULL,
    `status` ENUM('EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA') NOT NULL DEFAULT 'EM_PRODUCAO',
    `aeronaveId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `prazo` VARCHAR(20) NOT NULL,
    `status` ENUM('PENDENTE', 'ANDAMENTO', 'CONCLUIDA') NOT NULL DEFAULT 'PENDENTE',
    `aeronaveId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapa_funcionarios` (
    `etapaId` INTEGER NOT NULL,
    `funcionarioId` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`etapaId`, `funcionarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- “No matter what you do in life, it’s not legendary unless your friends are there to see it” – Barney Stinson

-- CreateTable
CREATE TABLE `testes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ELETRICO', 'HIDRAULICO', 'AERODINAMICO') NOT NULL DEFAULT 'ELETRICO',
    `resultado` ENUM('APROVADO', 'REPROVADO') NOT NULL DEFAULT 'APROVADO',
    `aeronaveId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pecas` ADD CONSTRAINT `pecas_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `aeronaves`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etapas` ADD CONSTRAINT `etapas_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `aeronaves`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etapa_funcionarios` ADD CONSTRAINT `etapa_funcionarios_etapaId_fkey` FOREIGN KEY (`etapaId`) REFERENCES `etapas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etapa_funcionarios` ADD CONSTRAINT `etapa_funcionarios_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testes` ADD CONSTRAINT `testes_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `aeronaves`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
