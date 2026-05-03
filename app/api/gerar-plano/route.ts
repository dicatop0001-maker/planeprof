import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

function gerarPlanoLocal(disciplina: string, serie: string, bimestre: string, conteudo: string, numObjetivos: number, numAtividades: number, nivelAtividade: string, numAulas: number) {
  const habilidades: Record<string, string[]> = {
    'Matemática': ['EI03ET01','EI03ET02','EI03ET03','EF01MA01','EF01MA02'],
    'Língua Portuguesa': ['EI03EF01','EI03EF02','EI03EF03','EF01LP01','EF01LP02'],
    'Ciências': ['EI03ET04','EI03ET05','EF01CI01','EF01CI02'],
    'História': ['EI03TS01','EI03TS02','EF01HI01'],
    'Geografia': ['EI03TS03','EI03TS04','EF01GE01'],
    'Arte': ['EI03CG01','EI03CG02','EF01AR01'],
    'Educação Física': ['EI03CG03','EI03CG04','EF01EF01'],
  }

  const nivelTexto = nivelAtividade === 'facil' ? 'simples e acessíveis' : nivelAtividade === 'dificil' ? 'desafiadoras e complexas' : 'adequadas ao nível da turma'

  const objetivosBase = [
    `Explorar e compreender conceitos de ${conteudo} de forma lúdica e concreta`,
    `Desenvolver raciocínio lógico e habilidades cognitivas através de ${conteudo}`,
    `Relacionar ${conteudo} com situações do cotidiano da criança`,
    `Expressar descobertas sobre ${conteudo} verbalmente e graficamente`,
    `Ampliar vocabulário e conhecimentos relacionados a ${conteudo}`,
  ]

  const aulas = numAulas > 1 ? `Este planejamento está distribuído em ${numAulas} aulas.\n\n` : ''

  const desenvolvimento = aulas + `**Momento 1 - Acolhida e sensibilização (10 min)**
Reuna as crianças em roda e inicie uma conversa sobre ${conteudo}. Use materiais visuais, imagens ou objetos concretos para despertar a curiosidade.

**Momento 2 - Exploração e descoberta (20 min)**
Proponha ${numAtividades} atividade${numAtividades > 1 ? 's' : ''} ${nivelTexto} com materiais manipuláveis. Divida as crianças em pequenos grupos. Incentive a exploração com perguntas mediadoras.

**Momento 3 - Registro e expressão (15 min)**
Cada criança registra sua experiência. O professor circula apoiando e incentivando verbalizações.

**Momento 4 - Roda de conversa final (10 min)**
Retome com todos juntos. Cada grupo compartilha descobertas. Sistematize os aprendizados no quadro.`

  return {
    habilidades_bncc: (habilidades[disciplina] || ['EI03ET01','EI03ET02']).slice(0, 3),
    objetivos: objetivosBase.slice(0, numObjetivos),
    desenvolvimento,
    conclusao: `Para encerrar sobre ${conteudo}, realize uma roda de conversa onde cada criança conta "o que aprendi hoje". Registre no diário de bordo os avanços individuais. Como extensão, sugira às famílias que conversem sobre o tema em casa.`,
    dinamica: `**Dinâmica: "Caça ao Tesouro de ${conteudo}"**
Esconda pelo ambiente da sala objetos relacionados ao tema. As crianças, em duplas, percorrem o espaço procurando os itens. Ao encontrar cada objeto, realizam uma tarefa relacionada ao conteúdo. Desenvolve autonomia, cooperação e reforça os conceitos de forma prazerosa.`,
  }
}

