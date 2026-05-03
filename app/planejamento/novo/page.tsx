'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

const DISCIPLINAS = ['Matemática','Língua Portuguesa','Ciências','História','Geografia','Arte','Educação Física','Ensino Religioso','Inglês']
const SERIES = ['Berçário I','Berçário II','Infantil I','Infantil II','Infantil III','Infantil IV','Infantil V','1º Ano','2º Ano','3º Ano','4º Ano','5º Ano','6º Ano','7º Ano','8º Ano','9º Ano']

// Habilidades BNCC por disciplina e série (exemplos principais)
const HABILIDADES_BNCC_DATA: Record<string, {codigo: string, descricao: string}[]> = {
  'Matemática': [
    {codigo: 'EF01MA01', descricao: 'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas'},
    {codigo: 'EF01MA06', descricao: 'Realizar adição de dois números, com e sem agrupamento, com e sem suporte de material manipulável'},
    {codigo: 'EF02MA01', descricao: 'Comparar e ordenar números naturais, inteiros e racionais em diferentes contextos'},
    {codigo: 'EF03MA01', descricao: 'Ler, escrever e comparar números naturais de até a ordem dos milhar com compreensão'},
    {codigo: 'EF04MA01', descricao: 'Ler, escrever e ordenar números naturais até a ordem dos milhões'},
    {codigo: 'EF05MA01', descricao: 'Ler, escrever, comparar e ordenar números naturais, racionais e inteiros'},
    {codigo: 'EF04MA09', descricao: 'Reconhecer as frações unitárias mais usuais como metade, terça parte, quarta parte, décima parte'},
    {codigo: 'EF05MA07', descricao: 'Calcular e representar frações equivalentes e simplificação de frações'},
    {codigo: 'EF06MA07', descricao: 'Resolver e elaborar problemas que envolvam porcentagem, de preferência relacionados ao contexto social'},
    {codigo: 'EF07MA01', descricao: 'Compreender a ideia de número real, representar na reta numérica e compará-los'},
    {codigo: 'EF08MA01', descricao: 'Resolver e elaborar problemas envolvendo porcentagem, incluindo os que requerem cálculo de taxas percentuais'},
    {codigo: 'EF09MA01', descricao: 'Compreender os números reais, com e sem o uso de tecnologias digitais'},
  ],
  'Língua Portuguesa': [
    {codigo: 'EF01LP01', descricao: 'Reconhecer que palavras e frases são formadas por letras e que há diferença entre letras e outros sinais gráficos'},
    {codigo: 'EF02LP01', descricao: 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, enunciados de tarefas escolares'},
    {codigo: 'EF03LP01', descricao: 'Ler e compreender textos literários de diferentes gêneros e extensões, desenvolvendo preferências por gêneros'},
    {codigo: 'EF04LP01', descricao: 'Demonstrar compreensão de textos lidos em voz alta por adultos e de textos multissemióticos'},
    {codigo: 'EF05LP01', descricao: 'Compreender e interpretar textos de diferentes gêneros textuais, identificando tema e propósito'},
    {codigo: 'EF06LP01', descricao: 'Engajar-se e contribuir com a escuta atenta às apresentações de trabalhos e as instruções'},
    {codigo: 'EF07LP01', descricao: 'Identificar os efeitos de sentido do uso de recursos expressivos sonoros em textos'},
    {codigo: 'EF08LP01', descricao: 'Reconhecer e utilizar formas de progressão temática como as remissões e repetições que conferem coerência textual'},
    {codigo: 'EF09LP01', descricao: 'Identificar e compreender, em textos argumentativos, os posicionamentos e as estratégias argumentativas'},
  ],
  'Ciências': [
    {codigo: 'EF01CI01', descricao: 'Comparar características de diferentes materiais presentes em objetos de uso cotidiano'},
    {codigo: 'EF02CI01', descricao: 'Identificar de onde vêm os alimentos consumidos em casa, na escola e no município'},
    {codigo: 'EF03CI01', descricao: 'Produzir diferentes misturas e comparar as características dos materiais antes e depois de serem misturados'},
    {codigo: 'EF04CI01', descricao: 'Identificar misturas na vida diária e propor como separá-las com base nas propriedades físicas e químicas'},
    {codigo: 'EF05CI01', descricao: 'Explorar fenômenos da vida cotidiana que evidenciem propriedades físicas dos materiais'},
    {codigo: 'EF06CI01', descricao: 'Classificar como homogêneas ou heterogêneas misturas envolvendo diferentes materiais do cotidiano'},
    {codigo: 'EF07CI01', descricao: 'Discutir a aplicação, no dia a dia, de métodos de separação de misturas'},
    {codigo: 'EF08CI01', descricao: 'Identificar e classificar diferentes tipos de reatores nucleares e discutir vantagens e desvantagens'},
    {codigo: 'EF09CI01', descricao: 'Investigar as transformações que ocorrem no corpo durante a puberdade'},
  ],
  'História': [
    {codigo: 'EF01HI01', descricao: 'Identificar aspectos do seu crescimento por meio do registro das lembranças particulares ou de um grupo social'},
    {codigo: 'EF03HI01', descricao: 'Identificar aspectos do próprio desenvolvimento e os processos de formação da comunidade em que vive'},
    {codigo: 'EF05HI01', descricao: 'Identificar os processos de produção, hierarquização e difusão dos marcos de memória'},
    {codigo: 'EF06HI01', descricao: 'Identificar diferentes formas de compreensão da noção de tempo e de periodização dos processos históricos'},
    {codigo: 'EF07HI01', descricao: 'Explicar o significado de "modernidade" e suas lógicas de inclusão e exclusão'},
    {codigo: 'EF08HI01', descricao: 'Conhecer e apreciar a história do Brasil no contexto da história da América e do mundo'},
    {codigo: 'EF09HI01', descricao: 'Descrever e contextualizar os principais aspectos sociais, culturais, econômicos e políticos da história do Brasil'},
  ],
  'Geografia': [
    {codigo: 'EF01GE01', descricao: 'Descrever características observadas de seus lugares de vivência (moradia, escola etc.)'},
    {codigo: 'EF03GE01', descricao: 'Identificar instâncias do poder público e canais de participação social responsáveis por buscar soluções'},
    {codigo: 'EF05GE01', descricao: 'Descrever e analisar dinâmicas populacionais na UF em que vive'},
    {codigo: 'EF06GE01', descricao: 'Comparar modificações das paisagens nos lugares de vivência e os usos desses lugares em diferentes tempos'},
    {codigo: 'EF07GE01', descricao: 'Avaliar, por meio de exemplos extraídos dos contextos locais e regionais, a importância do trabalho'},
    {codigo: 'EF08GE01', descricao: 'Descrever as rotas de dispersão da espécie humana pelo planeta e os processos de formação de populações'},
    {codigo: 'EF09GE01', descricao: 'Analisar criticamente de que forma a hegemonia europeia foi exercida nos diferentes territórios colonizados'},
  ],
}

// Conteúdos programáticos por série e bimestre
const CONTEUDOS_PROGRAMATICOS: Record<string, Record<string, Record<string, string[]>>> = {
  'Matemática': {
    '1º Ano': {
      '1': ['Números de 0 a 10 - contagem e representação','Figuras geométricas planas - identificação','Sequências numéricas crescentes e decrescentes'],
      '2': ['Números de 0 a 20 - adição e subtração','Medidas de comprimento não padronizadas','Dezena e unidade'],
      '3': ['Números até 100 - agrupamentos','Multiplicação como adição repetida','Gráficos e tabelas simples'],
      '4': ['Números até 100 - revisão','Sistema monetário brasileiro','Tempo - calendário e horas'],
    },
    '2º Ano': {
      '1': ['Números até 100 - leitura e escrita','Adição com reagrupamento','Subtração com reagrupamento'],
      '2': ['Números até 1000','Multiplicação - fatos básicos','Divisão exata simples'],
      '3': ['Frações - metade, terça e quarta parte','Medidas de massa e capacidade','Figuras geométricas espaciais'],
      '4': ['Problemas com as quatro operações','Sistema monetário - cálculo de troco','Estatística simples'],
    },
    '3º Ano': {
      '1': ['Números até 10.000','Adição e subtração de números de 3 dígitos','Multiplicação com 1 dígito'],
      '2': ['Divisão com 1 dígito','Frações - numerador e denominador','Ângulos e figuras geométricas'],
      '3': ['Números decimais - décimos e centésimos','Perímetro de figuras planas','Probabilidade - básica'],
      '4': ['Problemas de múltiplas etapas','Área de figuras simples','Revisão e consolidação'],
    },
    '4º Ano': {
      '1': ['Números até 1.000.000','Números romanos','Multiplicação por 2 dígitos'],
      '2': ['Divisão por 2 dígitos','Frações equivalentes e simplificação','Decimais - soma e subtração'],
      '3': ['Porcentagem - noção básica','Ângulos - medição','Transformações geométricas'],
      '4': ['Problemas com frações e decimais','Área e perímetro','Gráficos e estatística'],
    },
    '5º Ano': {
      '1': ['Números naturais e operações','Frações: conceito de numerador, denominador e representação gráfica','Mínimo múltiplo comum e máximo divisor comum'],
      '2': ['Números decimais - operações','Porcentagem e juros simples','Razão e proporção'],
      '3': ['Álgebra - equações simples','Geometria - polígonos regulares','Volume de cubos e paralelepípedos'],
      '4': ['Estatística - média, moda e mediana','Revisão geral do Ensino Fundamental I','Problemas desafiadores'],
    },
    '6º Ano': {
      '1': ['Números inteiros - operações','Divisibilidade e números primos','Frações e operações'],
      '2': ['Números decimais e porcentagem','Razão e proporção','Regra de três simples'],
      '3': ['Álgebra - expressões e equações','Geometria plana - áreas','Estatística e probabilidade'],
      '4': ['Geometria espacial - volumes','Juros e porcentagem','Revisão e projetos'],
    },
    '7º Ano': {
      '1': ['Números racionais - operações','Equações de 1º grau','Proporcionalidade'],
      '2': ['Inequações de 1º grau','Semelhança de triângulos','Geometria analítica básica'],
      '3': ['Expressões algébricas','Teorema de Pitágoras','Trigonometria básica'],
      '4': ['Estatística - representações','Probabilidade','Revisão e aplicações'],
    },
  },
  'Língua Portuguesa': {
    '1º Ano': {
      '1': ['Alfabeto - letras e sons','Vogais e consoantes','Sílabas simples'],
      '2': ['Palavras e sílabas','Leitura de palavras simples','Escrita do nome'],
      '3': ['Frases simples','Texto narrativo curto','Pontuação básica'],
      '4': ['Produção de frases','Revisão do alfabeto','Leitura de pequenos textos'],
    },
    '2º Ano': {
      '1': ['Sílabas - formação de palavras','Leitura de textos simples','Ditado de palavras'],
      '2': ['Tipos de texto - história e poema','Adjetivos e substantivos básicos','Escrita criativa'],
      '3': ['Pontuação - ponto e vírgula','Parágrafo e estrutura de texto','Ortografia básica'],
      '4': ['Produção de texto curto','Leitura e interpretação','Revisão ortográfica'],
    },
    '3º Ano': {
      '1': ['Tipos de texto - narrativo e descritivo','Substantivos - gênero e número','Verbos - noção básica'],
      '2': ['Ortografia - dificuldades comuns','Leitura e interpretação de texto','Produção escrita'],
      '3': ['Poesia - rima e ritmo','Pontuação - exclamação e interrogação','Adjetivos e concordância'],
      '4': ['Produção de texto narrativo','Revisão ortográfica e gramatical','Leitura de diferentes gêneros'],
    },
    '4º Ano': {
      '1': ['Gêneros textuais - diversidade','Substantivos compostos e derivados','Verbos - tempos e conjugação'],
      '2': ['Artigos, pronomes e advérbios','Produção de texto argumentativo simples','Interpretação de texto'],
      '3': ['Preposições e conjunções','Período composto - básico','Ortografia avançada'],
      '4': ['Revisão gramatical','Produção de diferentes gêneros','Leitura crítica'],
    },
    '5º Ano': {
      '1': ['Morfologia - classes de palavras','Verbos - modo indicativo e subjuntivo','Análise sintática básica'],
      '2': ['Concordância verbal e nominal','Crase e regência básica','Texto dissertativo-argumentativo'],
      '3': ['Figuras de linguagem','Literatura brasileira - introdução','Produção de texto'],
      '4': ['Revisão gramatical','Preparação para o 6º ano','Projetos de leitura'],
    },
    '6º Ano': {
      '1': ['Variações linguísticas','Narrativa - elementos','Morfologia avançada'],
      '2': ['Análise sintática','Texto argumentativo','Figuras de linguagem'],
      '3': ['Literatura - gêneros','Produção de textos diversos','Ortografia e gramática'],
      '4': ['Projeto de leitura','Revisão e avaliação','Produção final'],
    },
  },
  'Ciências': {
    '1º Ano': {
      '1': ['Seres vivos e não vivos','Corpo humano - partes externas','Animais e plantas no cotidiano'],
      '2': ['Sentidos humanos','Alimentos - saudáveis e não saudáveis','Água e sua importância'],
      '3': ['Fenômenos da natureza - chuva e vento','Dia e noite','Materiais e suas propriedades'],
      '4': ['Reciclagem e cuidados com o ambiente','Estações do ano','Revisão'],
    },
    '4º Ano': {
      '1': ['Sistema solar e planetas','Movimentos da Terra','Fases da Lua'],
      '2': ['Cadeia alimentar','Ecossistemas brasileiros','Fotossíntese'],
      '3': ['Misturas e separação de misturas','Propriedades da água','Estados físicos da matéria'],
      '4': ['Energia elétrica - fontes','Preservação ambiental','Revisão e projetos'],
    },
    '5º Ano': {
      '1': ['Sistemas do corpo humano - digestório e respiratório','Saúde e doenças','Microrganismos'],
      '2': ['Sistema nervoso e endócrino','Puberdade e adolescência','Reprodução humana - básica'],
      '3': ['Ecologia - cadeias e teias alimentares','Biomas brasileiros','Impactos ambientais'],
      '4': ['Tecnologia e ciência','Revisão geral','Projetos de pesquisa'],
    },
  },
  'História': {
    '3º Ano': {
      '1': ['A história da minha família','Linha do tempo pessoal','Diferentes formas de registrar a história'],
      '2': ['A comunidade onde vivemos','Trabalho e moradia ao longo do tempo','Tradições culturais locais'],
      '3': ['O município - formação histórica','Patrimônio histórico local','Transformações urbanas'],
      '4': ['Cultura indígena local','Afrodescendência na história local','Revisão'],
    },
    '4º Ano': {
      '1': ['Povos indígenas no Brasil','Chegada dos europeus','Processo de colonização'],
      '2': ['Escravidão no Brasil','Resistência negra e indígena','Quilombos'],
      '3': ['Economia colonial','Ciclo do ouro','Cidades coloniais'],
      '4': ['Independência do Brasil','Período imperial','Proclamação da República'],
    },
    '5º Ano': {
      '1': ['República Velha','Revolução de 1930','Era Vargas'],
      '2': ['Democracia e ditadura militar','Redemocratização','Constituição de 1988'],
      '3': ['Brasil e o mundo atual','Globalização','Direitos humanos'],
      '4': ['Revisão','Projetos históricos','Identidade brasileira'],
    },
  },
  'Geografia': {
    '3º Ano': {
      '1': ['Espaço natural e espaço construído','Paisagens naturais e culturais','O lugar onde vivemos'],
      '2': ['Campo e cidade - diferenças','Meios de transporte e comunicação','Fontes de energia'],
      '3': ['Água - importância e ciclo hidrológico','Poluição e preservação','Clima e tempo'],
      '4': ['Diferentes paisagens brasileiras','Cultura e diversidade','Revisão'],
    },
    '4º Ano': {
      '1': ['Brasil - localização e regiões','Biomas brasileiros','Relevo e hidrografia'],
      '2': ['Clima no Brasil','População brasileira','Urbanização'],
      '3': ['Economia brasileira','Agricultura e pecuária','Indústria e serviços'],
      '4': ['Problemas ambientais','Sustentabilidade','Revisão'],
    },
    '5º Ano': {
      '1': ['América do Sul - localização e países','Mercosul','Relações econômicas regionais'],
      '2': ['Continentes e oceanos','Globalização','Organizações internacionais'],
      '3': ['Desenvolvimento sustentável','Mudanças climáticas globais','Biodiversidade'],
      '4': ['Brasil no contexto mundial','Revisão geral','Projetos'],
    },
  },
}


interface PlanoGerado {
  habilidades_bncc: string[]
  objetivos: string[]
  desenvolvimento: string
  conclusao: string
  dinamica: string
  pdi?: string
}

export default function NovoPlanejamentoPage() {
  const [form, setForm] = useState({
    disciplina:'', serie:'', bimestre:'1', conteudo:'', orientacoes:'',
    numObjetivos:'3', tipoLetra:'forma', numAulas:'1', numAtividades:'2', nivelAtividade:'medio'
  })
  const [logoPreview, setLogoPreview] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingSection, setLoadingSection] = useState<string|null>(null)
  const [plano, setPlano] = useState<PlanoGerado | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [compartilharBiblioteca, setCompartilharBiblioteca] = useState(false)
  const [pdiMode, setPdiMode] = useState(false)
  const [pdiAluno, setPdiAluno] = useState('')
  const [pdiNecessidades, setPdiNecessidades] = useState('')
  const [gerandoPdi, setGerandoPdi] = useState(false)
  const [mostrarMenuHabilidades, setMostrarMenuHabilidades] = useState(false)
  const [mostrarMenuConteudo, setMostrarMenuConteudo] = useState(false)
  const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState<{codigo: string, descricao: string}[]>([])
  const [numHabilidades, setNumHabilidades] = useState(2)
  const logoRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGerar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPlano(null)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...form, habilidadesManuais: habilidadesSelecionadas.map(h=>h.codigo)})
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Erro ao gerar plano')
      setPlano(data.plano)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar plano.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegerar = async (secao: string) => {
    setLoadingSection(secao)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, regenerar: secao })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Erro')
      if (plano && data.plano) {
        setPlano(prev => prev ? { ...prev, [secao]: data.plano[secao] } : data.plano)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingSection(null)
    }
  }

  const handleGerarPDI = async () => {
    if (!plano) return
    setGerandoPdi(true)
    try {
      const resp = await fetch('/api/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, gerarPdi: true, pdiAluno, pdiNecessidades })
      })
      const data = await resp.json()
      if (data.plano?.pdi) {
        setPlano(prev => prev ? { ...prev, pdi: data.plano.pdi } : prev)
      }
    } catch(err: any) {
      setError(err.message)
    } finally {
      setGerandoPdi(false)
    }
  }

  const handleSalvar = async () => {
    if (!plano) return
    setSaving(true)
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return; }
    const titulo = form.conteudo.substring(0, 60) + ' - ' + form.disciplina + ' ' + form.serie
    const { data, error } = await supabase.from('planos_de_aula').insert({
      user_id: user.id, titulo, disciplina: form.disciplina, serie: form.serie,
      bimestre: parseInt(form.bimestre), conteudo: form.conteudo,
      habilidades_bncc: [...(habilidadesSelecionadas.length > 0 ? habilidadesSelecionadas.map(h => h.codigo) : []), ...plano.habilidades_bncc].filter((v,i,a)=>a.indexOf(v)===i), objetivos: plano.objetivos,
      desenvolvimento: plano.desenvolvimento, conclusao: plano.conclusao,
      dinamica: plano.dinamica, tipo_letra: form.tipoLetra,
      na_biblioteca: compartilharBiblioteca, status: 'concluido'
    }).select().single()
    if (error) {
      setError('Erro ao salvar. Tente novamente.')
    } else if (data) {
      router.push('/dashboard')
    }
    setSaving(false)
  }

  const fontStyle = form.tipoLetra === 'cursiva' ? { fontFamily: 'cursive' } : {}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
            <h1 className="text-xl font-bold text-blue-900">Novo Planejamento</h1>
          </div>
          {logoPreview && (
            <img src={logoPreview} alt="Logo escola" className="h-12 w-auto object-contain rounded" />
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Card Escola */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">🏫 Dados da Escola</h2>
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition text-sm font-medium"
            >
              📷 Upload Logo da Escola
            </button>
            <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
          </div>
          {logoPreview && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain" />
              <div>
                <p className="text-sm font-medium text-gray-700">Logo carregado com sucesso!</p>
                <button onClick={() => setLogoPreview(null)} className="text-xs text-red-500 hover:underline">Remover</button>
              </div>
            </div>
          )}
        </div>

        {/* Card Dados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">📋 Dados do Planejamento</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleGerar} className="space-y-4">
            {/* Ícones clicáveis - linha 1: Disciplina e Série/Ano */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {/* 1. Disciplina */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📚 Disciplina *</label>
                <select name="disciplina" value={form.disciplina} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
                  <option value="">Selecione...</option>
                  {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* 2. Série/Ano */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎓 Série/Ano *</label>
                <select name="serie" value={form.serie} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
                  <option value="">Selecione...</option>
                  {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* 3. Bimestre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📅 Bimestre</label>
                <select name="bimestre" value={form.bimestre} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  {['1','2','3','4'].map(n => <option key={n} value={n}>{n}° Bimestre</option>)}
                </select>
              </div>

              {/* 4. Nº de Aulas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🕐 Nº de Aulas</label>
                <select name="numAulas" value={form.numAulas} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} aula{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            {/* 5. Conteúdo Programático - ícone clicável */}
            <div>
              <button type="button"
                onClick={() => setMostrarMenuConteudo(!mostrarMenuConteudo)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 font-semibold transition text-left text-sm ${ form.conteudo ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'}`}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <span>Conteúdo Programático *</span>
                </span>
                <span className="flex items-center gap-2">
                  {form.conteudo ? <span className="text-xs text-green-600 max-w-xs truncate">{form.conteudo}</span> : <span className="text-xs text-gray-500">Toque para selecionar</span>}
                  <span>{mostrarMenuConteudo ? '▲' : '▼'}</span>
                </span>
              </button>
              {mostrarMenuConteudo && (
                <div className="mt-2 border border-gray-200 rounded-xl p-4 bg-white shadow-lg">
                  <p className="text-xs text-gray-500 mb-3">
                    {form.disciplina && form.serie && form.bimestre
                      ? `Referências curriculares para ${form.disciplina} - ${form.serie} - ${form.bimestre}° Bimestre:`
                      : 'Selecione a disciplina, série e bimestre acima para ver as referências curriculares. Ou digite manualmente:'}
                  </p>
                  {form.disciplina && form.serie && form.bimestre &&
                    CONTEUDOS_PROGRAMATICOS[form.disciplina]?.[form.serie]?.[form.bimestre] ? (
                    <div className="space-y-2 mb-4">
                      {CONTEUDOS_PROGRAMATICOS[form.disciplina][form.serie][form.bimestre].map((c, i) => (
                        <button key={i} type="button"
                          onClick={() => { setForm(prev => ({...prev, conteudo: c})); setMostrarMenuConteudo(false) }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition border ${ form.conteudo === c ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ou escreva o conteúdo personalizado:</label>
                    <input type="text" name="conteudo" value={form.conteudo} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Ex: Frações - conceito e operações básicas" />
                    <button type="button" onClick={() => setMostrarMenuConteudo(false)}
                      className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                      ✓ Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Habilidades da BNCC - ícone clicável */}
            <div>
              <button type="button"
                onClick={() => setMostrarMenuHabilidades(!mostrarMenuHabilidades)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 font-semibold transition text-left text-sm ${ habilidadesSelecionadas.length > 0 ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'}`}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Habilidades da BNCC</span>
                </span>
                <span className="flex items-center gap-2">
                  {habilidadesSelecionadas.length > 0
                    ? <span className="text-xs text-blue-600 max-w-xs truncate">{habilidadesSelecionadas.map(h=>h.codigo).join(', ')}</span>
                    : <span className="text-xs text-gray-500">Toque para selecionar (opcional)</span>}
                  <span>{mostrarMenuHabilidades ? '▲' : '▼'}</span>
                </span>
              </button>
              {mostrarMenuHabilidades && (
                <div className="mt-2 border border-gray-200 rounded-xl p-4 bg-white shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">
                      {form.disciplina ? `Habilidades de ${form.disciplina}:` : 'Selecione a disciplina acima para ver as habilidades.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600">Qtd (0-5):</label>
                      <select value={numHabilidades} onChange={e => setNumHabilidades(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-xs">
                        {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  {form.disciplina && HABILIDADES_BNCC_DATA[form.disciplina] ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                      {HABILIDADES_BNCC_DATA[form.disciplina].map((h, i) => {
                        const selected = habilidadesSelecionadas.some(s => s.codigo === h.codigo)
                        return (
                          <button key={i} type="button"
                            onClick={() => {
                              if (selected) {
                                setHabilidadesSelecionadas(prev => prev.filter(s => s.codigo !== h.codigo))
                              } else if (numHabilidades === 0 || habilidadesSelecionadas.length < numHabilidades) {
                                setHabilidadesSelecionadas(prev => [...prev, h])
                              } else {
                                setHabilidadesSelecionadas(prev => [...prev.slice(1), h])
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition border ${ selected ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'}`}>
                            <span className="font-mono font-bold text-blue-600">{h.codigo}</span>
                            <span className="ml-2 text-gray-700">{h.descricao}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : <p className="text-sm text-gray-400 mb-3">Selecione uma disciplina para ver as habilidades disponíveis.</p>}
                  <button type="button" onClick={() => setMostrarMenuHabilidades(false)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                    ✓ Confirmar ({habilidadesSelecionadas.length} selecionadas)
                  </button>
                </div>
              )}
            </div>

            {/* 7 e 8. Nº de Objetivos e Nº de Atividades Lúdicas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎯 Nº de Objetivos</label>
                <select name="numObjetivos" value={form.numObjetivos} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} objetivo{n>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎮 Nº de Atividades Lúdicas</label>
                <select name="numAtividades" value={form.numAtividades} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? 'Nenhuma' : n + ' atividade' + (n>1?'s lúdicas':' lúdica')}</option>)}
                </select>
              </div>
            </div>

            {/* Nível de dificuldade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Nível das Atividades</label>
              <div className="flex gap-3">
                {[
                  {val:'facil', label:'😊 Fácil', color:'green'},
                  {val:'medio', label:'🤔 Médio', color:'yellow'},
                  {val:'dificil', label:'🧠 Difícil', color:'red'}
                ].map(({val, label, color}) => (
                  <button key={val} type="button"
                    onClick={() => setForm(prev => ({...prev, nivelAtividade: val}))}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 font-semibold transition text-sm ${
                      form.nivelAtividade === val
                        ? color === 'green' ? 'border-green-500 bg-green-50 text-green-700'
                          : color === 'yellow' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Tipo de letra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">✏️ Tipo de Letra das Atividades</label>
              <div className="flex gap-3">
                <button type="button"
                  onClick={() => setForm(prev => ({ ...prev, tipoLetra: 'forma' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition text-center ${form.tipoLetra === 'forma' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  <span className="block text-lg mb-1" style={{fontFamily: 'sans-serif'}}>Aa</span>
                  <span className="text-sm">Letra de Forma</span>
                </button>
                <button type="button"
                  onClick={() => setForm(prev => ({ ...prev, tipoLetra: 'cursiva' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition text-center ${form.tipoLetra === 'cursiva' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  <span className="block text-lg mb-1" style={{fontFamily: 'cursive'}}>Aa</span>
                  <span className="text-sm">Letra Cursiva</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">⚙️ Orientações especiais (opcional)</label>
              <textarea name="orientacoes" value={form.orientacoes} onChange={handleChange}
                rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Incluir atividade prática, usar recursos visuais, jogos cooperativos..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span>⚙️</span> Gerando com IA...</> : <>🤖 Gerar Plano Completo com IA</>}
            </button>
          </form>
        </div>

        {/* PDI Button - sempre visível se disciplina e série preenchidas */}
        {form.disciplina && form.serie && !plano && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">♿</span>
                  <h3 className="text-xl font-bold">PDI - Plano de Desenvolvimento Individual</h3>
                </div>
                <p className="text-purple-100 text-sm">Gere um plano adaptado para alunos com necessidades especiais, com recursos visuais e cronogramas ilustrados.</p>
              </div>
              <button
                type="button"
                onClick={() => setPdiMode(!pdiMode)}
                className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-md flex items-center gap-2"
              >
                {pdiMode ? '✕ Fechar PDI' : '♿ Criar PDI'}
              </button>
            </div>
            {pdiMode && (
              <div className="mt-4 space-y-3 bg-white/10 rounded-xl p-4">
                <p className="text-sm font-medium text-white">Preencha para personalizar o PDI:</p>
                <input
                  type="text"
                  value={pdiAluno}
                  onChange={e => setPdiAluno(e.target.value)}
                  placeholder="Nome do aluno (opcional)"
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <textarea
                  value={pdiNecessidades}
                  onChange={e => setPdiNecessidades(e.target.value)}
                  rows={3}
                  placeholder="Necessidades específicas: Ex: TEA, TDAH, baixa visão, dislexia... descreva as necessidades do aluno."
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <p className="text-xs text-purple-100">💡 Primeiro gere o plano principal, depois o PDI será adaptado automaticamente.</p>
              </div>
            )}
          </div>
        )}

        {plano && (
          <div className="space-y-4">
            {/* Header do plano gerado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {logoPreview && <img src={logoPreview} alt="Logo" className="h-12 w-auto object-contain bg-white rounded p-1" />}
                <div>
                  <h2 className="text-xl font-bold">Plano de Aula Gerado! ✅</h2>
                  <p className="text-blue-100 text-sm">{form.disciplina} • {form.serie} • {form.bimestre}° Bimestre • {form.numAulas} aula{parseInt(form.numAulas)>1?'s':''}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white/20 ${form.tipoLetra === 'cursiva' ? 'text-purple-200' : 'text-blue-200'}`}>
                {form.tipoLetra === 'cursiva' ? '✒️ Letra Cursiva' : '🖊️ Letra de Forma'}
              </span>
            </div>

            {/* Habilidades BNCC */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-blue-700">📚 Habilidades BNCC</h2>
                <button onClick={() => handleRegerar('habilidades_bncc')} disabled={loadingSection === 'habilidades_bncc'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-200">
                  {loadingSection === 'habilidades_bncc' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {plano.habilidades_bncc.map((h, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-mono">{h}</span>
                ))}
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-700">🎯 Objetivos da Aula</h2>
                <button onClick={() => handleRegerar('objetivos')} disabled={loadingSection === 'objetivos'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition border border-green-200">
                  {loadingSection === 'objetivos' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <ul className="space-y-2">
                {plano.objetivos.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700" style={fontStyle}>
                    <span className="text-green-500 mt-0.5 font-bold">{i+1}.</span>{obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Desenvolvimento */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-purple-700">📖 Desenvolvimento da Aula</h2>
                <button onClick={() => handleRegerar('desenvolvimento')} disabled={loadingSection === 'desenvolvimento'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition border border-purple-200">
                  {loadingSection === 'desenvolvimento' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={fontStyle}>{plano.desenvolvimento}</p>
              </div>
              <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                <span>⚙️</span> Para personalizar o desenvolvimento, use o campo de orientações especiais acima e regenere.
              </div>
            </div>

            {/* Conclusão */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-orange-700">🏁 Conclusão e Reflexão</h2>
                <button onClick={() => handleRegerar('conclusao')} disabled={loadingSection === 'conclusao'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition border border-orange-200">
                  {loadingSection === 'conclusao' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.conclusao}</p>
              </div>
            </div>

            {/* Dinâmica / Jogo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-pink-700">🎮 Dinâmica/Jogo</h2>
                <button onClick={() => handleRegerar('dinamica')} disabled={loadingSection === 'dinamica'}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition border border-pink-200">
                  {loadingSection === 'dinamica' ? '⏳...' : '🔄 Regerar'}
                </button>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed" style={fontStyle}>{plano.dinamica}</p>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 font-medium">🎨 Prompt para gerar imagem desta dinâmica:</p>
                <p className="text-xs text-yellow-600 mt-1 italic">"Ilustração colorida e lúdica para crianças de {form.serie}, mostrando crianças brincando e aprendendo {form.conteudo} em sala de aula, estilo cartoon educativo brasileiro, cores vibrantes"</p>
              </div>
            </div>

            {/* PDI Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">♿</span>
                  <div>
                    <h3 className="text-xl font-bold">PDI - Plano de Desenvolvimento Individual</h3>
                    <p className="text-purple-100 text-sm">Adaptação inclusiva para alunos com necessidades especiais</p>
                  </div>
                </div>
                <button onClick={handleGerarPDI} disabled={gerandoPdi}
                  className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-md flex items-center gap-2">
                  {gerandoPdi ? '⏳ Gerando PDI...' : '♿ Gerar PDI Adaptado'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input type="text" value={pdiAluno} onChange={e => setPdiAluno(e.target.value)}
                  placeholder="Nome do aluno (opcional)"
                  className="border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white text-sm" />
                <input type="text" value={pdiNecessidades} onChange={e => setPdiNecessidades(e.target.value)}
                  placeholder="Necessidades: TEA, TDAH, dislexia, baixa visão..."
                  className="border border-white/30 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white text-sm" />
              </div>
              {plano.pdi && (
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm font-semibold mb-2">📋 PDI Gerado:</p>
                  <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">{plano.pdi}</p>
                  <button onClick={() => handleRegerar('pdi')} disabled={loadingSection === 'pdi'}
                    className="mt-3 flex items-center gap-1 text-xs px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
                    {loadingSection === 'pdi' ? '⏳...' : '🔄 Regerar PDI'}
                  </button>
                </div>
              )}
              {!plano.pdi && (
                <div className="bg-white/10 rounded-xl p-4 text-sm text-white/80">
                  <p className="font-medium mb-2">O PDI incluirá:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✅ Adaptação do conteúdo "{form.conteudo}" para as necessidades específicas</li>
                    <li>✅ Recursos visuais e cronogramas ilustrados</li>
                    <li>✅ Estratégias de comunicação alternativa e aumentativa</li>
                    <li>✅ Ênfase nas potencialidades individuais do aluno</li>
                    <li>✅ Objetivos funcionais e adaptados</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Compartilhar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={compartilharBiblioteca} onChange={e => setCompartilharBiblioteca(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <span className="font-semibold text-gray-800">📚 Compartilhar na Biblioteca Pública</span>
                  <p className="text-sm text-gray-500 mt-1">Ao marcar esta opção, seu plano ficará disponível para outros professores baixarem gratuitamente.</p>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSalvar} disabled={saving}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {saving ? 'Salvando...' : '💾 Salvar Planejamento'}
              </button>
              <button onClick={() => { setPlano(null); setError('') }}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition">
                🔄 Refazer Tudo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
