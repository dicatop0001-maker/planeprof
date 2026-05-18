import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// ============================================================
// GERADOR DE ATIVIDADES - ESTILO TUDO SALA DE AULA
// Formato: Texto Base + 10 questões variadas + Gabarito
// Questões: dissertativa, múltipla escolha, V/F, lacuna, ordenar
// ============================================================

// ---- TEXTOS BASE por disciplina e conteúdo ----
function gerarTextoBase(disciplina: string, serie: string, conteudo: string, ehInfantil: boolean): string {
  const disc = disciplina.toLowerCase()
  if (disc.includes('matem')) {
    return `📐 ${conteudo.toUpperCase()}

Os conceitos de ${conteudo} fazem parte do nosso cotidiano de maneiras surpreendentes. Desde a organização de listas de compras até o cálculo de distâncias e medidas em obras e projetos, as habilidades matemáticas são fundamentais para resolver problemas reais.

Nas escolas brasileiras, a BNCC orienta que os alunos desenvolvam o raciocínio lógico-matemático por meio de situações-problema contextualizadas. O estudo de ${conteudo} permite compreender padrões, relações e estruturas que aparecem tanto em situações simples do dia a dia quanto em problemas mais complexos.

Exemplo prático: ao trabalhar com ${conteudo}, o aluno aprende a identificar regularidades, formular estratégias de resolução e verificar resultados — competências essenciais para o pensamento científico e tecnológico.

📌 Leia o texto acima e responda às questões a seguir com atenção.`
  } else if (disc.includes('portugu') || disc.includes('língua')) {
    return `📚 ${conteudo.toUpperCase()}

A língua portuguesa é um instrumento vivo de comunicação, expressão e cultura. Dominar seus recursos — como ${conteudo} — amplia a capacidade de leitura, escrita e interação social dos estudantes.

Segundo a BNCC, o ensino de Língua Portuguesa deve partir de situações reais de uso da língua, valorizando os gêneros textuais presentes no cotidiano dos alunos. O trabalho com ${conteudo} contribui para a formação de leitores e produtores de texto mais competentes e críticos.

Um leitor habilidoso sabe identificar as diferentes funções dos elementos linguísticos em um texto, reconhecendo como ${conteudo} contribui para a coerência, coesão e adequação do discurso. Essa habilidade é fundamental tanto para a vida acadêmica quanto para o exercício da cidadania.

📌 Leia o texto acima e responda às questões a seguir com atenção.`
  } else if (disc.includes('ciênc') || disc.includes('cienc')) {
    return `🔬 ${conteudo.toUpperCase()}

As Ciências Naturais nos ajudam a compreender o mundo ao nosso redor — dos fenômenos físicos e químicos às interações entre os seres vivos. O estudo de ${conteudo} é parte essencial dessa jornada de descoberta.

A Base Nacional Comum Curricular (BNCC) destaca que o ensino de Ciências deve estimular a curiosidade científica, o pensamento investigativo e a compreensão das relações entre ciência, tecnologia, sociedade e ambiente. Ao estudar ${conteudo}, os alunos desenvolvem a capacidade de observar, questionar, experimentar e formular conclusões baseadas em evidências.

Na prática, os conhecimentos sobre ${conteudo} têm aplicações diretas na saúde, no meio ambiente e no desenvolvimento tecnológico. Compreender esses conceitos é fundamental para a formação de cidadãos conscientes e capazes de tomar decisões informadas sobre questões científicas e ambientais do mundo contemporâneo.

📌 Leia o texto acima e responda às questões a seguir com atenção.`
  } else if (disc.includes('histór') || disc.includes('histor')) {
    return `🏛️ ${conteudo.toUpperCase()}

A História é a ciência que estuda as ações humanas ao longo do tempo. Compreender ${conteudo} nos permite entender como as sociedades se formaram, como os processos históricos se desenvolveram e como o passado influencia o presente.

A BNCC orienta que o ensino de História deve desenvolver o pensamento histórico dos alunos, habilitando-os a identificar mudanças e permanências, comparar épocas e sociedades, e compreender os múltiplos sujeitos que constroem a história. O estudo de ${conteudo} é fundamental para que o aluno desenvolva consciência histórica e cidadania crítica.

Ao analisar ${conteudo}, é importante considerar diferentes perspectivas: a dos grupos dominantes e dos grupos subalternizados, as causas e consequências dos eventos, e as conexões entre acontecimentos locais, nacionais e globais.

📌 Leia o texto acima e responda às questões a seguir com atenção.`
  } else if (disc.includes('geogr')) {
    return `🌍 ${conteudo.toUpperCase()}

A Geografia nos ajuda a compreender o espaço geográfico — a relação entre a sociedade humana e a natureza em diferentes escalas. O estudo de ${conteudo} é fundamental para entender como o espaço é produzido, organizado e transformado ao longo do tempo.

Segundo a BNCC, o ensino de Geografia deve capacitar os alunos a pensar espacialmente, utilizando conceitos como lugar, território, região, natureza e sociedade. Ao estudar ${conteudo}, desenvolvemos a capacidade de analisar criticamente os problemas socioambientais, econômicos e políticos que afetam as diferentes regiões do planeta.

A compreensão de ${conteudo} permite também reconhecer as desigualdades e os conflitos que marcam o espaço geográfico, estimulando a formação de cidadãos comprometidos com a justiça social e a sustentabilidade ambiental.

📌 Leia o texto acima e responda às questões a seguir com atenção.`
  } else {
    return `📖 ${conteudo.toUpperCase()}

O estudo de ${conteudo} em ${disciplina} é parte fundamental da formação escolar dos estudantes brasileiros, conforme previsto na Base Nacional Comum Curricular (BNCC). Por meio desse conhecimento, os alunos desenvolvem competências essenciais para sua vida acadêmica, profissional e cidadã.

A aprendizagem de ${conteudo} envolve não apenas a aquisição de conceitos teóricos, mas também o desenvolvimento de habilidades práticas de aplicação, análise crítica e criatividade. Ao dominar esses conhecimentos, o estudante amplia sua capacidade de compreender o mundo e de resolver problemas de forma eficaz.

Os conteúdos de ${disciplina} presentes nesta atividade foram selecionados para proporcionar uma aprendizagem significativa, conectando os conhecimentos escolares com situações reais do cotidiano dos alunos.

📌 Leia o texto acima e responda às questões a seguir com atenção.`
  }
}

