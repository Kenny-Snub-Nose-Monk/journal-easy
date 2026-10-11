import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const sql = new URL('../prisma/legacy-upgrade.sql', import.meta.url)
if (!process.argv.includes('--apply')) {
  console.log(readFileSync(sql, 'utf8'))
  console.log('Dry run only. After backing up and testing a database copy: npm run db:migrate:legacy -- --apply')
} else {
  const result = spawnSync(
    process.execPath,
    ['node_modules/prisma/build/index.js', 'db', 'execute', '--schema', 'prisma/schema.prisma', '--file', sql.pathname],
    { stdio: 'inherit' }
  )
  process.exit(result.status ?? 1)
}
