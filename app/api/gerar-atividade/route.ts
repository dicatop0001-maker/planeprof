import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// Gera atividades com imagens usando placeholders visuais educativos
// Cada atividade tem: título, instruções, imagem ilustrativa via URL pública

const TEMAS_IMAGENS: Record<string, string[]> = {
  matematica: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop',
  ],
  formas: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=400&h=300&fit=crop',
  ],
  natureza: [
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=300&fit=crop',
  ],
  animais: [
    'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop',
  ],
  letras: [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  ],
  arte: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
  ],
}

function getImagens(conteudo: string, n: number): string[] {
  const c = conteudo.toLowerCase()
  let pool = TEMAS_IMAGENS.default
  if (c.includes('matemát') || c.includes('número') || c.includes('conta') || c.includes('quantidade')) pool = TEMAS_IMAGENS.matematica
  else if (c.includes('forma') || c.includes('geométr') || c.includes('círculo') || c.includes('quadrado')) pool = TEMAS_IMAGENS.formas
  else if (c.includes('natur') || c.includes('plant') || c.includes('meio ambient')) pool = TEMAS_IMAGENS.natureza
  else if (c.includes('animal') || c.includes('bicho') || c.includes('fauna')) pool = TEMAS_IMAGENS.animais
  else if (c.includes('letra') || c.includes('leitura') || c.includes('escrita') || c.includes('portugu')) pool = TEMAS_IMAGENS.letras
  else if (c.includes('arte') || c.includes('pintura') || c.includes('desenho') || c.includes('color')) pool = TEMAS_IMAGENS.arte

  // Retorna n imagens (repetindo se necessário)
  const result = []
  for (let i = 0; i < n; i++) result.push(pool[i % pool.length])
  return result
}

function gerarAtividades(disciplina: string, serie: string, conteudo: string, objetivos: string[], nivel: string, quantidade: number, tipoLetra: string) {
  const nivelLabel = nivel === 'facil' ? 'Fácil' : nivel === 'dificil' ? 'Difícil' : 'Médio'
  const imagens = getImagens(conteudo, quantidade)
  const fontNote = tipoLetra === 'cursiva' ? 'Escrever em letra cursiva.' : 'Escrever em letra de forma (bastão).'

  const templatesBase = [
    {
      titulo: `Observação e Registro — ${conteudo}`,
      tipo: 'Observação',
      instrucao: `Observe a imagem com atenção. Depois, ${tipoLetra === 'cursiva' ? 'escreva em letra cursiva' : 'escreva em letra de forma'} o nome de 3 coisas que você vê relacionadas a <strong>${conteudo}</strong>. Desenhe também o que mais chamou sua atenção!",`,
      extras: ['Linha para escrever:', '___________________________', '___________________________', '___________________________', 'Espaço para desenho: □']
    },
    {
      titulo: `Ligue os Pontos — ${conteudo}`,
      tipo: 'Associação',
      instrucao: `Olhe as figuras abaixo relacionadas a <strong>${conteudo}</strong>. Ligue cada imagem ao nome correto com uma linha. ${fontNote}`,
      extras: ['• Imagem 1 ——— Nome A', '• Imagem 2 ——— Nome B', '• Imagem 3 ——— Nome C']
    },
    {
      titulo: `Complete a Sequência — ${conteudo}`,
      tipo: 'Sequência',
      instrucao: `Veja a sequência de imagens sobre <strong>${conteudo}</strong>. O que vem depois? Desenhe ou ${tipoLetra === 'cursiva' ? 'escreva em cursiva' : 'escreva'} a resposta no espaço indicado.`,
      extras: ['🔲 → 🔲 → 🔲 → ❓', 'Resposta: ________________']
    },
    {
      titulo: `Verdadeiro ou Falso — ${conteudo}`,
      tipo: 'Avaliação',
      instrucao: `Leia as afirmações sobre <strong>${conteudo}</strong> e escreva V (verdadeiro) ou F (falso) no espaço. ${fontNote}`,
      extras: [
        `( ) ${conteudo} faz parte do nosso cotidiano.`,
        `( ) Podemos aprender sobre ${conteudo} brincando.`,
        `( ) ${conteudo} só existe nos livros.`,
      ]
    },
    {
      titulo: `Colorir e Aprender — ${conteudo}`,
      tipo: 'Arte e Conteúdo',
      instrucao: `Observe a imagem relacionada a <strong>${conteudo}</strong>. Colorindo-a, você aprende as características do tema! Use as cores indicadas: vermelho, azul, verde e amarelo. Após colorir, ${tipoLetra === 'cursiva' ? 'escreva em letra cursiva' : 'escreva'} uma frase sobre o que você aprendeu.`,
      extras: ['Minha frase:', '________________________________________________']
export const dynamic = 'force-dynamic'

const TEMAS_IMAGENS: Record<string, string[]> = {
  matematica: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop',
  ],
  formas: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=400&h=300&fit=crop',
  ],
  natureza: [
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=300&fit=crop',
  ],
  animais: [
    'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop',
  ],
  letras: [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  ],
  arte: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
  ],
}

