import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? '✅ OK' : '❌ Missing',
    PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? '✅ OK' : '❌ Missing',
    SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ OK' : '❌ Missing',
    SHEET_NAME: process.env.GOOGLE_SHEETS_SHEET_NAME ? '✅ OK' : '❌ Missing',
  }

  return NextResponse.json({
    message: 'Environment Variables Check',
    vars: envVars,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME,
  })
}
