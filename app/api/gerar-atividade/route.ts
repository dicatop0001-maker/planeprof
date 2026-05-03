import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// === IMAGENS EDUCATIVAS POR TEMA (Wikimedia Commons - domínio público) ===
const BANCO_IMAGENS: Record<string, { url: string; descricao: string }[]> = {
  matematica: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_-_finding_a_missing_number.png/320px-Simple_algebra_-_finding_a_missing_number.png', descricao: 'Equação matemática simples' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Numberblock_1-10.png/320px-Numberblock_1-10.png', descricao: 'Blocos de números 1 a 10' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Counting_frame_abacus.jpg/320px-Counting_frame_abacus.jpg', descricao: 'Ábaco para contagem' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_-_finding_a_missing_number.png/400px-Simple_algebra_-_finding_a_missing_number.png', descricao: 'Operações matemáticas' },
  ],
  geometria: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg', descricao: 'Formas geométricas na natureza' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Platonic_Solids.svg/320px-Platonic_Solids.svg.png', descricao: 'Sólidos geométricos' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Square_-_black_simple.svg/240px-Square_-_black_simple.svg.png', descricao: 'Formas planas: quadrado, triângulo, círculo' },
  ],
  portugues: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg', descricao: 'Letras do alfabeto' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Livros e leitura' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg/320px-Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg', descricao: 'Escrita e texto' },
  ],
  natureza: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Girassol florescendo' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/320px-24701-nature-natural-beauty.jpg', descricao: 'Paisagem natural com árvores' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Golden_Gate_Bridge_from_Battery_Spencer.jpg/320px-Golden_Gate_Bridge_from_Battery_Spencer.jpg', descricao: 'Rio e natureza' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Frog_at_Albany_Bulb.jpg/320px-Frog_at_Albany_Bulb.jpg', descricao: 'Animal na natureza' },
  ],
  animais: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg', descricao: 'Gato doméstico' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Bikedog.JPG/320px-Bikedog.JPG', descricao: 'Cão brincando' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Frog_at_Albany_Bulb.jpg/320px-Frog_at_Albany_Bulb.jpg', descricao: 'Sapo verde' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg', descricao: 'Formiga carregando folha' },
  ],
  corpo_humano: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Skeleton_with_organs.jpg/320px-Skeleton_with_organs.jpg', descricao: 'Corpo humano e órgãos' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Human_skeleton_front_en.svg/240px-Human_skeleton_front_en.svg.png', descricao: 'Esqueleto humano frontal' },
  ],
  historia: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/320px-Above_Gotham.jpg', descricao: 'Cidade histórica' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Livros de história' },
  ],
  ciencias: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Laughing_girl.jpg/320px-Laughing_girl.jpg', descricao: 'Experimento científico' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Ciclo das plantas' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Frog_at_Albany_Bulb.jpg/320px-Frog_at_Albany_Bulb.jpg', descricao: 'Animais e ecossistema' },
  ],
  arte: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/240px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg', descricao: 'Mona Lisa - da Vinci' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/320px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', descricao: 'Noite Estrelada - Van Gogh' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Crayons_from_above.jpg/320px-Crayons_from_above.jpg', descricao: 'Lápis de cor para arte' },
  ],
  musica: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Music_2.jpg/320px-Music_2.jpg', descricao: 'Notas musicais' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Musical_notes.svg/320px-Musical_notes.svg.png', descricao: 'Pentagrama com notas' },
  ],
  default: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Books_HD_%288314929977%29.jpg/320px-Books_HD_%288314929977%29.jpg', descricao: 'Material escolar' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Crayons_from_above.jpg/320px-Crayons_from_above.jpg', descricao: 'Lápis de cor' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg', descricao: 'Aprendizado na natureza' },
  ],
}

