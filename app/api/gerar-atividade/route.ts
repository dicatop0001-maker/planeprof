import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// === IMAGENS EDUCATIVAS POR TEMA (Wikimedia Commons - domínio público) ===
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
    if (d.match(/matem|numero|conta|soma|subtra|multiplic|divis|frac|medid/)) {
          if (d.match(/form|geomet|circulo|quadrado|triangulo|ret|solido/)) return 'geometria'
          return 'matematica'
    }
    if (d.match(/portugu|letra|leitura|escrita|texto|gram|ortograf|vocabul|silab/)) return 'portugues'
    if (d.match(/natur|plant|flor|arvore|meio ambient|ecossist|biosfera|solo|agua/)) return 'natureza'
    if (d.match(/histor|civiliz|guerra|brasil|povo|cultura|tradicao|patrimoni/)) return 'historia'
    if (d.match(/cienc|experim|quimic|fisic|laborat|fenomen|eletric|animal|bicho/)) return 'ciencias'
    return 'default'
}

function getImagensParaTema(tema: string, n: number): { url: string; descricao: string }[] {
    const pool = BANCO_IMAGENS[tema] || BANCO_IMAGENS.default
    const result: { url: string; descricao: string }[] = []
        for (let i = 0; i < n; i++) result.push(pool[i % pool.length])
    return result
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
                  : `${serie} — adapte o vocabulário, complexidade e raciocínio exigido para essa faixa etária`

      const prompt = `Você é um especialista em educação brasileira e na BNCC. Crie EXATAMENTE ${n} atividade(s) impressa(s) de alta qualidade pedagógica para a seguinte situação:

      DISCIPLINA: ${disciplina || 'Educação Geral'}
      SÉRIE/ANO: ${serie || 'Ensino Fundamental'}
      FAIXA ETÁRIA: ${faixaEtaria}
      CONTEÚDO ESPECÍFICO: ${conteudo}
      NÍVEL DE DIFICULDADE: ${nivelLabel}
      TIPO DE LETRA PARA LINHAS: ${letra}
      ${objetivos ? `OBJETIVOS DA AULA: ${Array.isArray(objetivos) ? objetivos.join('; ') : objetivos}` : ''}

      REGRAS OBRIGATÓRIAS:
      1. Gere EXATAMENTE ${n} atividade(s) — nem mais, nem menos.
      2. Cada atividade deve ser PROFUNDA e ESPECÍFICA ao conteúdo "${conteudo}", não genérica.
      3. As questões devem abordar conceitos reais, exemplos concretos, vocabulário técnico da matéria.
      4. Use tipos variados de atividades entre: ${tiposDeAtividade.join(', ')}.
      5. Cada atividade deve ter entre 4 a 6 questões/itens bem elaborados.
      6. Questões de múltipla escolha DEVEM ter 4 alternativas (A, B, C, D) com apenas 1 resposta correta indicada.
      7. Questões dissertativas devem ter espaço para resposta (linhas representadas por ___________).
      8. O conteúdo deve ser contextualizado na realidade brasileira.
      9. Progressão pedagógica: vá do mais simples ao mais complexo dentro de cada atividade.
      10. Inclua um gabarito resumido ao final de cada atividade (apenas para questões objetivas).

      Retorne um JSON válido com exatamente este formato (sem texto fora do JSON):
      {
        "atividades": [
            {
                  "numero": 1,
                        "tipo": "nome do tipo de atividade",
                              "nivel": "${nivelLabel}",
                                    "titulo": "título criativo e específico ao conteúdo",
                                          "introducao": "texto introdutório que contextualiza a atividade (2-4 frases explicando o tema)",
                                                "instrucao": "instrução clara para o aluno sobre como realizar a atividade",
                                                      "questoes": [
                                                              {
                                                                        "numero": 1,
                                                                                  "enunciado": "enunciado completo e específico ao conteúdo ${conteudo}",
                                                                                            "tipo": "dissertativa|multipla_escolha|lacuna|vf",
                                                                                                      "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
                                                                                                                "resposta_correta": "A (apenas para multipla_escolha e vf)",
                                                                                                                          "linhas_resposta": 3
                                                                                                                                  }
                                                                                                                                        ],
                                                                                                                                              "gabarito": "Gabarito: 1-A, 2-C, ... (apenas questões objetivas)"
                                                                                                                                                  }
                                                                                                                                                    ]
                                                                                                                                                    }`

      const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                          {
                                        role: 'system',
                                        content: 'Você é um especialista pedagógico brasileiro com 20 anos de experiência no ensino fundamental e infantil, especializado na BNCC. Cria atividades educacionais impressas de alta qualidade, profundas e específicas ao conteúdo, adequadas para impressão em folha A4. Sempre retorna JSON válido e bem estruturado.',
                          },
                          { role: 'user', content: prompt },
                                  ],
                        temperature: 0.7,
                        max_tokens: 4000,
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

            // Enriquecer com imagens e prompt de imagem
            const atividadesFinais = atividadesIA.map((a: any, i: number) => {
                    const img = imgs[i % imgs.length]
                    return {
                              numero: a.numero || i + 1,
                              tipo: a.tipo || 'Atividade',
                              nivel: a.nivel || nivelLabel,
                              titulo: a.titulo || `Atividade ${i + 1}: ${conteudo}`,
                              introducao: a.introducao || '',
                              instrucao: a.instrucao || 'Responda as questões abaixo:',
                              questoes: a.questoes || [],
                              gabarito: a.gabarito || '',
                              imagemUrl: img.url,
                              imagemDescricao: img.descricao,
                              promptImagem: `Ilustração educativa colorida para ${serie}, tema: "${conteudo}" em ${disciplina}, estilo cartoon didático brasileiro, fundo branco, cores vivas, sem texto, para impressão em A4`,
                              // Compatibilidade com formato antigo (perguntas)
                              perguntas: (a.questoes || []).map((q: any) => {
                                          let linha = `${q.numero}. ${q.enunciado}`
                                          if (q.tipo === 'multipla_escolha' && q.alternativas?.length) {
                                                        linha += '\n' + q.alternativas.join('\n')
                                          } else if (q.tipo === 'vf') {
                                                        linha += '\n( ) Verdadeiro  ( ) Falso'
                                                        if (q.alternativas?.length) linha += '\n' + q.alternativas.join('\n')
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
