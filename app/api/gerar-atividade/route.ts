import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// === BANCO DE IMAGENS EDUCATIVAS POR TEMA (Wikimedia Commons - domínio público) ===
const BANCO_IMAGENS: Record<string, { url: string; descricao: string }[]> = {
  matematica: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_-_finding_a_missing_number.png/320px-Simple_algebra_-_finding_a_missing_number.png', descricao: 'Equação matemática' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Counting_frame_abacus.jpg/320px-Counting_frame_abacus.jpg', descricao: 'Ábaco para contagem' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Numberblock_1-10.png/320px-Numberblock_1-10.png', descricao: 'Blocos de números' },
  ],
  geometria: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Platonic_Solids.svg/320px-Platonic_Solids.svg.png', descricao: 'Sólidos geométricos' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Square_-_black_simple.svg/240px-Square_-_black_simple.svg.png', descricao: 'Formas planas' },
  ],
  portugues: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Livros e leitura' },
  ],
  natureza: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Natureza' },
  ],
  ciencias: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Ciências naturais' },
  ],
  historia: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'História' },
  ],
  default: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Material escolar' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Crayons_from_above.jpg/320px-Crayons_from_above.jpg', descricao: 'Lápis de cor' },
  ],
}

function detectarTema(disciplina: string, conteudo: string): string {
  const d = (disciplina + ' ' + conteudo).toLowerCase()
  if (d.match(/matem|numero|conta|soma|subtra|multiplic|divis|frac|medid|equac|expres/)) {
    if (d.match(/form|geomet|circulo|quadrado|triangulo|ret|solido|poligon|angulo/)) return 'geometria'
    return 'matematica'
  }
  if (d.match(/portugu|letra|leitura|escrita|texto|gram|ortograf|vocabul|silab|pontuac|narrat|interpret/)) return 'portugues'
  if (d.match(/natur|plant|flor|arvore|meio ambient|ecossist|biosfera|solo|agua|clima|sustent/)) return 'natureza'
  if (d.match(/histor|civiliz|guerra|brasil|povo|cultura|tradicao|patrimoni|republica|monarq/)) return 'historia'
  if (d.match(/cienc|experim|quimic|fisic|laborat|fenomen|eletric|animal|bicho|corpo humano|celula/)) return 'ciencias'
  return 'default'
}

function getImagensParaTema(tema: string, n: number): { url: string; descricao: string }[] {
  const pool = BANCO_IMAGENS[tema] || BANCO_IMAGENS.default
  const result: { url: string; descricao: string }[] = []
  for (let i = 0; i < n; i++) result.push(pool[i % pool.length])
  return result
}

