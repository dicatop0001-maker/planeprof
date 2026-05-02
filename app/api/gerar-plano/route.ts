import { NextRequest, NextResponse } from 'next/server'

// Dynamic route - always run on server
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, bimestre, conteudo, orientacoes, numObjetivos } = body

    if (!disciplina || !serie || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Serviço de IA não configurado' }, { status: 503 })
    }

    // Importação dinâmica para evitar erros no build
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey })

    const prompt = `Você é um especialista em educação brasileira e na BNCC.
Crie um plano de aula com:
- Disciplina: ${disciplina}
- Série/Ano: ${serie}  
- Bimestre: ${bimestre}°
- Conteúdo: ${conteudo}
- Objetivos: ${numObjetivos || 3}
${orientacoes ? '- Orientações: ' + orientacoes : ''}

Retorne JSON válido com esta estrutura (sem markdown):
{
  "habilidades_bncc": ["código1", "código2"],
  "objetivos": ["objetivo1", "objetivo2"],
  "desenvolvimento": "Passo a passo detalhado da aula",
  "conclusao": "Como encerrar e avaliar a aula",
  "dinamica": "Jogo ou dinâmica para engajar alunos"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Especialista em educação brasileira. Responda APENAS com JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0].message.content || '{}'
    
    let planoGerado
    try {
      const cleaned = responseText.replace(/^[^{]*/, '').replace(/[^}]*$/, '')
      planoGerado = JSON.parse(cleaned)
    } catch {
      planoGerado = {
        habilidades_bncc: ['EF' + serie.replace(/[^0-9]/g, '').substring(0,2) + 'LP01'],
        objetivos: ['Compreender o conteúdo: ' + conteudo],
        desenvolvimento: responseText,
        conclusao: 'Revisão dos conceitos com os alunos.',
        dinamica: 'Quiz oral sobre o conteúdo aprendido.'
      }
    }

    return NextResponse.json({ success: true, plano: planoGerado })
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Erro ao gerar plano: ' + error.message }, { status: 500 })
  }
}