// ---- QUESTÕES por disciplina no estilo Tudo Sala de Aula ----
function gerarQuestoesTudoSalaDeAula(disciplina: string, serie: string, conteudo: string, n: number): { questoes: string[], gabarito: string[] } {
  const disc = disciplina.toLowerCase()
  const ehFundII = serie.match(/6|7|8|9/)
  const ehMedio = serie.toLowerCase().includes('médio') || serie.toLowerCase().includes('medio')
  const ehInfantil = serie.toLowerCase().match(/infantil|berç|maternal|pré/)

  // Banco de questões por tipo (rotativo por conteúdo)
  const rot = conteudo.length % 3
  
  const questoes: string[] = []
  const gabarito: string[] = []

  // Q1 - Dissertativa direta
  questoes.push(`1. O que é ${conteudo}? Explique com suas próprias palavras, dando um exemplo do cotidiano.

${ehInfantil ? '[Resposta oral ou com desenho]' : '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n' + '_'.repeat(60)}`)
  gabarito.push(`1. Resposta pessoal — verificar se o aluno demonstra compreensão do conceito e apresenta exemplo adequado.`)

  // Q2 - Múltipla escolha
  let q2Alt: string[] = []
  let q2Correta = ''
  if (disc.includes('matem')) {
    q2Alt = [`a) ${conteudo} é utilizado apenas em cálculos avançados, sem aplicação no cotidiano.`, `b) ${conteudo} é um conceito matemático que pode ser aplicado para resolver problemas práticos do dia a dia.`, `c) ${conteudo} só aparece em livros didáticos e não tem utilidade fora da escola.`, `d) ${conteudo} é exclusivo das ciências exatas e não se relaciona com outras disciplinas.`]
    q2Correta = 'b'
  } else if (disc.includes('portugu')) {
    q2Alt = [`a) ${conteudo} é irrelevante para a leitura e a escrita de textos.`, `b) ${conteudo} é utilizado apenas em textos literários, sem função em textos informativos.`, `c) ${conteudo} contribui para a coerência e a clareza dos textos, facilitando a comunicação.`, `d) ${conteudo} é uma regra gramatical que não influencia o sentido dos textos.`]
    q2Correta = 'c'
  } else if (disc.includes('ciênc') || disc.includes('cienc')) {
    q2Alt = [`a) ${conteudo} é um fenômeno isolado, sem relação com outros processos naturais.`, `b) ${conteudo} está presente apenas em laboratórios científicos, sem ocorrência na natureza.`, `c) ${conteudo} é observável na natureza e tem impacto direto no equilíbrio dos ecossistemas.`, `d) ${conteudo} é estudado apenas por especialistas, sem relevância para o cotidiano.`]
    q2Correta = 'c'
  } else {
    q2Alt = [`a) ${conteudo} é um tema isolado, sem conexão com outros aspectos da disciplina.`, `b) ${conteudo} é relevante apenas para especialistas na área.`, `c) ${conteudo} relaciona-se com outros temas da disciplina e com a realidade social dos estudantes.`, `d) ${conteudo} é um conteúdo sem aplicação prática fora do contexto escolar.`]
    q2Correta = 'c'
  }
  questoes.push(`2. Sobre ${conteudo}, assinale a alternativa CORRETA:\n\n${q2Alt.join('\n')}`)
  gabarito.push(`2. ${q2Correta.toUpperCase()}`)

  // Q3 - Aplicação / situação-problema
  questoes.push(`3. Observe a situação a seguir e responda:\n\n"Um estudante precisa aplicar os conhecimentos sobre ${conteudo} para resolver um problema da vida real."\n\nComo esse estudante poderia utilizar o que aprendeu sobre ${conteudo} para solucionar o desafio? Descreva ao menos dois passos do raciocínio.\n\n${ehInfantil ? '[Resposta oral]' : '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n' + '_'.repeat(60)}`)
  gabarito.push(`3. Resposta pessoal — verificar se o aluno demonstra aplicação correta dos conceitos de ${conteudo}.`)

  // Q4 - Verdadeiro ou Falso com X
  const itensVF = [
    `(  ) ${conteudo} é um conceito estudado na disciplina de ${disciplina}.`,
    `(  ) A compreensão de ${conteudo} contribui para o desenvolvimento do pensamento crítico.`,
    `(  ) ${conteudo} não tem relação com outras áreas do conhecimento.`,
    `(  ) O estudo de ${conteudo} está previsto na BNCC para a série do aluno.`,
    `(  ) A aprendizagem de ${conteudo} é importante apenas para fins acadêmicos.`,
  ]
  const respostasVF = ['V', 'V', 'F', 'V', 'F']
  questoes.push(`4. Leia as afirmativas abaixo e assinale (V) para VERDADEIRO e (F) para FALSO:\n\n${itensVF.join('\n')}`)
  gabarito.push(`4. V / V / F / V / F`)

  // Q5 - Completar lacuna
  questoes.push(`5. Complete as frases abaixo com as palavras do quadro:\n\n[${conteudo.split(' ').slice(0, 3).join(' — ')} — conhecimento — aprendizagem]\n\na) O estudo de _____________ contribui para a formação do pensamento crítico dos estudantes.\nb) A _____________ de novos conceitos é facilitada quando relacionamos o conteúdo ao cotidiano.\nc) Compreender _____________ em ${disciplina} é fundamental para o desenvolvimento das competências da BNCC.`)
  gabarito.push(`5. a) ${conteudo.split(' ')[0] || conteudo} / b) aprendizagem / c) ${conteudo.split(' ')[0] || conteudo}`)

  // Q6 - Relação ou ordenação
  questoes.push(`6. Numere a segunda coluna de acordo com a primeira, relacionando os conceitos de ${conteudo}:\n\n(1) Conceito central     (  ) Aplicação prática no cotidiano\n(2) Característica       (  ) Definição do termo principal\n(3) Exemplo             (  ) Propriedade ou atributo\n(4) Aplicação           (  ) Caso específico do conceito`)
  gabarito.push(`6. 4 / 1 / 2 / 3`)

  // Q7 - Dissertativa aprofundada
  questoes.push(`7. De que forma o conhecimento sobre ${conteudo} pode ser útil na vida fora da escola? Dê um exemplo concreto e explique sua resposta.\n\n${ehInfantil ? '[Resposta oral ou com desenho]' : '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n' + '_'.repeat(60)}`)
  gabarito.push(`7. Resposta pessoal — avaliar capacidade de transferência do conhecimento e argumentação.`)

  // Q8 - Múltipla escolha com justificativa
  questoes.push(`8. Analise as afirmativas sobre ${conteudo} e marque a alternativa que apresenta a relação CORRETA:\n\na) ${conteudo} não se relaciona com as competências gerais da BNCC.\nb) ${conteudo} desenvolve apenas habilidades técnicas, sem impacto na formação cidadã.\nc) O estudo de ${conteudo} integra conhecimentos, habilidades e atitudes, contribuindo para a formação integral do estudante.\nd) ${conteudo} é um conteúdo isolado, sem conexão com outras disciplinas do currículo.`)
  gabarito.push(`8. C`)

  // Q9 - Análise crítica / argumentação
  questoes.push(`9. "O aprendizado escolar deve estar conectado à realidade dos estudantes."\n\nCom base nessa afirmação e no que você aprendeu sobre ${conteudo}, escreva um parágrafo argumentando POR QUE esse conteúdo é relevante para a sua vida.\n\n${ehInfantil ? '[Resposta oral]' : '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n' + '_'.repeat(60)}`)
  gabarito.push(`9. Resposta argumentativa pessoal — verificar se o aluno apresenta pelo menos 2 argumentos coerentes.`)

  // Q10 - Síntese / produção
  questoes.push(`10. Para finalizar, crie um exemplo próprio que demonstre sua compreensão sobre ${conteudo}. Pode ser um problema, uma situação, uma frase ou um mini-texto.\n\n${ehInfantil ? '[Produção oral ou desenho]' : '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n' + '_'.repeat(60)}`)
  gabarito.push(`10. Produção pessoal — avaliar criatividade e domínio do conteúdo.`)

  // Retornar somente as n primeiras questões pedidas
  return {
    questoes: questoes.slice(0, n),
    gabarito: gabarito.slice(0, n)
  }
}

