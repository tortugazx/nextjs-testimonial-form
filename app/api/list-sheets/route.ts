import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    // Buscar informações da planilha
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    const sheetNames = response.data.sheets?.map(sheet => ({
      title: sheet.properties?.title,
      index: sheet.properties?.index,
      sheetId: sheet.properties?.sheetId,
    }))

    return NextResponse.json({
      spreadsheetId,
      sheetNames,
      currentConfig: process.env.GOOGLE_SHEETS_SHEET_NAME,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: error.toString(),
    }, { status: 500 })
  }
}