function gerarPdiLocal(disciplina: string, serie: string, conteudo: string, pdiAluno: string, pdiNecessidades: string) {
  const nomeAluno = pdiAluno ? `para ${pdiAluno}` : 'para o(a) aluno(a)'
  const nec = pdiNecessidades || 'necessidades específicas de aprendizagem'
  return `**PDI - Plano de Desenvolvimento Individual**
Aluno(a): ${pdiAluno || '[Nome do aluno]'}
Necessidades: ${nec}
Disciplina: ${disciplina} | Turma: ${serie}
Conteúdo adaptado: ${conteudo}

**Objetivos funcionais adaptados:**
• Participar das atividades sobre ${conteudo} com suporte visual e concreto
• Explorar os conceitos de ${conteudo} respeitando seu ritmo de aprendizagem
• Desenvolver autonomia nas tarefas adaptadas ${nomeAluno}

**Adaptações e recursos visuais:**
• 🖼️ Utilizar cartões com imagens e símbolos relacionados a ${conteudo}
• 📅 Cronograma visual ilustrado com sequência das atividades da aula
• 🎯 Objetos concretos e manipuláveis como apoio para ${conteudo}
• ✋ Atividades com suporte tátil quando necessário
• ⏱️ Tempo estendido para realização das tarefas

**Estratégias pedagógicas inclusivas:**
• Instrução direta com demonstração visual passo a passo
• Pareamento com colega tutor durante as atividades
• Redução do número de questões, mantendo qualidade conceitual
• Feedback positivo frequente e imediato

**Comunicação Alternativa Aumentativa (CAA):**
• Disponibilizar prancha de comunicação com símbolos do tema ${conteudo}
• Aceitar respostas por apontamento, gesto ou expressão alternativa
• Incentivar participação oral sem exigência de resposta complexa

**Avaliação adaptada:**
• Observação participante e portfólio fotográfico
• Avaliação por participação e engajamento, não apenas produto final
• Registro descritivo dos progressos individuais`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, bimestre, conteudo, orientacoes, numObjetivos, tipoLetra, numAulas, numAtividades, nivelAtividade, regenerar, gerarPdi, pdiAluno, pdiNecessidades } = body

    if (!disciplina || !serie || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const nObj = parseInt(numObjetivos) || 3
    const nAulas = parseInt(numAulas) || 1
    const nAtiv = parseInt(numAtividades) || 2
    const nivel = nivelAtividade || 'medio'

    // Modo PDI
    if (gerarPdi) {
      const pdiTexto = gerarPdiLocal(disciplina, serie, conteudo, pdiAluno || '', pdiNecessidades || '')
      return NextResponse.json({ success: true, plano: { pdi: pdiTexto }, fonte: 'local' })
    }

    const planoLocal = gerarPlanoLocal(disciplina, serie, bimestre, conteudo, nObj, nAtiv, nivel, nAulas)

    // Modo regenerar seção específica
    if (regenerar) {
      return NextResponse.json({ success: true, plano: { [regenerar]: (planoLocal as any)[regenerar] || planoLocal.desenvolvimento }, fonte: 'local' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.length < 20) {
      return NextResponse.json({ success: true, plano: planoLocal, fonte: 'local' })
    }

    try {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({ apiKey })
      const tipoLetraInstrucao = tipoLetra === 'cursiva' ? 'Atividades em letra cursiva.' : 'Atividades em letra de forma (bastão).'
      const nivelInstrucao = nivel === 'facil' ? 'atividades simples e acessíveis' : nivel === 'dificil' ? 'atividades desafiadoras' : 'atividades de nível médio'

      const prompt = `Especialista em educação infantil brasileira e BNCC. Crie plano de aula:
- Disciplina: ${disciplina} | Série: ${serie} | Bimestre: ${bimestre}°
- Conteúdo: ${conteudo} | ${nObj} objetivos | ${nAulas} aula(s)
- ${nAtiv} atividades (${nivelInstrucao}) | ${tipoLetraInstrucao}
${orientacoes ? '- Orientações: ' + orientacoes : ''}

Retorne APENAS JSON:
{"habilidades_bncc":["código1","código2","código3"],"objetivos":["obj1","obj2"],"desenvolvimento":"Passo a passo com momentos","conclusao":"Como encerrar e avaliar","dinamica":"Jogo ou dinâmica lúdica"}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: 'Educação infantil brasileira. Responda APENAS JSON válido.' }, { role: 'user', content: prompt }],
        temperature: 0.7, max_tokens: 2000,
      })
      const responseText = completion.choices[0].message.content || '{}'
      let planoGerado
      try {
        const cleaned = responseText.replace(/^```json\n?/, '').replace(/```$/, '').trim()
        planoGerado = JSON.parse(cleaned)
      } catch {
        planoGerado = planoLocal
      }
      return NextResponse.json({ success: true, plano: planoGerado, fonte: 'ia' })
    } catch (openaiError: any) {
      console.error('OpenAI erro:', openaiError.message)
      return NextResponse.json({ success: true, plano: planoLocal, fonte: 'local' })
    }
  } catch (error: any) {
    console.error('Erro geral:', error)
    return NextResponse.json({ error: 'Erro ao gerar plano: ' + error.message }, { status: 500 })
  }
}
