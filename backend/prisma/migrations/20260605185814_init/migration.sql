-- CreateTable
CREATE TABLE `funcionarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `telefone` VARCHAR(30) NULL,
    `endereco` VARCHAR(300) NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `cargo` VARCHAR(100) NULL,
    `departamento` VARCHAR(100) NULL,
    `nivelPermissao` ENUM('ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR') NOT NULL DEFAULT 'OPERADOR',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ativo',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `funcionarios_email_key`(`email`),
    UNIQUE INDEX `funcionarios_usuario_key`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aeronaves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(30) NOT NULL,
    `modelo` VARCHAR(100) NOT NULL,
    `matricula` VARCHAR(30) NOT NULL,
    `fabricante` VARCHAR(100) NOT NULL,
    `anoFabricacao` INTEGER NOT NULL,
    `tipo` ENUM('COMERCIAL', 'MILITAR') NOT NULL DEFAULT 'COMERCIAL',
    `capacidade` INTEGER NOT NULL DEFAULT 0,
    `alcance` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('aguardando', 'em_producao', 'concluida') NOT NULL DEFAULT 'aguardando',
    `progresso` INTEGER NOT NULL DEFAULT 0,
    `responsavelId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `aeronaves_codigo_key`(`codigo`),
    UNIQUE INDEX `aeronaves_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pecas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `numero` VARCHAR(50) NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,
    `tipo` ENUM('NACIONAL', 'IMPORTADA') NOT NULL DEFAULT 'NACIONAL',
    `status` ENUM('pendente', 'em_teste', 'aprovado', 'reprovado') NOT NULL DEFAULT 'pendente',
    `fornecedor` VARCHAR(150) NULL,
    `aeronaveId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `descricao` TEXT NULL,
    `status` ENUM('pendente', 'em_andamento', 'concluida') NOT NULL DEFAULT 'pendente',
    `ordem` INTEGER NOT NULL DEFAULT 1,
    `prazo` VARCHAR(20) NULL,
    `dataInicio` VARCHAR(20) NULL,
    `dataFim` VARCHAR(20) NULL,
    `responsavel` VARCHAR(150) NULL,
    `aeronaveId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapa_funcionarios` (
    `etapaId` INTEGER NOT NULL,
    `funcionarioId` INTEGER NOT NULL,

    PRIMARY KEY (`etapaId`, `funcionarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `tipo` ENUM('motor', 'pressao', 'eletrico', 'estrutural', 'voo', 'hidraulico', 'aerodinamico') NOT NULL DEFAULT 'eletrico',
    `resultado` ENUM('pendente', 'aprovado', 'reprovado') NOT NULL DEFAULT 'pendente',
    `dataRealizacao` VARCHAR(20) NULL,
    `responsavel` VARCHAR(150) NULL,
    `observacoes` TEXT NULL,
    `aeronaveId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aeronaves` ADD CONSTRAINT `aeronaves_responsavelId_fkey` FOREIGN KEY (`responsavelId`) REFERENCES `funcionarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
