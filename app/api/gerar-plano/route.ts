import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Gerador de plano local (fallback quando não há API key válida)
function gerarPlanoLocal(disciplina: string, serie: string, bimestre: string, conteudo: string, numObjetivos: number) {
  const habilidades: Record<string, string[]> = {
    'Matemática': ['EI03ET01', 'EI03ET02', 'EI03ET03'],
    'Língua Portuguesa': ['EI03EF01', 'EI03EF02', 'EI03EF03'],
    'Ciências': ['EI03ET04', 'EI03ET05'],
    'História': ['EI03TS01', 'EI03TS02'],
    'Geografia': ['EI03TS03', 'EI03TS04'],
    'Arte': ['EI03CG01', 'EI03CG02'],
    'Educação Física': ['EI03CG03', 'EI03CG04'],
  }
  const objetivosBase = [
    `Explorar e compreender conceitos de ${conteudo} de forma lúdica e concreta`,
    `Desenvolver raciocínio lógico e habilidades cognitivas através de ${conteudo}`,
    `Relacionar ${conteudo} com situações do cotidiano da criança`,
    `Expressar descobertas e aprendizagens sobre ${conteudo} verbalmente e graficamente`,
    `Ampliar vocabulário e conhecimentos relacionados a ${conteudo}`,
  ]
  return {
    habilidades_bncc: (habilidades[disciplina] || ['EI03ET01', 'EI03ET02']).slice(0, 3),
    objetivos: objetivosBase.slice(0, numObjetivos),
    desenvolvimento: `**Momento 1 - Acolhida e sensibilização (10 min)**\nReuna as crianças em roda e inicie uma conversa sobre ${conteudo}. Pergunte o que elas já sabem sobre o assunto. Use materiais visuais como imagens, cartões coloridos ou objetos concretos para despertar a curiosidade.\n\n**Momento 2 - Exploração e descoberta (20 min)**\nProponha uma atividade prática com materiais manipuláveis. Divida as crianças em pequenos grupos e distribua os materiais. Incentive a exploração livre e observe as interações, fazendo perguntas mediadoras como: "O que vocês descobriram?", "Por que isso acontece?".\n\n**Momento 3 - Registro e expressão (15 min)**\nCada criança registra sua experiência através de desenho, colagem ou escrita espontânea. O professor circula, apoiando e incentivando as crianças a verbalizarem suas descobertas.\n\n**Momento 4 - Roda de conversa (10 min)**\nRetome com todos juntos. Cada grupo compartilha suas descobertas. O professor sistematiza os principais aprendizados no quadro ou em painel coletivo.`,
    conclusao: `Para encerrar a aula sobre ${conteudo}, realize uma avaliação formativa através da observação participante e dos registros produzidos pelas crianças. Proponha uma roda de conversa onde cada criança conta "o que aprendi hoje". Registre no diário de bordo os avanços individuais e coletivos. Como extensão, sugira às famílias que conversem sobre o tema em casa, relacionando com situações do cotidiano.`,
    dinamica: `**Dinâmica: "Caça ao Tesouro de ${conteudo}"**\nEsconda pelo ambiente da sala objetos relacionados ao tema. As crianças, divididas em duplas, percorrem o espaço procurando os itens. Ao encontrar cada objeto, devem realizar uma tarefa relacionada ao conteúdo (contar, classificar, nomear, etc.). A dinâmica desenvolve autonomia, cooperação e reforça os conceitos de forma prazerosa e motivadora.`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, bimestre, conteudo, orientacoes, numObjetivos, tipoLetra } = body

    if (!disciplina || !serie || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const nObj = parseInt(numObjetivos) || 3
    const apiKey = process.env.OPENAI_API_KEY

    // Se não tem API key, usa gerador local
    if (!apiKey || apiKey.length < 20) {
      const plano = gerarPlanoLocal(disciplina, serie, bimestre, conteudo, nObj)
      return NextResponse.json({ success: true, plano, fonte: 'local' })
    }

    try {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({ apiKey })

      const tipoLetraInstrucao = tipoLetra === 'cursiva'
        ? 'As atividades devem ser descritas indicando uso de letra cursiva.'
        : 'As atividades devem usar letra de forma (bastão/imprensa).'

      const prompt = `Você é especialista em educação infantil brasileira e BNCC para crianças de 0-6 anos.
Crie um plano de aula completo:
- Disciplina: ${disciplina}
- Série: ${serie}
- Bimestre: ${bimestre}°
- Conteúdo: ${conteudo}
- Objetivos: ${nObj}
- Tipo de letra: ${tipoLetraInstrucao}
${orientacoes ? '- Orientações: ' + orientacoes : ''}

Retorne APENAS JSON válido (sem markdown):
{
  "habilidades_bncc": ["código1", "código2", "código3"],
  "objetivos": ["objetivo1", "objetivo2"],
  "desenvolvimento": "Passo a passo detalhado com momentos da aula",
  "conclusao": "Como encerrar, avaliar e registrar",
  "dinamica": "Jogo ou dinâmica lúdica para engajar"
}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Especialista em educação infantil brasileira. Responda APENAS com JSON válido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const responseText = completion.choices[0].message.content || '{}'
      let planoGerado
      try {
        const cleaned = responseText.replace(/^```json\n?/, '').replace(/```$/, '').trim()
        planoGerado = JSON.parse(cleaned)
      } catch {
        planoGerado = gerarPlanoLocal(disciplina, serie, bimestre, conteudo, nObj)
      }

      return NextResponse.json({ success: true, plano: planoGerado, fonte: 'ia' })
    } catch (openaiError: any) {
      console.error('OpenAI erro:', openaiError.message)
      // Fallback para gerador local se OpenAI falhar
      const plano = gerarPlanoLocal(disciplina, serie, bimestre, conteudo, nObj)
      return NextResponse.json({ success: true, plano, fonte: 'local' })
    }

  } catch (error: any) {
    console.error('Erro geral:', error)
    return NextResponse.json({ error: 'Erro ao gerar plano: ' + error.message }, { status: 500 })
  }
}