// ---- Formata a atividade completa no estilo Tudo Sala de Aula ----
function formatarAtividadeTudoSalaDeAula(
  disciplina: string, serie: string, conteudo: string, bimestre: string,
  nivel: string, numAulas: number, objetivos: string[],
  habilidadeBNCC: string, n: number
): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|berç|maternal|pré/)
  const textoBase = gerarTextoBase(disciplina, serie, conteudo, !!ehInfantil)
  const { questoes, gabarito } = gerarQuestoesTudoSalaDeAula(disciplina, serie, conteudo, n)
  const nivelLabel = nivel === 'facil' ? 'Fácil' : nivel === 'dificil' ? 'Difícil' : 'Médio'
  const totalMin = numAulas * 50

  const cabecalho = `╔══════════════════════════════════════════════════╗
  PLANEPROF — ATIVIDADE PEDAGÓGICA
  Disciplina: ${disciplina}  |  Série: ${serie}  |  ${bimestre}° Bimestre
  Conteúdo: ${conteudo}  |  Nível: ${nivelLabel}
  Tempo estimado: ${totalMin} minutos
╚══════════════════════════════════════════════════╝

Nome: ________________________________________________  Nº: _____
Turma: ________________  Data: ___/___/______  Nota: ______________`

  const rodape = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 GABARITO

