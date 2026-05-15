import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// ============================================================
// BANCO DE IMAGENS POR DISCIPLINA (Wikimedia Commons)
// ============================================================
const IMAGENS: Record<string, { url: string; descricao: string }[]> = {
  matematica: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_-_finding_a_missing_number.png/320px-Simple_algebra_-_finding_a_missing_number.png', descricao: 'Algebra matematica' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Counting_frame_abacus.jpg/320px-Counting_frame_abacus.jpg', descricao: 'Abaco para contagem' },
  ],
  portugues: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Livros e leitura' },
  ],
  historia: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Documentos historicos' },
  ],
  ciencias: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Ciencias naturais' },
  ],
  geografia: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Geografia e natureza' },
  ],
  default: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Material escolar' },
  ],
}

function detectarDisciplina(disciplina: string): string {
  const d = (disciplina || '').toLowerCase()
  if (d.includes('matem') || d.includes('calculo')) return 'matematica'
  if (d.includes('portugu') || d.includes('lingua') || d.includes('leitura')) return 'portugues'
  if (d.includes('histor')) return 'historia'
  if (d.includes('cienc') || d.includes('biolog') || d.includes('fisic') || d.includes('quim')) return 'ciencias'
  if (d.includes('geograf')) return 'geografia'
  return 'default'
}

function getImagens(disciplina: string, n: number) {
  const chave = detectarDisciplina(disciplina)
  const imgs = IMAGENS[chave] || IMAGENS.default
  return Array.from({ length: n }, (_, i) => imgs[i % imgs.length])
}

