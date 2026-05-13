import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const IMAGENS: Record<string, { url: string; descricao: string }[]> = {
    matematica: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_-_finding_a_missing_number.png/320px-Simple_algebra_-_finding_a_missing_number.png', descricao: 'Álgebra matemática' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Counting_frame_abacus.jpg/320px-Counting_frame_abacus.jpg', descricao: 'Ábaco para contagem' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Numberblock_1-10.png/320px-Numberblock_1-10.png', descricao: 'Blocos de números' },
        ],
  default: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Material escolar' },
      ],
}

function getImagens(disciplina: string, n: number) {
    const tema = disciplina?.toLowerCase().includes('matem') ? 'matematica' : 'default'
    const imgs = IMAGENS[tema] || IMAGENS.default
    return Array.from({ length: n }, (_, i) => imgs[i % imgs.length])
}

function gerarQuestoesCalculo(conteudo: string, n: number) {
    const questoes = [
      { numero: 1, enunciado: `Resolva a equação do 2º grau: x² - 5x + 6 = 0. Encontre os valores de x.`, tipo: 'dissertativa' as const, linhas_resposta: 4 },
      { numero: 2, enunciado: `Usando a fórmula de Bhaskara, resolva: 2x² - 8x + 6 = 0.`, tipo: 'dissertativa' as const, linhas_resposta: 5 },
      { numero: 3, enunciado: `Calcule o valor do discriminante (Δ) da equação: x² + 4x + 4 = 0. Qual é o tipo de raízes?`, tipo: 'multipla_escolha' as const, alternativas: ['A) Δ = 0; raízes reais e iguais', 'B) Δ > 0; raízes reais e distintas', 'C) Δ < 0; raízes complexas', 'D) Δ = 16; raízes distintas'] },
      { numero: 4, enunciado: `Simplifique a expressão com potências: (2³ × 2²) ÷ 2⁴. Qual é o resultado?`, tipo: 'multipla_escolha' as const, alternativas: ['A) 2¹ = 2', 'B) 2⁰ = 1', 'C) 2² = 4', 'D) 2⁵ = 32'] },
      { numero: 5, enunciado: `Calcule a raiz quadrada de 144 e de 225. Mostre o processo de cálculo.`, tipo: 'dissertativa' as const, linhas_resposta: 3 },
      { numero: 6, enunciado: `Resolva o sistema de equações lineares: { 2x + y = 10 e x - y = 2 }. Encontre x e y.`, tipo: 'dissertativa' as const, linhas_resposta: 5 },
      { numero: 7, enunciado: `Um retângulo tem área de 12 cm² e seu comprimento é 3 cm maior que a largura. Escreva e resolva a equação do 2º grau.`, tipo: 'dissertativa' as const, linhas_resposta: 5 },
      { numero: 8, enunciado: `Calcule: (3x² - 2x + 1) + (x² + 5x - 3). Simplifique a expressão polinomial.`, tipo: 'dissertativa' as const, linhas_resposta: 3 },
      { numero: 9, enunciado: `A equação x² - 9 = 0 possui raízes iguais a:`, tipo: 'multipla_escolha' as const, alternativas: ['A) x = 3 e x = -3', 'B) x = 9 e x = -9', 'C) x = 3 apenas', 'D) Não possui raízes reais'] },
      { numero: 10, enunciado: `Um número natural n satisfaz n² - 7n + 12 = 0. Quais são os possíveis valores de n? Explique usando fatoração.`, tipo: 'dissertativa' as const, linhas_resposta: 5 },
        ]
    return questoes.slice(0, n)
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
          const imagens = getImagens(disciplina || '', n)

      const apiKey = process.env.OPENAI_API_KEY
          if (!apiKey || apiKey.length < 20) {
                  // Fallback local sem IA
            const questoesLocais = gerarQuestoesCalculo(conteudo, n)
                  const atividadesFinais = questoesLocais.map((q, i) => ({
                            numero: i + 1,
                            titulo: `Atividade ${i + 1} — ${conteudo}`,
                            tipo: 'Resolução de Problemas / Cálculo Matemático',
                            nivel: nivelLabel,
                            introducao: `Aplique seus conhecimentos sobre ${conteudo} para resolver as questões a seguir.`,
                            instrucao: 'Leia com atenção e resolva cada questão, mostrando todos os cálculos.',
                            questoes: [q],
                            gabarito: `Ver resposta na correção do professor`,
                            imagemUrl: imagens[i % imagens.length].url,
                            imagemDescricao: imagens[i % imagens.length].descricao,
                            promptImagem: `atividade matematica ${conteudo}`,
                            temDesenho: false,
                  }))
                  return NextResponse.json({ success: true, disciplina, serie, conteudo, nivel, totalAtividades: atividadesFinais.length, atividades: atividadesFinais })
          }

      const OpenAI = (await import('openai')).default
          const openai = new OpenAI({ apiKey })

      const objetivosTexto = objetivos
            ? (Array.isArray(objetivos) ? objetivos.join('; ') : String(objetivos))
              : ''

      const prompt = `Você é um especialista em educação brasileira e na BNCC. Crie EXATAMENTE ${n} atividade(s) impressa(s) de ALTA QUALIDADE PEDAGÓGICA para:

      📚 DISCIPLINA: ${disciplina || 'Matemática'}
      🎓 SÉRIE/ANO: ${serie || 'Ensino Fundamental'}
      📖 CONTEÚDO: ${conteudo}
      📊 NÍVEL: ${nivelLabel}
      ✏️ TIPO DE LETRA: ${letra}
      🎯 OBJETIVOS: ${objetivosTexto}

      REGRAS CRÍTICAS:
      (1) Se o conteúdo envolve CÁLCULO, crie questões com números reais e operações matemáticas concretas.
      (2) Crie EXATAMENTE ${n} atividades numeradas.
      (3) JAMAIS substitua questões de cálculo por questões genéricas.
      (4) Cada atividade deve ter 1 questão bem estruturada, com enunciado completo e resposta verificável.
      (5) Para questões de múltipla escolha, inclua 4 alternativas (A, B, C, D).
      (6) Para questões dissertativas, inclua 3-5 linhas de resposta.
      (7) GABARITO: inclua a resposta correta comentada.

      Responda APENAS com JSON válido no formato:
      {
        "atividades": [
            {
                  "numero": 1,
                        "titulo": "Título da atividade",
                              "tipo": "Tipo da atividade",
                                    "nivel": "${nivelLabel}",
                                          "introducao": "Contexto introdutório",
                                                "instrucao": "Instrução principal",
                                                      "questoes": [
                                                              {
                                                                        "numero": 1,
                                                                                  "enunciado": "Enunciado completo da questão com números reais",
                                                                                            "tipo": "dissertativa|multipla_escolha|vf|lacuna",
                                                                                                      "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
                                                                                                                "resposta_correta": "Resposta correta",
                                                                                                                          "linhas_resposta": 4
                                                                                                                                  }
                                                                                                                                        ],
                                                                                                                                              "gabarito": "Gabarito comentado",
                                                                                                                                                    "imagemUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_-_finding_a_missing_number.png/320px-Simple_algebra_-_finding_a_missing_number.png",
                                                                                                                                                          "imagemDescricao": "Álgebra matemática",
                                                                                                                                                                "promptImagem": "matematica calculo",
                                                                                                                                                                      "temDesenho": false
                                                                                                                                                                          }
                                                                                                                                                                            ]
                                                                                                                                                                            }`

      const completion = await openai.chat.completions.create({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: 'Você é um especialista pedagógico brasileiro. Responda APENAS com JSON válido, sem markdown, sem explicações.' },
                { role: 'user', content: prompt }
                      ],
              max_tokens: 6000,
              temperature: 0.7,
      })

      const content2 = completion.choices[0]?.message?.content || ''
          let parsed: any = null
          try {
                  const clean = content2.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
                  parsed = JSON.parse(clean)
          } catch {
                  console.error('[gerar-atividade] JSON parse error:', content2.substring(0, 200))
                  // Fallback se o JSON falhar
            const questoesLocais = gerarQuestoesCalculo(conteudo, n)
                  const atividadesFinais = questoesLocais.map((q, i) => ({
                            numero: i + 1,
                            titulo: `Atividade ${i + 1} — ${conteudo}`,
                            tipo: 'Resolução de Problemas',
                            nivel: nivelLabel,
                            introducao: `Atividade sobre ${conteudo}`,
                            instrucao: 'Resolva as questões abaixo.',
                            questoes: [q],
                            gabarito: 'Ver gabarito do professor',
                            imagemUrl: imagens[i % imagens.length].url,
                            imagemDescricao: imagens[i % imagens.length].descricao,
                            promptImagem: `matematica ${conteudo}`,
                            temDesenho: false,
                  }))
                  return NextResponse.json({ success: true, disciplina, serie, conteudo, nivel, totalAtividades: atividadesFinais.length, atividades: atividadesFinais })
          }

      const atividadesFinais = (parsed.atividades || []).map((a: any, i: number) => ({
              ...a,
              imagemUrl: a.imagemUrl || imagens[i % imagens.length].url,
              imagemDescricao: a.imagemDescricao || imagens[i % imagens.length].descricao,
      }))

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