function detectarTema(disciplina: string, conteudo: string): string {
  const d = (disciplina + ' ' + conteudo).toLowerCase()
  if (d.match(/matem|numero|conta|soma|subtra|multiplic|divis|frac|geomet|medid/)) {
    if (d.match(/form|geomet|circulo|quadrado|triangulo|ret/)) return 'geometria'
    return 'matematica'
  }
  if (d.match(/portugu|letra|leitura|escrita|texto|gram|ortograf|vocabul|silab/)) return 'portugues'
  if (d.match(/animal|bicho|fauna|mamifero|reptil|inseto|ave|peixe/)) return 'animais'
  if (d.match(/natur|plant|flor|arvore|meio ambient|ecossist|biosfera|solo|agua/)) return 'natureza'
  if (d.match(/corpo|orgao|musculo|osso|saude|higiene|nutric|aliment|sentid/)) return 'corpo_humano'
  if (d.match(/histor|civiliz|guerra|brasil|povo|cultura|tradicao|patrimoni/)) return 'historia'
  if (d.match(/cienc|experim|quimic|fisic|laborat|fenomen|eletric|magnetis/)) return 'ciencias'
  if (d.match(/art|pintura|desenho|escult|color|museu|tela|obra/)) return 'arte'
  if (d.match(/music|nota|ritmo|melodia|instrum|canto|coral|som/)) return 'musica'
  return 'default'
}

function getImagensParaTema(tema: string, n: number): { url: string; descricao: string }[] {
  const pool = BANCO_IMAGENS[tema] || BANCO_IMAGENS.default
  const result: { url: string; descricao: string }[] = []
  for (let i = 0; i < n; i++) result.push(pool[i % pool.length])
  return result
}