function gerarQuestoesPorDisciplina(disciplina: string, conteudo: string, n: number) {
  const chave = detectarDisciplina(disciplina)
  const banco: Record<string, any[]> = {
    matematica: [
      { numero: 1, enunciado: 'Resolva usando Bhaskara: 2x^2 - 8x + 6 = 0. Mostre o calculo do discriminante e as duas raizes.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 2, enunciado: 'Calcule o discriminante de x^2 + 4x + 4 = 0 e classifique as raizes:', tipo: 'multipla_escolha', alternativas: ['A) Delta = 0 - raizes reais e iguais', 'B) Delta > 0 - raizes reais e distintas', 'C) Delta < 0 - raizes complexas', 'D) Delta = 16 - raizes distintas'] },
      { numero: 3, enunciado: 'Um retangulo tem area de 12 cm2 e comprimento 3 cm maior que a largura. Monte e resolva a equacao do 2o grau.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 4, enunciado: 'Simplifique: (2^3 x 2^2) / 2^4', tipo: 'multipla_escolha', alternativas: ['A) 2^1 = 2', 'B) 2^0 = 1', 'C) 2^2 = 4', 'D) 2^5 = 32'] },
      { numero: 5, enunciado: 'Resolva o sistema: 2x + y = 10 e x - y = 2. Apresente o valor de x e y com etapas.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 6, enunciado: 'Calcule a raiz quadrada de 169 e de 256, mostrando a verificacao.', tipo: 'dissertativa', linhas_resposta: 3 },
      { numero: 7, enunciado: 'Simplifique: (3x^2 - 2x + 1) + (x^2 + 5x - 3)', tipo: 'dissertativa', linhas_resposta: 3 },
      { numero: 8, enunciado: 'A equacao x^2 - 9 = 0 possui raizes:', tipo: 'multipla_escolha', alternativas: ['A) x = 3 e x = -3', 'B) x = 9 e x = -9', 'C) x = 3 apenas', 'D) Nao possui raizes reais'] },
      { numero: 9, enunciado: 'Um numero n satisfaz n^2 - 7n + 12 = 0. Encontre os valores de n usando fatorizacao e explique cada passo.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 10, enunciado: 'Uma loja vendeu 120 produtos em dois dias. No segundo dia vendeu o dobro do primeiro. Escreva e resolva a equacao.', tipo: 'dissertativa', linhas_resposta: 4 },
    ],
    portugues: [
      { numero: 1, enunciado: 'Leia o fragmento a seguir e identifique a ideia central, explicando com suas proprias palavras o que o autor quis transmitir.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 2, enunciado: 'Qual alternativa apresenta uso correto da virgula conforme a norma culta?', tipo: 'multipla_escolha', alternativas: ['A) "Joao, foi ao mercado, e comprou pao."', 'B) "Joao foi ao mercado, e trouxe pao fresco."', 'C) "Joao foi ao mercado e, trouxe, pao."', 'D) "Joao, foi, ao mercado e trouxe pao."'] },
      { numero: 3, enunciado: 'Reescreva na voz passiva: "O cientista descobriu a cura da doenca." Mantenha o sentido original.', tipo: 'dissertativa', linhas_resposta: 3 },
      { numero: 4, enunciado: 'Identifique e classifique as oracoes: "Quando o sol nasceu, os passaros cantaram e o dia amanheceu claro."', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 5, enunciado: 'Qual figura de linguagem esta em "Meus olhos sao dois rios que correm para o mar"?', tipo: 'multipla_escolha', alternativas: ['A) Metonimia', 'B) Metafora', 'C) Hiperbole', 'D) Ironia'] },
      { numero: 6, enunciado: 'Produza um paragrafo argumentativo de 5 a 8 linhas sobre: "A leitura como instrumento de transformacao social". Use exemplos e argumento de autoridade.', tipo: 'dissertativa', linhas_resposta: 8 },
      { numero: 7, enunciado: 'Qual a funcao do conectivo "embora" em "Embora estudasse bastante, nao passou na prova"?', tipo: 'multipla_escolha', alternativas: ['A) Indica causa', 'B) Indica concessao', 'C) Indica finalidade', 'D) Indica condicao'] },
      { numero: 8, enunciado: 'Explique a diferenca entre denotacao e conotacao, dando um exemplo original para cada.', tipo: 'dissertativa', linhas_resposta: 4 },
      { numero: 9, enunciado: 'Analise "deslealdade": identifique prefixo, radical e sufixo explicando o significado de cada elemento.', tipo: 'dissertativa', linhas_resposta: 4 },
      { numero: 10, enunciado: 'A concordancia verbal esta correta em qual alternativa?', tipo: 'multipla_escolha', alternativas: ['A) "Fazem dois anos que nao te vejo."', 'B) "Faz dois anos que nao te vejo."', 'C) "Fazemos dois anos que nao te vejo."', 'D) "Fazia dois anos que nao te vejas."'] },
    ],
    historia: [
      { numero: 1, enunciado: 'Explique as principais causas da Proclamacao da Republica no Brasil em 1889, relacionando ao fim da escravidao e as contradicoes do Imperio.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 2, enunciado: 'Qual foi o principal fator economico do Brasil Colonia no seculo XVII?', tipo: 'multipla_escolha', alternativas: ['A) Extracao do ouro nas Minas Gerais', 'B) Producao de cana-de-acucar no Nordeste', 'C) Comercio de especiarias com a Asia', 'D) Criacao de gado no Sul'] },
      { numero: 3, enunciado: 'Compare a Primeira Republica (1889-1930) com o Periodo Vargas (1930-1945), destacando duas diferencas fundamentais.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 4, enunciado: 'O que foi a Revolucao Francesa e como seus tres principios influenciaram a independencia da America Latina?', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 5, enunciado: 'A Abolicao da Escravatura em 1888 foi resultado de:', tipo: 'multipla_escolha', alternativas: ['A) Apenas pressao inglesa sobre o Brasil', 'B) Exclusivamente da acao da Princesa Isabel', 'C) Combinacao de pressoes sociais, economicas e politicas internas e externas', 'D) Acordo entre fazendeiros e o governo imperial'] },
      { numero: 6, enunciado: 'Analise as consequencias da 2a Guerra Mundial, mencionando a criacao da ONU e o inicio da Guerra Fria.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 7, enunciado: 'O que foi o Iluminismo e como suas ideias questionaram o poder absoluto dos reis na Europa do seculo XVIII?', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 8, enunciado: 'Qual alternativa descreve corretamente as capitanias hereditarias?', tipo: 'multipla_escolha', alternativas: ['A) Divisao em lotes entregues a indios aliados', 'B) Divisao em faixas horizontais entregues a donatarios para colonizacao', 'C) Sistema de arrendamento de terras pelo governo portugues', 'D) Modelo aplicado apenas no Sul do Brasil'] },
      { numero: 9, enunciado: 'Explique o conceito de "coronelismo" na Primeira Republica e como ele influenciava as eleicoes e a politica local.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 10, enunciado: 'Relacione os movimentos sociais do seculo XX (Movimento Operario, Feminismo, Direitos Civis nos EUA) a conquistas concretas de cada um e reflita sobre sua importancia para a democracia atual.', tipo: 'dissertativa', linhas_resposta: 6 },
    ],
    ciencias: [
      { numero: 1, enunciado: 'Explique a fotossintese descrevendo reagentes, produtos e importancia para os seres vivos e o planeta.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 2, enunciado: 'Quais fatores sao necessarios para a fotossintese?', tipo: 'multipla_escolha', alternativas: ['A) CO2, H2O e energia solar', 'B) O2, H2O e energia termica', 'C) CO2, N2 e luz artificial', 'D) O2, CO2 e energia quimica'] },
      { numero: 3, enunciado: 'Diferencie mitose e meiose: onde ocorre cada processo no corpo humano e qual a finalidade biologica de cada um?', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 4, enunciado: 'Descreva as leis de Newton aplicando cada uma a uma situacao cotidiana diferente. Cite um exemplo concreto por lei.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 5, enunciado: 'O que sao vacinas e como atuam no sistema imunologico? Explique imunidade de rebanho.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 6, enunciado: 'Qual alternativa descreve corretamente a respiracao celular?', tipo: 'multipla_escolha', alternativas: ['A) Producao de glicose a partir de CO2 e H2O', 'B) Quebra da glicose com liberacao de energia (ATP), CO2 e H2O', 'C) Absorcao de O2 pelas folhas das plantas', 'D) Transformacao de energia solar em energia quimica'] },
      { numero: 7, enunciado: 'Explique o aquecimento global: causas humanas e impactos ambientais no Brasil e no mundo.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 8, enunciado: 'Descreva a cadeia alimentar do cerrado brasileiro, identificando produtores, consumidores primarios, secundarios e decompositores.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 9, enunciado: 'Qual a diferenca entre atomo, molecula e elemento quimico? De um exemplo de cada um no cotidiano.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 10, enunciado: 'O sistema cardiovascular humano e formado por:', tipo: 'multipla_escolha', alternativas: ['A) Coracao, pulmoes e rins', 'B) Coracao, vasos sanguineos e sangue', 'C) Coracao, estomago e figado', 'D) Veias, arterias e neuronios'] },
    ],
    geografia: [
      { numero: 1, enunciado: 'Explique urbanizacao e descreva problemas socioambientais causados pelo crescimento desordenado das cidades brasileiras.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 2, enunciado: 'Quais sao as consequencias do desmatamento da Amazonia?', tipo: 'multipla_escolha', alternativas: ['A) Aumento das chuvas e melhoria do clima local', 'B) Reducao da biodiversidade, erosao do solo e alteracoes climaticas regionais', 'C) Melhoria da qualidade do ar e expansao da fauna local', 'D) Aumento da fertilidade do solo e ampliacao dos rios'] },
      { numero: 3, enunciado: 'Diferencie clima e tempo atmosferico, exemplificando como isso afeta uma comunidade agricola brasileira.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 4, enunciado: 'Descreva as 5 regioes brasileiras destacando aspectos economicos e populacionais de cada uma.', tipo: 'dissertativa', linhas_resposta: 8 },
      { numero: 5, enunciado: 'O que e globalizacao e quais seus impactos positivos e negativos para paises em desenvolvimento como o Brasil?', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 6, enunciado: 'Qual alternativa descreve corretamente o bioma Cerrado?', tipo: 'multipla_escolha', alternativas: ['A) Florestas densas e umidas com arvores de grande porte', 'B) Vegetacao de savana tropical com arvores de casca grossa e raizes profundas', 'C) Vegetacao de dunas e cactos adaptados a seca intensa', 'D) Campos abertos com baixa diversidade de especies'] },
      { numero: 7, enunciado: 'Explique fusos horarios e calcule: se em Brasilia sao 12h, que horas sao em Lisboa (UTC+1) e em Toquio (UTC+9)?', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 8, enunciado: 'Quais as consequencias socioeconomicas da seca no Semiarido nordestino? Cite duas politicas publicas criadas para minimizar esse problema.', tipo: 'dissertativa', linhas_resposta: 6 },
      { numero: 9, enunciado: 'O exodo rural ocorre quando:', tipo: 'multipla_escolha', alternativas: ['A) Pessoas deixam as cidades para morar no campo', 'B) Pessoas deixam o campo em busca de melhores condicoes nas cidades', 'C) Ocorre migracao entre paises vizinhos', 'D) Ha deslocamento de populacoes por guerras'] },
      { numero: 10, enunciado: 'Analise os impactos da mineracao no Brasil: cite dois beneficios economicos e dois impactos negativos ambientais, relacionando com o caso de Mariana (MG) em 2015.', tipo: 'dissertativa', linhas_resposta: 6 },
    ],
    default: [
      { numero: 1, enunciado: 'Defina com clareza o conceito de "' + conteudo + '" e explique sua importancia para a area do conhecimento a qual pertence.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 2, enunciado: 'Quais sao as principais caracteristicas que definem "' + conteudo + '"?', tipo: 'multipla_escolha', alternativas: ['A) Apenas aspectos teoricos sem aplicacao pratica', 'B) Caracteristicas especificas que o diferenciam de conceitos relacionados', 'C) Somente aspectos historicos sem relevancia atual', 'D) Caracteristicas exclusivamente abstratas'] },
      { numero: 3, enunciado: 'Relacione "' + conteudo + '" com dois exemplos concretos do cotidiano brasileiro, explicando como esse conhecimento se aplica na pratica.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 4, enunciado: 'Qual e a origem historica ou cientifica de "' + conteudo + '"? Descreva como foi desenvolvido ao longo do tempo.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 5, enunciado: '"' + conteudo + '" tem aplicacao direta na vida cotidiana. Verdadeiro ou Falso? Justifique com argumentos.', tipo: 'dissertativa', linhas_resposta: 4 },
      { numero: 6, enunciado: 'Compare "' + conteudo + '" com outro conceito da mesma area, apontando semelhancas e diferencas.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 7, enunciado: 'Quais seriam as consequencias caso "' + conteudo + '" nao existisse ou nao fosse aplicado na sociedade? Desenvolva com exemplos.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 8, enunciado: 'Analise: "O dominio de ' + conteudo + ' e essencial para o desenvolvimento intelectual e profissional". Voce concorda? Justifique.', tipo: 'dissertativa', linhas_resposta: 5 },
      { numero: 9, enunciado: 'Quais profissoes fazem uso direto do conhecimento sobre "' + conteudo + '"? Explique como esse uso se da na pratica.', tipo: 'dissertativa', linhas_resposta: 4 },
      { numero: 10, enunciado: 'Elabore uma sintese sobre "' + conteudo + '", destacando os tres pontos mais importantes e explicando o porque de cada escolha.', tipo: 'dissertativa', linhas_resposta: 6 },
    ],
  }
  const questoes = banco[chave] || banco.default
  return questoes.slice(0, n)
}

