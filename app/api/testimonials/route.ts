import { NextResponse } from 'next/server'
import { getErrorMessage, ValidationError } from '@/lib/errors'
import { appendToSheet } from '@/lib/google-sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.name || !body.testimonial) {
      throw new ValidationError('Nome e depoimento são obrigatórios', 'MISSING_FIELDS')
    }

    // Salvar no Google Sheets
    await appendToSheet({
      name: body.name,
      testimonial: body.testimonial,
      feedback: body.feedback,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API:', error)

    const statusCode = error instanceof ValidationError ? error.statusCode : 500
    const errorMessage = getErrorMessage(error)

    return NextResponse.json({ success: false, error: errorMessage }, { status: statusCode })
  }
}