// Gera atividades DIVERSAS e ESPECÍFICAS ao conteúdo
function gerarAtividadesVariadas(
  disciplina: string,
  serie: string,
  conteudo: string,
  nivel: string,
  quantidade: number,
  tipoLetra: string
): object[] {
  const tema = detectarTema(disciplina, conteudo)
  const imgs = getImagensParaTema(tema, quantidade)
  const nivelLabel = nivel === 'facil' ? 'Fácil' : nivel === 'dificil' ? 'Difícil' : 'Médio'
  const letra = tipoLetra === 'cursiva' ? 'letra cursiva' : 'letra de forma'

  // Série/faixa etária para adaptar linguagem
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal|berçario/)
  const eh1ao3 = serie.match(/1|2|3/) && !serie.toLowerCase().match(/fund.*[456789]|med/)
  const prefixoIdade = ehInfantil ? 'criança' : eh1ao3 ? 'aluno do ensino fundamental I' : 'aluno'

  // 10 tipos diferentes de atividades para variar
  const tiposDeFichas = [
    {
      tipo: 'Observação Dirigida',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Observe e Descubra — ${conteudo}`,
        instrucao: `Olhe bem para a figura abaixo (${img.descricao}). Ela mostra algo sobre "${conteudo}" que estudamos em ${disciplina}.`,
        perguntas: [
          `1. O que você enxerga na imagem? Escreva em ${letra}: ___________________________`,
          `2. Como isso se relaciona com "${conteudo}"? ___________________________`,
          `3. Você já viu isso no seu dia a dia? Onde? ___________________________`,
        ],
        instrucaoDesenho: `No espaço abaixo, faça seu próprio desenho sobre "${conteudo}":`,
        temDesenho: true,
      }),
    },
    {
      tipo: 'Complete as Frases',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Complete com suas Palavras — ${conteudo}`,
        instrucao: `Veja a figura (${img.descricao}) e complete as frases usando o que você aprendeu sobre "${conteudo}" em ${disciplina}. Escreva em ${letra}.`,
        perguntas: [
          `1. Na figura eu vejo ___________ que é um exemplo de ${conteudo}.`,
          `2. Quando estudo ${conteudo} em ${disciplina}, aprendo que ___________.`,
          `3. Uma coisa que eu não sabia sobre ${conteudo} e agora sei é ___________.`,
          `4. Quero aprender mais sobre ${conteudo} porque ___________.`,
        ],
        instrucaoDesenho: '',
        temDesenho: false,
      }),
    },
    {
      tipo: 'Caça-Palavras / Palavras Escondidas',
      gerar: (img: { url: string; descricao: string }, idx: number) => {
        const palavras = conteudo.split(' ').filter((p: string) => p.length > 3).slice(0, 4)
        return {
          titulo: `Atividade ${idx+1}: Palavras do Tema — ${conteudo}`,
          instrucao: `Observe a figura (${img.descricao}). As palavras abaixo estão relacionadas ao que você aprendeu sobre "${conteudo}". Escreva cada uma em ${letra} e depois faça uma frase com ela.`,
          perguntas: palavras.length > 0
            ? palavras.map((p: string, i: number) => `${i+1}. ${p.toUpperCase()} → Minha frase: ___________________________`)
            : [
                `1. ${conteudo.split(' ')[0].toUpperCase()} → Minha frase: ___________________________`,
                `2. Escreva 3 palavras que aprendeu sobre o tema: ___ | ___ | ___`,
              ],
          instrucaoDesenho: `Desenhe uma palavra que aprendeu sobre ${conteudo}:`,
          temDesenho: true,
        }
      },
    },
    {
      tipo: 'Sequência de Passos',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Coloque na Ordem Certa — ${conteudo}`,
        instrucao: `Veja a imagem (${img.descricao}) e pense sobre o que você aprendeu em ${disciplina} sobre "${conteudo}". Numere os passos abaixo de 1 a 4 na ordem correta.`,
        perguntas: [
          `( ) Observar o que acontece com ${conteudo}`,
          `( ) Registrar o que aprendemos`,
          `( ) Estudar e entender ${conteudo}`,
          `( ) Compartilhar o conhecimento com os colegas`,
          `Agora escreva com suas palavras em ${letra} para que serve ${conteudo}: ___________`,
        ],
        instrucaoDesenho: '',
        temDesenho: false,
      }),
    },
    {
      tipo: 'Verdadeiro ou Falso Argumentado',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Verdadeiro, Falso ou Depende? — ${conteudo}`,
        instrucao: `Olhe a figura (${img.descricao}). Leia cada afirmação sobre "${conteudo}" e escreva V (verdadeiro), F (falso) ou D (depende). Depois explique em ${letra}.`,
        perguntas: [
          `1. ( ) ${conteudo} é importante para nosso aprendizado. Por quê? ___________`,
          `2. ( ) Só aprendemos ${conteudo} na escola. Por quê? ___________`,
          `3. ( ) ${disciplina} e ${conteudo} estão relacionados com a vida real. Por quê? ___________`,
          `4. ( ) Qualquer pessoa pode aprender sobre ${conteudo}. Por quê? ___________`,
        ],
        instrucaoDesenho: '',
        temDesenho: false,
      }),
    },
    {
      tipo: 'Criação e Expressão',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Crie sua História — ${conteudo}`,
        instrucao: `Inspire-se na imagem (${img.descricao}) e no que aprendeu sobre "${conteudo}" para criar!`,
        perguntas: [
          `1. Escreva em ${letra} um título para uma história sobre ${conteudo}: ___________`,
          `2. Quem são os personagens? ___________`,
          `3. O que acontece? (pelo menos 2 frases): ___________`,
          `4. Como termina? ___________`,
        ],
        instrucaoDesenho: `Ilustre sua história no espaço abaixo:`,
        temDesenho: true,
      }),
    },
    {
      tipo: 'Pesquisa e Descoberta',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Seja um Pesquisador — ${conteudo}`,
        instrucao: `Como um cientista, você vai investigar "${conteudo}"! Olhe a imagem (${img.descricao}) e responda em ${letra}.`,
        perguntas: [
          `1. O QUE É isso? (Defina ${conteudo} com suas palavras) ___________`,
          `2. ONDE encontramos ${conteudo}? ___________`,
          `3. PARA QUE serve ou para que é importante? ___________`,
          `4. O QUE você ainda quer saber sobre ${conteudo}? ___________`,
        ],
        instrucaoDesenho: `Desenhe sua descoberta mais importante sobre ${conteudo}:`,
        temDesenho: true,
      }),
    },
    {
      tipo: 'Comparação e Análise',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Compare e Analise — ${conteudo}`,
        instrucao: `Use a imagem (${img.descricao}) como referência. Pense em tudo que aprendeu sobre "${conteudo}" e complete a tabela escrevendo em ${letra}.`,
        perguntas: [
          `| O que eu SABIA antes | O que eu APRENDI | O que ainda quero saber |`,
          `|______________________|_________________|_________________________|`,
          `|                      |                 |                         |`,
          `|                      |                 |                         |`,
          `Escreva 1 coisa que vai lembrar para sempre sobre ${conteudo}: ___________`,
        ],
        instrucaoDesenho: '',
        temDesenho: false,
      }),
    },
    {
      tipo: 'Jogo Didático',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Jogo dos Saberes — ${conteudo}`,
        instrucao: `Olhe a figura (${img.descricao}). Agora é hora de jogar! Cada ponto vale 1 estrela ⭐`,
        perguntas: [
          `⭐ FÁCIL: Dê 2 exemplos de ${conteudo}: ___ e ___`,
          `⭐⭐ MÉDIO: Explique em ${letra} o que é ${conteudo} (em 1 frase): ___________`,
          `⭐⭐⭐ DIFÍCIL: Crie uma pergunta sobre ${conteudo} para fazer para um colega: ___________`,
          `🏆 DESAFIO: Como você ensinaria ${conteudo} para alguém que nunca ouviu falar? ___________`,
        ],
        instrucaoDesenho: `Desenhe o símbolo ou ícone que representa ${conteudo} para você:`,
        temDesenho: true,
      }),
    },
    {
      tipo: 'Mapa Mental Visual',
      gerar: (img: { url: string; descricao: string }, idx: number) => ({
        titulo: `Atividade ${idx+1}: Mapa do Conhecimento — ${conteudo}`,
        instrucao: `Use a imagem (${img.descricao}) como inspiração. Complete o mapa mental sobre "${conteudo}" escrevendo em ${letra}.`,
        perguntas: [
          `            [${conteudo}]`,
          `           /     |     \\`,
          `    [O que é]  [Onde] [Para quê]`,
          `    ________  ______  __________`,
          `    ________  ______  __________`,
          `Agora escreva 1 frase completa unindo tudo: ___________`,
        ],
        instrucaoDesenho: `Adicione ícones ou pequenos desenhos ao redor das palavras:`,
        temDesenho: true,
      }),
    },
  ]

  // Seleciona tipos diferentes para cada atividade (sem repetir)
  const tiposSelecionados = []
  const indices = Array.from({ length: tiposDeFichas.length }, (_, i) => i)
  // Embaralha com seed baseado no conteudo
  const seed = conteudo.length + disciplina.length
  for (let i = indices.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }

  const atividades = []
  for (let i = 0; i < quantidade; i++) {
    const tipoIdx = indices[i % tiposDeFichas.length]
    const tipoFicha = tiposDeFichas[tipoIdx]
    const img = imgs[i]
    const atv = (tipoFicha.gerar as Function)(img, i)
    atividades.push({
      numero: i + 1,
      tipo: tipoFicha.tipo,
      nivel: nivelLabel,
      imagemUrl: img.url,
      imagemDescricao: img.descricao,
      promptImagem: `Ilustracao educativa colorida para ${prefixoIdade} de ${serie}, tema especifico: "${conteudo}" em ${disciplina}, estilo cartoon didatico brasileiro, fundo branco, cores vivas, sem texto, para imprimir em folha A4`,
      ...atv,
    })
  }
  return atividades
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, conteudo, nivel, quantidade, tipoLetra, objetivos } = body

    if (!conteudo) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório' }, { status: 400 })
    }

    const n = Math.min(parseInt(quantidade) || 3, 5)
    const atividades = gerarAtividadesVariadas(
      disciplina || 'Educação Geral',
      serie || 'Ensino Fundamental',
      conteudo,
      nivel || 'medio',
      n,
      tipoLetra || 'forma'
    )

    return NextResponse.json({
      success: true,
      disciplina,
      serie,
      conteudo,
      nivel,
      totalAtividades: atividades.length,
      atividades,
    })
  } catch (error: any) {
    console.error('[gerar-atividade] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar atividades: ' + error.message },
      { status: 500 }
    )
  }
}