function instrucaoEspecificaPorDisciplina(chave: string, conteudo: string): string {
  const instrucoes: Record<string, string> = {
    matematica: `REGRAS PARA MATEMATICA:
- Todas as questoes devem ter NUMEROS REAIS e operacoes verificaveis
- Inclua: calculo direto, problema contextualizado, situacao-problema real do cotidiano brasileiro
- Dissertativas devem pedir que o aluno mostre TODOS os passos do calculo
- Gabarito deve mostrar a resolucao completa, nao apenas o resultado final`,
    portugues: `REGRAS PARA LINGUA PORTUGUESA:
- Inclua: interpretacao de texto com inferencia, analise gramatical contextualizada, producao textual
- Enunciados devem exigir argumentacao, nao apenas memorizacao de regras
- Distratores nas multipla escolha devem ser plausíveis, exigindo atencao as nuances da lingua
- Ao menos 2 questoes devem trabalhar com generos textuais reais (noticia, conto, carta, poema)`,
    historia: `REGRAS PARA HISTORIA:
- Questoes devem exigir analise de causa e consequencia, nao apenas datas e nomes
- Relacione os conteudos ao contexto brasileiro e a realidade atual
- Ao menos 2 questoes devem pedir comparacao entre periodos ou movimentos historicos
- Gabarito deve incluir contexto explicativo, nao apenas a resposta correta`,
    ciencias: `REGRAS PARA CIENCIAS:
- Inclua questoes que pecam ao aluno formular hipoteses e conclusoes
- Use dados e fenomenos reais (temperatura, experimentos, medicoes)
- Ao menos 2 questoes devem relacionar o conteudo com tecnologia ou saude humana
- Questoes devem exigir raciocinio cientifico, nao apenas definicoes`,
    geografia: `REGRAS PARA GEOGRAFIA:
- Relacione ao territorio brasileiro com dados reais (IBGE, INPE)
- Inclua analise de impactos socioambientais e economicos
- Ao menos 2 questoes devem trabalhar com escalas espaciais diferentes (local, nacional, global)
- Gabarito deve explicar as relacoes geograficas, nao apenas nomear lugares`,
  }
  return instrucoes[chave] || `REGRAS GERAIS:
- Questoes devem ser ESPECIFICAS sobre "${conteudo}", jamais genericas
- Exija analise, sintese e aplicacao, nao apenas memorizacao
- Use exemplos contextualizados na realidade brasileira
- Gabarito deve ser comentado e explicativo`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, conteudo, nivel, quantidade, tipoLetra, objetivos } = body

    if (!conteudo) {
      return NextResponse.json({ error: 'Conteudo e obrigatorio' }, { status: 400 })
    }

    const n = Math.min(Math.max(parseInt(quantidade) || 10, 1), 20)
    const nivelLabel = nivel === 'facil' ? 'Facil' : nivel === 'dificil' ? 'Dificil' : 'Medio'
    const letra = 'letra de forma' // Cursiva removida - sempre letra de forma
    const chaveDisciplina = detectarDisciplina(disciplina || '')
    const imagens = getImagens(disciplina || '', 1)

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey || apiKey.length < 20) {
      const questoesLocais = gerarQuestoesPorDisciplina(disciplina || '', conteudo, n)
      const atividade = {
        numero: 1,
        titulo: `Atividade — ${conteudo}`,
        tipo: 'Exercicios de Fixacao e Aprofundamento',
        nivel: nivelLabel,
        introducao: `Esta atividade aborda "${conteudo}" de forma aprofundada, exigindo compreensao, analise e aplicacao do conteudo estudado.`,
        instrucao: 'Leia com atencao cada questao. Nas questoes dissertativas, desenvolva sua resposta com argumentos completos e exemplos concretos.',
        questoes: questoesLocais,
        gabarito: 'Gabarito disponivel na correcao do professor.',
        imagemUrl: imagens[0].url,
        imagemDescricao: imagens[0].descricao,
        promptImagem: `atividade educacional ${disciplina} ${conteudo}`,
        temDesenho: false,
      }
      return NextResponse.json({
        success: true, disciplina, serie, conteudo, nivel,
        totalAtividades: 1,
        atividades: [atividade],
      })
    }

    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey })

    const objetivosTexto = objetivos
      ? (Array.isArray(objetivos) ? objetivos.join('; ') : String(objetivos))
      : ''

    const instrucaoEspecifica = instrucaoEspecificaPorDisciplina(chaveDisciplina, conteudo)

    const prompt = `Voce e um especialista em educacao brasileira e na BNCC com doutorado em Didatica. Crie UMA atividade impressa com EXATAMENTE ${n} questoes de ALTA QUALIDADE PEDAGOGICA para:

DISCIPLINA: ${disciplina || 'Educacao Geral'}
SERIE/ANO: ${serie || 'Ensino Fundamental'}
CONTEUDO ESPECIFICO: ${conteudo}
NIVEL DE DIFICULDADE: ${nivelLabel}
TIPO DE LETRA: letra de forma (padrão escolar BNCC)
OBJETIVOS: ${objetivosTexto || 'Compreender, aplicar e analisar o conteudo proposto'}

${instrucaoEspecifica}

REGRAS UNIVERSAIS OBRIGATORIAS:
1. ESPECIFICIDADE MAXIMA: cada questao deve ser 100% especifica sobre "${conteudo}". PROIBIDO enunciados vagos ou genericos.
2. QUANTIDADE EXATA: ${n} questoes numeradas de 1 a ${n}. Nem mais, nem menos.
3. DIVERSIDADE DE TIPOS: varie entre dissertativa, multipla_escolha (4 alternativas A/B/C/D), vf, lacuna.
4. TAXONOMIA DE BLOOM: distribua pelos niveis — lembrar (1-2), compreender (2-3), aplicar (2-3), analisar (2-3), avaliar/criar (1-2).
5. CONTEXTO BRASILEIRO: use exemplos, dados e situacoes da realidade brasileira.
6. GABARITO COMENTADO: todas as objetivas devem ter gabarito com explicacao do porque a resposta esta correta.
7. DISSERTATIVAS: devem pedir desenvolvimento com argumentos, nao apenas uma palavra ou definicao.
8. DISTRATORES PLAUSÍVEIS: nas multipla escolha, as alternativas erradas devem ser convincentes.

Responda APENAS com JSON valido (sem markdown, sem texto fora do JSON):
{
  "atividade": {
    "numero": 1,
    "titulo": "Titulo criativo e especifico sobre ${conteudo}",
    "tipo": "Tipo geral da atividade",
    "nivel": "${nivelLabel}",
    "introducao": "3-5 frases motivadoras contextualizando o tema com a realidade brasileira",
    "instrucao": "Instrucao clara e precisa do que o aluno deve fazer",
    "questoes": [
      {
        "numero": 1,
        "enunciado": "Enunciado completo, rico e especifico sobre ${conteudo}",
        "tipo": "dissertativa|multipla_escolha|vf|lacuna",
        "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
        "resposta_correta": "Letra da alternativa correta (apenas para objetivas)",
        "gabarito_comentado": "Explicacao do porque esta e a resposta correta",
        "linhas_resposta": 4
      }
    ],
    "gabarito": "Gabarito geral comentado de todas as questoes objetivas"
  }
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista pedagógico brasileiro com doutorado em Didática e profundo conhecimento da BNCC. Suas questões são rigorosamente alinhadas às habilidades BNCC, específicas ao conteúdo e nunca genéricas. Responda APENAS com JSON válido, sem markdown.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 8000,
      temperature: 0.7,
    })

    const rawContent = completion.choices[0]?.message?.content || ''
    let parsed: any = null

    try {
      const clean = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      console.error('[gerar-atividade] JSON parse error, usando fallback local')
      const questoesLocais = gerarQuestoesPorDisciplina(disciplina || '', conteudo, n)
      const atividade = {
        numero: 1,
        titulo: `Atividade — ${conteudo}`,
        tipo: 'Exercicios de Fixacao e Aprofundamento',
        nivel: nivelLabel,
        introducao: `Atividade aprofundada sobre "${conteudo}".`,
        instrucao: 'Leia com atencao e responda cada questao de forma completa.',
        questoes: questoesLocais,
        gabarito: 'Gabarito disponivel na correcao do professor.',
        imagemUrl: imagens[0].url,
        imagemDescricao: imagens[0].descricao,
        promptImagem: `atividade ${disciplina} ${conteudo}`,
        temDesenho: false,
      }
      return NextResponse.json({
        success: true, disciplina, serie, conteudo, nivel,
        totalAtividades: 1,
        atividades: [atividade],
      })
    }

    let atividadesFinais: any[] = []
    if (parsed.atividade) {
      atividadesFinais = [{
        ...parsed.atividade,
        imagemUrl: imagens[0].url,
        imagemDescricao: imagens[0].descricao,
        promptImagem: `atividade ${disciplina} ${conteudo}`,
        temDesenho: false,
      }]
    } else if (parsed.atividades) {
      atividadesFinais = parsed.atividades.map((a: any) => ({
        ...a,
        imagemUrl: a.imagemUrl || imagens[0].url,
        imagemDescricao: a.imagemDescricao || imagens[0].descricao,
        temDesenho: false,
      }))
    }

    return NextResponse.json({
      success: true, disciplina, serie, conteudo, nivel,
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