${gabarito.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 PLANEJAMENTO PARA O PROFESSOR

Objeto do conhecimento: ${conteudo}

Objetivo da Aula: ${objetivos.length > 0 ? objetivos[0] : 'Compreender, analisar e aplicar os conceitos de ' + conteudo + ' em situações concretas.'}

Habilidade da BNCC: ${habilidadeBNCC || '(conforme série e disciplina — consulte o documento da BNCC)'}

Nível de dificuldade: ${nivelLabel}  |  Tempo total: ${totalMin} min`

  return `${cabecalho}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 TEXTO BASE

${textoBase}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 QUESTÕES (${questoes.length} questões)

${questoes.join('\n\n')}

${rodape}`
}

// ---- Busca conteúdo de URL (para o modo "Usar Modelo") ----
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Planeprof/1.0)' },
      signal: AbortSignal.timeout(8000)
    })
    if (!resp.ok) throw new Error('HTTP ' + resp.status)
    const html = await resp.text()
    // Strip HTML tags to get plain text
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
    return text.substring(0, 4000)
  } catch (e: any) {
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      disciplina, serie, conteudo, nivel, quantidade, tipoLetra, objetivos,
      bimestre, numAulas, habilidadesBNCC, promptAtividade,
      modeloUrl, modeloTexto
    } = body

    const n = Math.min(Math.max(parseInt(quantidade) || 10, 5), 15)
    const nivelLabel = nivel === 'facil' ? 'Fácil' : nivel === 'dificil' ? 'Difícil' : 'Médio'
    const totalMin = (parseInt(numAulas) || 1) * 50
    const objetivosArr = Array.isArray(objetivos) ? objetivos : (objetivos ? [objetivos] : [])
    const habilidadeBNCC = Array.isArray(habilidadesBNCC) ? habilidadesBNCC[0] || '' : habilidadesBNCC || ''
    const bimestreStr = bimestre || '1'

    // --- Modo URL: busca conteúdo da URL e usa como modelo ---
    let textoModeloFinal = modeloTexto || ''
    if (modeloUrl && modeloUrl.trim().startsWith('http')) {
      const urlContent = await fetchUrlContent(modeloUrl.trim())
      if (urlContent) textoModeloFinal = urlContent
    }

    // --- CHECA API KEY ---
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.length < 20) {
      // Fallback local com formato tudosaladeaula.com
      const atividadeTexto = formatarAtividadeTudoSalaDeAula(
        disciplina || 'Geral', serie || 'Ensino Fundamental',
        conteudo || 'Conteúdo da aula', bimestreStr, nivel || 'medio',
        parseInt(numAulas) || 1, objetivosArr, habilidadeBNCC, n
      )
      return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: atividadeTexto }, fonte: 'local' })
    }

    // --- MODO COM MODELO (arquivo ou URL) ---
    let promptFinal = ''
    if (textoModeloFinal) {
      promptFinal = `Você é um especialista em pedagogia brasileira e na BNCC.

O professor enviou este MODELO de atividade como referência:
---
${textoModeloFinal.substring(0, 3000)}${textoModeloFinal.length > 3000 ? '\n[...continua...]' : ''}
---

TAREFA: Crie uma NOVA atividade pedagógica seguindo EXATAMENTE o mesmo estilo, formato e estrutura do modelo acima, mas com conteúdo sobre "${conteudo}" de ${disciplina} para ${serie}.

DADOS DA NOVA ATIVIDADE:
- Disciplina: ${disciplina}
- Série: ${serie}  
- Conteúdo: ${conteudo}
- Bimestre: ${bimestreStr}°
- Nível: ${nivelLabel}
- Quantidade de questões: ${n}
- Tempo total: ${totalMin} minutos
${objetivosArr.length > 0 ? '- Objetivo: ' + objetivosArr[0] : ''}
${habilidadeBNCC ? '- Habilidade BNCC: ' + habilidadeBNCC : ''}

REGRAS:
1. Reproduza o layout e a estrutura do modelo
2. Crie questões 100% específicas sobre "${conteudo}"
3. Varie os tipos: dissertativa, múltipla escolha (A/B/C/D), V/F, lacuna, ordenação, argumentativa
4. Inclua cabeçalho com nome/turma/data, texto base contextualizado, questões numeradas e gabarito no final
5. Siga o padrão do site Tudo Sala de Aula: texto introdutório com informações sobre o conteúdo + questões progressivas + gabarito comentado + planejamento para o professor

Retorne APENAS o texto formatado da atividade, sem markdown extra.`
    } else if (promptAtividade) {
      // Modo prompt customizado do professor
      promptFinal = promptAtividade
    } else {
      // Modo padrão - estilo Tudo Sala de Aula
      promptFinal = `Você é um pedagogo especialista na BNCC e no estilo editorial do site "Tudo Sala de Aula" (tudosaladeaula.com).

Crie uma ATIVIDADE IMPRESSA completa no estilo Tudo Sala de Aula para:
- Disciplina: ${disciplina}
- Série: ${serie}
- Conteúdo: ${conteudo}
- Bimestre: ${bimestreStr}°
- Nível: ${nivelLabel}
- Quantidade de questões: ${n}
- Tempo total: ${totalMin} minutos
${objetivosArr.length > 0 ? '- Objetivos: ' + objetivosArr.join('; ') : ''}
${habilidadeBNCC ? '- Habilidade BNCC: ' + habilidadeBNCC : ''}

FORMATO OBRIGATÓRIO (igual ao Tudo Sala de Aula):

1. CABEÇALHO: Nome da instituição + disciplina + série + data + nome do aluno + turma + nota

2. TEXTO BASE (obrigatório): Um texto informativo/contextual de 3-4 parágrafos, ESPECÍFICO sobre "${conteudo}", com:
   - Introdução contextualizada ao tema
   - Conceitos principais explicados de forma acessível
   - Conexão com a realidade do aluno
   - Indicação para ler com atenção antes das questões

3. QUESTÕES (${n} questões numeradas), variando OBRIGATORIAMENTE entre:
   - Questões dissertativas/abertas (2-3 questões)
   - Múltipla escolha com 4 alternativas A/B/C/D (3-4 questões)  
   - Verdadeiro ou Falso com marcação (V) e (F) — lista com 4-5 itens (1 questão)
   - Completar lacunas com palavras do quadro (1 questão)
   - Análise crítica ou argumentação pessoal (1-2 questões)
   Cada questão deve ser 100% específica sobre "${conteudo}" — PROIBIDO enunciados genéricos.

4. GABARITO: Ao final, com respostas claras numeradas. Questões abertas: "Resposta pessoal — avaliar [critério específico]"

5. PLANEJAMENTO DO PROFESSOR: Objeto do conhecimento + Objetivo da aula + Habilidade da BNCC + nível

IMPORTANTE: A atividade deve ter a qualidade e o formato das atividades do site Tudo Sala de Aula, com texto base rico, questões progressivas pela Taxonomia de Bloom e gabarito detalhado.

Retorne APENAS o texto formatado da atividade, sem markdown extra.`
    }

    try {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({ apiKey })
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em pedagogia brasileira, BNCC e produção de material didático no estilo do site Tudo Sala de Aula (tudosaladeaula.com). Crie atividades com texto base contextualizado, questões variadas e progressivas, e gabarito detalhado. Suas atividades devem ser específicas, ricas e prontas para impressão.'
          },
          { role: 'user', content: promptFinal }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })
      const atividadeTexto = completion.choices[0]?.message?.content || ''
      if (!atividadeTexto.trim()) throw new Error('resposta vazia')
      return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: atividadeTexto }, fonte: 'ia' })
    } catch (openaiError: any) {
      console.error('[gerar-atividade] OpenAI erro:', openaiError.message)
      // Fallback local com formato tudosaladeaula.com
      const atividadeTexto = formatarAtividadeTudoSalaDeAula(
        disciplina || 'Geral', serie || 'Ensino Fundamental',
        conteudo || 'Conteúdo da aula', bimestreStr, nivel || 'medio',
        parseInt(numAulas) || 1, objetivosArr, habilidadeBNCC, n
      )
      return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: atividadeTexto }, fonte: 'local' })
    }

  } catch (error: any) {
    console.error('[gerar-atividade] Erro geral:', error)
    return NextResponse.json({ error: 'Erro ao gerar atividade: ' + error.message }, { status: 500 })
  }
}
