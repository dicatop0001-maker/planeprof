import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, bimestre, conteudo, orientacoes, numObjetivos } = body

    if (!disciplina || !serie || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const prompt = `Você é um especialista em educação brasileira e na BNCC (Base Nacional Comum Curricular).
Crie um plano de aula detalhado com as seguintes especificações:

- Disciplina: ${disciplina}
- Série/Ano: ${serie}
- Bimestre: ${bimestre}°
- Conteúdo: ${conteudo}
- Número de objetivos: ${numObjetivos || 3}
${orientacoes ? '- Orientações especiais: ' + orientacoes : ''}

Retorne um JSON com a seguinte estrutura EXATA (sem markdown):
{
  "habilidades_bncc": ["código habilidade 1", "código habilidade 2"],
  "objetivos": ["objetivo 1", "objetivo 2", "objetivo 3"],
  "desenvolvimento": "Descrição detalhada do passo a passo da aula (pelo menos 300 palavras)",
  "conclusao": "Sugestão de encerramento e reflexão final",
  "dinamica": "Descrição de um jogo ou dinâmica para engajar os alunos"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é um especialista em educação brasileira. Responda APENAS com JSON válido, sem markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0].message.content || '{}'
    
    let planoGerado
    try {
      planoGerado = JSON.parse(responseText)
    } catch {
      planoGerado = {
        habilidades_bncc: ['EF-0' + serie.charAt(0) + '-MA-01'],
        objetivos: ['Compreender o conteúdo de ' + conteudo],
        desenvolvimento: responseText,
        conclusao: 'Revisar os conceitos aprendidos com os alunos.',
        dinamica: 'Jogo de perguntas e respostas sobre o tema.'
      }
    }

    return NextResponse.json({ success: true, plano: planoGerado })
  } catch (error: any) {
    console.error('Erro ao gerar plano:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar plano. Verifique as configurações da API.' },
      { status: 500 }
    )
  }
}
