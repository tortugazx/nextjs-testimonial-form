import { NextResponse } from 'next/server'
import { appendToSheet } from '@/lib/google-sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.name || !body.testimonial) {
      return NextResponse.json(
        { success: false, error: 'Nome e depoimento são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar no Google Sheets
    await appendToSheet({
      name: body.name,
      testimonial: body.testimonial,
      feedback: body.feedback
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao salvar depoimento. Tente novamente.' },
      { status: 500 }
    )
  }
}
