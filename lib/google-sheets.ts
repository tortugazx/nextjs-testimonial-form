import { google } from 'googleapis'
import { getEnv } from './env'

export async function appendToSheet(data: {
  name: string
  testimonial: string
  feedback?: string
}) {
  try {
    // 1. Configurar autenticação com Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: getEnv('GOOGLE_SHEETS_CLIENT_EMAIL'),
        private_key: getEnv('GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const spreadsheetId = getEnv('GOOGLE_SHEETS_SPREADSHEET_ID')
    const sheetName = getEnv('GOOGLE_SHEETS_SHEET_NAME')

    // 2. Adicionar linha na planilha
    // Adiciona aspas simples se o nome da aba tiver espaços
    const rangeWithQuotes = sheetName.includes(' ') ? `'${sheetName}'!A:D` : `${sheetName}!A:D`

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: rangeWithQuotes,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [
            new Date().toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            }),
            data.name,
            data.testimonial,
            data.feedback || '',
          ],
        ],
      },
    })
  } catch (error) {
    console.error('Erro ao salvar no Google Sheets:', error)
    throw new Error('Falha ao salvar depoimento')
  }
}