function getImagens(conteudo: string, n: number): string[] {
  const c = conteudo.toLowerCase()
  let pool = TEMAS_IMAGENS.default
  if (c.includes('matem') || c.includes('numer') || c.includes('conta') || c.includes('quantid')) pool = TEMAS_IMAGENS.matematica
  else if (c.includes('forma') || c.includes('geometr') || c.includes('circulo') || c.includes('quadrado')) pool = TEMAS_IMAGENS.formas
  else if (c.includes('natur') || c.includes('plant') || c.includes('ambient')) pool = TEMAS_IMAGENS.natureza
  else if (c.includes('animal') || c.includes('bicho') || c.includes('fauna')) pool = TEMAS_IMAGENS.animais
  else if (c.includes('letra') || c.includes('leitura') || c.includes('escrita') || c.includes('portugu')) pool = TEMAS_IMAGENS.letras
  else if (c.includes('arte') || c.includes('pintura') || c.includes('desenho') || c.includes('color')) pool = TEMAS_IMAGENS.arte
  const result = []
  for (let i = 0; i < n; i++) result.push(pool[i % pool.length])
  return result
}

function gerarAtividades(disciplina: string, serie: string, conteudo: string, nivel: string, quantidade: number, tipoLetra: string) {
  const nivelLabel = nivel === 'facil' ? 'Facil' : nivel === 'dificil' ? 'Dificil' : 'Medio'
  const imagens = getImagens(conteudo, quantidade)
  const fontNote = tipoLetra === 'cursiva' ? 'letra cursiva' : 'letra de forma'

  const templates = [
    {
      titulo: `Observe e Escreva - ${conteudo}`,
      tipo: 'Observacao e Registro',
      instrucao: `Observe a imagem com atencao. Depois, escreva em ${fontNote} o nome de 3 coisas que voce ve relacionadas a "${conteudo}". Desenhe tambem o que mais chamou sua atencao!`,
      linhas: ['1. ___________________________', '2. ___________________________', '3. ___________________________'],
      temDesenho: true
    },
    {
      titulo: `Ligue Corretamente - ${conteudo}`,
      tipo: 'Associacao',
      instrucao: `Olhe as figuras relacionadas a "${conteudo}". Ligue cada imagem ao nome correto com uma linha. Escreva em ${fontNote}.`,
      linhas: ['Imagem 1 ........... ( ) Nome A', 'Imagem 2 ........... ( ) Nome B', 'Imagem 3 ........... ( ) Nome C'],
      temDesenho: false
    },
    {
      titulo: `Complete a Frase - ${conteudo}`,
      tipo: 'Completar',
      instrucao: `Observe a imagem e complete as frases abaixo sobre "${conteudo}" escrevendo em ${fontNote}.`,
      linhas: [`Eu vejo ___________________ na imagem.`, `Isso me lembra ___________________.`, `A cor que mais aparece e ___________________.`],
      temDesenho: false
    },
    {
      titulo: `Verdadeiro ou Falso - ${conteudo}`,
      tipo: 'Avaliacao',
      instrucao: `Leia as frases sobre "${conteudo}" e escreva V (verdadeiro) ou F (falso) no espaco. Escreva em ${fontNote}.`,
      linhas: [`( ) ${conteudo} faz parte do nosso dia a dia.`, `( ) Podemos aprender sobre ${conteudo} brincando.`, `( ) ${disciplina} e a materia onde estudamos ${conteudo}.`],
      temDesenho: false
    },
    {
      titulo: `Desenhe e Pinte - ${conteudo}`,
      tipo: 'Arte e Criatividade',
      instrucao: `Observe a imagem sobre "${conteudo}". Agora, no espaco abaixo, desenhe e pinte sua propria versao! Depois, escreva em ${fontNote} uma frase sobre o que voce desenhou.`,
      linhas: ['Minha frase: __________________________________________________'],
      temDesenho: true
    },
  ]

  return Array.from({ length: quantidade }, (_, i) => {
    const t = templates[i % templates.length]
    return {
      numero: i + 1,
      titulo: t.titulo,
      tipo: t.tipo,
      nivel: nivelLabel,
      instrucao: t.instrucao,
      linhas: t.linhas,
      temDesenho: t.temDesenho,
      imagemUrl: imagens[i],
      promptImagem: `Ilustracao educativa colorida para criancas de ${serie}, tema "${conteudo}", estilo cartoon didatico, fundo branco, cores vibrantes, simples, para atividade escolar impressa`,
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disciplina, serie, conteudo, nivel, quantidade, tipoLetra } = body
    if (!conteudo) return NextResponse.json({ error: 'Conteudo obrigatorio' }, { status: 400 })
    const n = Math.min(parseInt(quantidade) || 3, 5)
    const atividades = gerarAtividades(disciplina || 'Geral', serie || 'Infantil', conteudo, nivel || 'medio', n, tipoLetra || 'forma')
    return NextResponse.json({ success: true, atividades })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
