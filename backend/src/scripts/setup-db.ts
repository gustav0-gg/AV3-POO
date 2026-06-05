/**
 * Script de setup do banco de dados.
 * Execute: ts-node src/scripts/setup-db.ts
 */
import { execSync } from 'child_process'

function run(cmd: string, label: string) {
  try {
    execSync(cmd, { stdio: 'inherit' })
    console.log(`✅ ${label}`)
  } catch {
    console.error(`❌ Falha: ${label}`)
    process.exit(1)
  }
}

console.log('\n🔧 AeroCode — Setup do Banco de Dados\n')
run('npx prisma generate',                    'Prisma Client gerado')
run('npx prisma migrate dev --name init',     'Migrations aplicadas')
run('npx ts-node prisma/seed.ts',             'Seed executado')
console.log('\n✅ Banco de dados configurado com sucesso!\n')