function gerarExemplosQuestoes(disciplina: string, serie: string, conteudo: string, nivel: string): string {
  const ehInfantil = (serie || '').match(/infantil|pré|maternal|berçario/i)
  const ehFund1 = (serie || '').match(/1[°o]|2[°o]|3[°o]|4[°o]|5[°o]|primeiro|segundo|terceiro|quarto|quinto/i)

  if (ehInfantil) {
    return 'ORIENTAÇÕES PARA EDUCAÇÃO INFANTIL sobre "' + conteudo + '":\n- Use atividades de pintar, ligar, circular, contar objetos\n- Frases curtíssimas, letras grandes, espaços amplos\n- Máximo 2 linhas para escrever\n- Prefira: correspondência visual, sequência lógica, contagem concreta\nExemplo: "Pinte de azul todos os círculos:" ou "Quantos pássaros você vê? ___"'
  }

  if (ehFund1) {
    return 'ORIENTAÇÕES PARA ' + serie + ' sobre "' + conteudo + '" (nível ' + nivel + '):\n- Enunciados diretos e concretos, exemplos do cotidiano da criança\n- Questões ligadas a situações reais: compras, brincadeiras, família, natureza\n- Múltipla escolha com alternativas simples e claras\n- Máximo 3 linhas para dissertativas\nExemplo de enunciado bom: "João foi ao mercado e comprou 3 maçãs. Depois ganhou mais 5 de sua mãe. Quantas maçãs ele tem ao todo?"'
  }

  return 'ORIENTAÇÕES PARA ' + serie + ' sobre "' + conteudo + '" (nível ' + nivel + '):\n- Questões que exijam interpretação, análise e aplicação do conteúdo\n- Use dados reais, textos contextualizados, situações-problema complexas\n- Distratores das múltiplas escolhas devem ser plausíveis mas incorretos\n- Dissertativas devem pedir argumentação, não apenas definição\nExemplo: "Com base no que você estudou sobre ' + conteudo + ', explique como esse fenômeno afeta o cotidiano brasileiro, citando pelo menos dois exemplos concretos."'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, conteudo, nivel, quantidade, tipoLetra, objetivos } = body

    if (!conteudo) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório' }, { status: 400 })
    }

    const n = Math.min(Math.max(parseInt(quantidade) || 3, 1), 10)
    const nivelLabel = nivel === 'facil' ? 'Fácil' : nivel === 'dificil' ? 'Difícil' : 'Médio'
    const letra = tipoLetra === 'cursiva' ? 'letra cursiva' : 'letra de forma'
    const tema = detectarTema(disciplina || '', conteudo)
    const imgs = getImagensParaTema(tema, n)

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave da API OpenAI não configurada' }, { status: 500 })
    }

    const tiposDeAtividade = [
      'Interpretação de Texto com Questões Dissertativas',
      'Múltipla Escolha (4 alternativas A, B, C, D)',
      'Complete as Lacunas com Vocabulário Específico',
      'Produção Escrita / Redação Dirigida',
      'Resolução de Problemas / Situação-Problema',
      'Verdadeiro ou Falso com Justificativa',
      'Relacione as Colunas (conceitos x definições)',
      'Mapa Conceitual / Organização de Ideias',
      'Pesquisa e Investigação Guiada',
      'Exercício Prático / Aplicação do Conteúdo',
    ]

    const ehInfantil = (serie || '').toLowerCase().match(/infantil|pré|maternal|berçario/)
    const faixaEtaria = ehInfantil
      ? 'Educação Infantil (4-6 anos), use linguagem simples, frases curtas, muitas imagens e atividades lúdicas'
      : serie + ' — adapte o vocabulário, complexidade e raciocínio exigido para essa faixa etária'

    const objetivosTexto = objetivos
      ? (Array.isArray(objetivos) ? objetivos.join('; ') : String(objetivos))
      : ''

    const exemploQuestoes = gerarExemplosQuestoes(disciplina || '', serie || '', conteudo, nivelLabel)

    const prompt = 'Você é um especialista em educação brasileira e na BNCC. Crie EXATAMENTE ' + n + ' atividade(s) impressa(s) de ALTA QUALIDADE PEDAGÓGICA para:\n\n' +
      '📚 DISCIPLINA: ' + (disciplina || 'Educação Geral') + '\n' +
      '🏫 SÉRIE/ANO: ' + (serie || 'Ensino Fundamental') + '\n' +
      '👶 FAIXA ETÁRIA: ' + faixaEtaria + '\n' +
      '📖 CONTEÚDO: ' + conteudo + '\n' +
      '🎯 NÍVEL: ' + nivelLabel + '\n' +
      '✏️ LETRA: ' + letra + '\n' +
      (objetivosTexto ? '🎯 OBJETIVOS: ' + objetivosTexto + '\n' : '') +
      '\n' + exemploQuestoes + '\n\n' +
      'REGRAS OBRIGATÓRIAS:\n' +
      '1. ESPECIFICIDADE: Questões específicas sobre "' + conteudo + '" — JAMAIS genéricas. Use termos técnicos, exemplos concretos, contexto brasileiro.\n' +
      '2. QUANTIDADE EXATA: ' + n + ' atividade(s), cada uma com 4-6 questões.\n' +
      '3. TIPOS VARIADOS: ' + tiposDeAtividade.join(', ') + '\n' +
      '4. MÚLTIPLA ESCOLHA: 4 alternativas (A,B,C,D), distratores plausíveis, gabarito indicado.\n' +
      '5. PROGRESSÃO BLOOM: lembrar → compreender → aplicar → analisar.\n' +
      '6. INTRODUÇÃO: 2-4 frases com relevância real e curiosidade sobre "' + conteudo + '".\n' +
      '7. INSTRUÇÃO PRECISA: Diga exatamente o que o aluno deve fazer.\n' +
      '8. GABARITO: Todas as questões objetivas. Formato: "Gabarito: 1-A, 2-Verdadeiro, 3-C"\n\n' +
      'Retorne APENAS JSON válido:\n' +
      '{\n' +
      '  "atividades": [\n' +
      '    {\n' +
      '      "numero": 1,\n' +
      '      "tipo": "nome do tipo",\n' +
      '      "nivel": "' + nivelLabel + '",\n' +
      '      "titulo": "título criativo e específico sobre ' + conteudo + '",\n' +
      '      "introducao": "2-4 frases motivadoras com contexto real",\n' +
      '      "instrucao": "instrução precisa do que fazer",\n' +
      '      "questoes": [\n' +
      '        {\n' +
      '          "numero": 1,\n' +
      '          "enunciado": "enunciado específico e rico sobre ' + conteudo + '",\n' +
      '          "tipo": "dissertativa|multipla_escolha|lacuna|vf",\n' +
      '          "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],\n' +
      '          "resposta_correta": "apenas para objetivas",\n' +
      '          "linhas_resposta": 3\n' +
      '        }\n' +
      '      ],\n' +
      '      "gabarito": "Gabarito: 1-A, 2-B (todas questões objetivas)"\n' +
      '    }\n' +
      '  ]\n' +
      '}'

    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista pedagógico brasileiro com doutorado em Didática e 20 anos de experiência na educação básica, especializado na BNCC. Você cria atividades educacionais impressas de altíssima qualidade pedagógica, profundamente específicas ao conteúdo solicitado — NUNCA genéricas. Suas marcas: enunciados ricos com contexto brasileiro real, questões que desenvolvem pensamento crítico, adequação perfeita à faixa etária, progressão pedagógica clara (Taxonomia de Bloom), instruções que o aluno entende sozinho. Você SEMPRE retorna JSON válido sem texto fora do JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 6000,
        response_format: { type: 'json_object' },
      }),
    })

    if (!openaiResp.ok) {
      const errText = await openaiResp.text()
      console.error('[gerar-atividade] OpenAI error:', errText)
      return NextResponse.json({ error: 'Erro na API OpenAI: ' + openaiResp.status }, { status: 500 })
    }

    const openaiData = await openaiResp.json()
    const rawContent = openaiData.choices?.[0]?.message?.content || '{}'

    let parsed: any
    try {
      parsed = JSON.parse(rawContent)
    } catch (e) {
      console.error('[gerar-atividade] Erro ao parsear JSON da OpenAI:', rawContent)
      return NextResponse.json({ error: 'Erro ao processar resposta da IA' }, { status: 500 })
    }

    const atividadesIA = parsed.atividades || []

    const atividadesFinais = atividadesIA.map((a: any, i: number) => {
      const img = imgs[i % imgs.length]
      return {
        numero: a.numero || i + 1,
        tipo: a.tipo || 'Atividade',
        nivel: a.nivel || nivelLabel,
        titulo: a.titulo || 'Atividade ' + (i + 1) + ': ' + conteudo,
        introducao: a.introducao || '',
        instrucao: a.instrucao || 'Responda as questões abaixo:',
        questoes: a.questoes || [],
        gabarito: a.gabarito || '',
        imagemUrl: img.url,
        imagemDescricao: img.descricao,
        promptImagem: 'Ilustração educativa colorida para ' + serie + ', tema: "' + conteudo + '" em ' + disciplina + ', estilo cartoon didático brasileiro, fundo branco, cores vivas, sem texto, para impressão em A4',
        perguntas: (a.questoes || []).map((q: any) => {
          let linha = q.numero + '. ' + q.enunciado
          if (q.tipo === 'multipla_escolha' && q.alternativas?.length) {
            linha += '\n' + q.alternativas.join('\n')
          } else if (q.tipo === 'vf') {
            linha += '\n( ) Verdadeiro ( ) Falso'
          } else if (q.tipo === 'lacuna') {
            linha += '\nResposta: ___________________________'
          } else {
            const linhasResp = q.linhas_resposta || 2
            linha += '\n' + Array(linhasResp).fill('___________________________').join('\n')
          }
          return linha
        }),
        instrucaoDesenho: '',
        temDesenho: false,
      }
    })

    return NextResponse.json({
      success: true,
      disciplina,
      serie,
      conteudo,
      nivel,
      totalAtividades: atividadesFinais.length,
      atividades: atividadesFinais,
    })
  } catch (error: any) {
    console.error('[gerar-atividade] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar atividades: ' + error.message },
      { status: 500 }
    )
  }
}
