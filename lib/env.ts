/**
 * Validação de variáveis de ambiente
 * Garante que todas as variáveis necessárias estão configuradas
 */

const requiredEnvVars = [
  'GOOGLE_SHEETS_CLIENT_EMAIL',
  'GOOGLE_SHEETS_PRIVATE_KEY',
  'GOOGLE_SHEETS_SPREADSHEET_ID',
] as const

const optionalEnvVars = {
  GOOGLE_SHEETS_SHEET_NAME: 'Sheet1', // valor padrão
} as const

type RequiredEnvVar = (typeof requiredEnvVars)[number]
type OptionalEnvVar = keyof typeof optionalEnvVars

export function validateEnv() {
  const missing: string[] = []

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente faltando: ${missing.join(', ')}\n` +
        'Configure estas variáveis no arquivo .env.local ou nas configurações da Vercel.'
    )
  }
}

export function getEnv(name: RequiredEnvVar): string
export function getEnv(name: OptionalEnvVar): string
export function getEnv(name: string): string | undefined {
  // Retornar valor padrão se for variável opcional
  if (name in optionalEnvVars) {
    return process.env[name] || optionalEnvVars[name as OptionalEnvVar]
  }

  return process.env[name]
}

// Validar ao importar (apenas no servidor)
if (typeof window === 'undefined') {
  validateEnv()
}
