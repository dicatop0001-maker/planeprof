import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// ============================================================
// BANCO DE CONHECIMENTO EDUCACIONAL BRASILEIRO
// Conteúdos específicos, objetivos únicos e atividades variadas
// por disciplina, série e tema para nunca repetir
// ============================================================

// Habilidades BNCC reais por disciplina
const BNCC: Record<string, Record<string, string[]>> = {
  'Matematica': {
    'Infantil': ['EI03ET01','EI03ET02','EI03ET03','EI03ET04','EI03ET05'],
    'Fund1': ['EF01MA01','EF01MA02','EF01MA03','EF01MA04','EF01MA05','EF02MA01','EF02MA02','EF03MA01'],
    'Fund2': ['EF04MA01','EF04MA02','EF05MA01','EF05MA02','EF06MA01','EF06MA02','EF07MA01'],
    'Medio': ['EM13MAT101','EM13MAT102','EM13MAT201','EM13MAT301','EM13MAT401'],
  },
  'Lingua Portuguesa': {
    'Infantil': ['EI03EF01','EI03EF02','EI03EF03','EI03EF04','EI03EF05','EI03EF06'],
    'Fund1': ['EF01LP01','EF01LP02','EF01LP03','EF02LP01','EF02LP02','EF03LP01','EF03LP02'],
    'Fund2': ['EF04LP01','EF04LP02','EF05LP01','EF06LP01','EF06LP02','EF07LP01'],
    'Medio': ['EM13LP01','EM13LP02','EM13LP03','EM13LP10','EM13LP27'],
  },
  'Ciencias': {
    'Infantil': ['EI03ET04','EI03ET05','EI03ET06'],
    'Fund1': ['EF01CI01','EF01CI02','EF02CI01','EF02CI02','EF03CI01','EF03CI02'],
    'Fund2': ['EF04CI01','EF04CI02','EF05CI01','EF05CI02','EF06CI01','EF07CI01'],
    'Medio': ['EM13CNT101','EM13CNT102','EM13CNT201','EM13CNT301'],
  },
  'Historia': {
    'Infantil': ['EI03TS01','EI03TS02'],
    'Fund1': ['EF01HI01','EF01HI02','EF02HI01','EF03HI01'],
    'Fund2': ['EF04HI01','EF04HI02','EF05HI01','EF06HI01','EF07HI01'],
    'Medio': ['EM13CHS101','EM13CHS102','EM13CHS201','EM13CHS301'],
  },
  'Geografia': {
    'Infantil': ['EI03TS03','EI03TS04'],
    'Fund1': ['EF01GE01','EF01GE02','EF02GE01','EF03GE01'],
    'Fund2': ['EF04GE01','EF04GE02','EF05GE01','EF06GE01','EF07GE01'],
    'Medio': ['EM13CHS101','EM13CHS103','EM13CHS203','EM13CHS304'],
  },
  'Arte': {
    'Infantil': ['EI03CG01','EI03CG02','EI03CG03'],
    'Fund1': ['EF01AR01','EF01AR02','EF02AR01','EF03AR01'],
    'Fund2': ['EF04AR01','EF05AR01','EF06AR01','EF07AR01'],
    'Medio': ['EM13LGG101','EM13LGG102','EM13LGG201'],
  },
  'Educacao Fisica': {
    'Infantil': ['EI03CG04','EI03CG05'],
    'Fund1': ['EF01EF01','EF01EF02','EF02EF01','EF03EF01'],
    'Fund2': ['EF04EF01','EF05EF01','EF06EF01','EF07EF01'],
    'Medio': ['EM13LGG401','EM13LGG402','EM13LGG403'],
  },
}

function getBNCCparaDisc(disciplina: string, serie: string): string[] {
  const d = disciplina.replace(/[áàâã]/g,'a').replace(/[éê]/g,'e').replace(/[í]/g,'i').replace(/[óôõ]/g,'o').replace(/[ú]/g,'u')
  const key = Object.keys(BNCC).find(k => d.toLowerCase().includes(k.toLowerCase().split(' ')[0])) || 'Ciencias'
  const nivelSerie = serie.toLowerCase().match(/infantil|pré|berç|maternal/) ? 'Infantil'
    : serie.match(/[1-3].*ano|1.*fund|2.*fund|3.*fund/i) ? 'Fund1'
    : serie.match(/[4-9].*ano|fund.*[456789]/i) ? 'Fund2'
    : 'Medio'
  return (BNCC[key]?.[nivelSerie] || BNCC['Ciencias']['Fund1']).slice(0, 4)
}

// Gera objetivos ESPECÍFICOS para o conteúdo, não genéricos
function gerarObjetivosEspecificos(disciplina: string, serie: string, conteudo: string, num: number): string[] {
  const d = disciplina.toLowerCase()
  const c = conteudo.toLowerCase()
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal|berç/)
  const ehFundI = serie.match(/[1-5].*ano/i) && !serie.toLowerCase().includes('infantil')
  const ehMedio = serie.toLowerCase().match(/médio|medio|ens.*med/)

  // Verbos de Bloom adequados à série
  const verbosInfantil = ['Explorar','Reconhecer','Identificar','Nomear','Manipular','Criar','Expressar']
  const verbosFundI = ['Compreender','Identificar','Aplicar','Relacionar','Demonstrar','Descrever','Organizar']
  const verbosFundII = ['Analisar','Comparar','Classificar','Relacionar','Elaborar','Justificar','Avaliar']
  const verbosMedio = ['Analisar criticamente','Sintetizar','Avaliar','Propor','Fundamentar','Desenvolver','Interpretar']
  const verbos = ehInfantil ? verbosInfantil : ehMedio ? verbosMedio : ehFundI ? verbosFundI : verbosFundII

  // Contextos específicos de cada área
  const contextosMat = [
    `resolver problemas de ${c} usando materiais concretos e situações do cotidiano`,
    `representar e comunicar ideias matemáticas sobre ${c} de forma oral e escrita`,
    `estabelecer relações entre ${c} e outros campos da matemática`,
    `utilizar a linguagem matemática adequada para expressar ${c}`,
    `desenvolver raciocínio lógico a partir de situações envolvendo ${c}`,
  ]
  const contextosPort = [
    `produzir e interpretar textos relacionados a ${c}`,
    `ampliar o vocabulário e repertório linguístico por meio de ${c}`,
    `reconhecer convenções ortográficas e gramaticais em textos sobre ${c}`,
    `compreender a função social da linguagem ao trabalhar com ${c}`,
    `desenvolver fluência leitora e escrita através de ${c}`,
  ]
  const contextosGeralInfantil = [
    `${c} por meio de situações lúdicas e brincadeiras estruturadas`,
    `a relação entre ${c} e o mundo ao redor da criança`,
    `${c} através de exploração sensorial e manipulação de materiais`,
    `vocabulário específico de ${c} na interação com colegas e professora`,
    `curiosidade e interesse pelo tema ${c}`,
  ]
  const contextosGeral = [
    `os conceitos fundamentais de ${c} com clareza e precisão`,
    `a importância de ${c} no contexto social e histórico`,
    `${c} em situações práticas e interdisciplinares`,
    `a relação entre ${c} e outros conteúdos já estudados`,
    `o conhecimento de ${c} em produções escritas e orais`,
  ]

  let contextos: string[]
  if (d.match(/matem/)) contextos = contextosMat
  else if (d.match(/portugu|lingua/)) contextos = contextosPort
  else if (ehInfantil) contextos = contextosGeralInfantil
  else contextos = contextosGeral

  const objetivos: string[] = []
  for (let i = 0; i < Math.min(num, 5); i++) {
    objetivos.push(`${verbos[i % verbos.length]} ${contextos[i % contextos.length]}`)
  }
  return objetivos
}

// Gera desenvolvimento pedagógico DETALHADO e ÚNICO
function gerarDesenvolvimento(disciplina: string, serie: string, conteudo: string, numAulas: number, numAtividades: number, nivelAtividade: string, orientacoes: string): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal|berç/)
  const nivel = nivelAtividade === 'facil' ? 'simples, com suporte visual e concreto' : nivelAtividade === 'dificil' ? 'desafiador, com raciocínio elaborado' : 'adequado, progressivo em complexidade'
  const letra = 'letra de forma'

  // Variantes de abertura (Momento 1) por disciplina — rotação para evitar repetição
  const aberturasDisc: Record<string, string[]> = {
    'Matemática': [
      `Inicie com um desafio concreto: traga objetos ou situações do cotidiano ligados a **"${conteudo}"**. Pergunte: *"Como vocês resolveriam isso no dia a dia?"* Anote as estratégias no quadro. Valide o raciocínio intuitivo antes de formalizar.`,
      `Apresente um problema real e aberto sobre **"${conteudo}"**: sem dar a resposta, deixe os alunos tentarem resolver por diferentes caminhos. Registre as hipóteses no quadro e explore os erros como pontos de aprendizagem.`,
      `Comece com um jogo rápido ou atividade manipulativa relacionada a **"${conteudo}"**. Após a dinâmica, conduza uma roda de perguntas: *"O que perceberam? Que padrão apareceu?"* Construa o conceito a partir das observações dos próprios alunos.`,
    ],
    'Língua Portuguesa': [
      `Inicie com leitura compartilhada de um texto curto que exemplifique **"${conteudo}"**. Explore o contexto antes de definir: *"Onde aparece isso no texto? Para que serve?"* Crie um mapa conceitual colaborativo no quadro.`,
      `Apresente dois exemplos contrastantes de **"${conteudo}"** — um com e outro sem o recurso linguístico em foco. Conduza a descoberta: *"O que muda? O que fica melhor? Por quê?"* Construa a regra com as palavras dos alunos.`,
      `Inicie com produção oral espontânea: peça aos alunos que contem algo de seu cotidiano e, ao ouvir, identifique com eles onde aparece **"${conteudo}"** na fala. Transfira para a escrita de forma gradual e contextualizada.`,
    ],
    'Ciências': [
      `Apresente uma situação-problema ou fenômeno observável relacionado a **"${conteudo}"**. Levante hipóteses com a turma: *"Por que isso acontece? O que sabemos sobre isso?"* Registre as respostas para retomar ao final.`,
      `Inicie com um experimento simples de observação sobre **"${conteudo}"**. Guie os alunos no registro das observações antes de apresentar o conceito científico. Valorize a curiosidade e o método investigativo.`,
      `Comece com imagens, vídeo curto ou objeto real ligado a **"${conteudo}"**. Conduza uma chuva de ideias sobre o que já sabem e o que querem descobrir. Use as dúvidas dos alunos como fio condutor da aula.`,
    ],
    'História': [
      `Inicie com uma fonte histórica (imagem, documento ou relato) sobre o período/tema de **"${conteudo}"**. Conduza análise coletiva: *"Quem fez isso? Para quem? Em que contexto?"* Desenvolva o senso crítico antes de apresentar a narrativa.`,
      `Apresente o contexto histórico de **"${conteudo}"** por meio de comparação com o presente: *"Como era diferente de hoje? O que mudou? Por quê?"* Estimule a empatia histórica e a compreensão de temporalidade.`,
      `Comece com a perspectiva dos sujeitos históricos de **"${conteudo}"**: quem eram, o que queriam, o que enfrentavam. Use relatos, imagens ou dramatização curta. Humanize o conteúdo antes de situar na linha do tempo.`,
    ],
    'Geografia': [
      `Inicie mostrando o espaço geográfico relacionado a **"${conteudo}"** em diferentes escalas (local, regional, global). Pergunte: *"Isso existe perto da escola? No Brasil? No mundo?"* Construa a noção espacial antes da conceituação.`,
      `Apresente imagens de paisagens ou mapas ligados a **"${conteudo}"**. Conduza leitura cartográfica ou análise visual coletiva. Estimule a comparação entre realidades geográficas distintas.`,
      `Inicie conectando **"${conteudo}"** à realidade local dos alunos: rua, bairro, cidade. Expanda progressivamente para outras escalas. Valorize o conhecimento prévio e a experiência geográfica cotidiana.`,
    ],
  }

  // Variantes de Momento 2 — diferentes tipos de atividades práticas
  const variantesMomento2Infantil = [
    `**Atividade Lúdica Dirigida:** Proponha brincadeira, músicas ou movimento corporal explorando **"${conteudo}"**. Observe a participação, faça perguntas abertas durante a atividade e registre as descobertas das crianças.`,
    `**Exploração de Materiais:** Ofereça materiais concretos (massinha, blocos, materiais naturais) para que as crianças explorem aspectos de **"${conteudo}"** de forma autônoma. Circule fazendo mediações e valorizando cada descoberta.`,
    `**Arte e Expressão:** Proponha atividade de desenho, colagem ou construção livre conectada a **"${conteudo}"**. Conduza a criação com perguntas que aprofundem o pensamento: *"Como você vai mostrar isso? O que mais quer acrescentar?"*`,
  ]

  const variantesMomento2Fund = [
    `**Atividade Investigativa em Pares:** Em duplas, os alunos recebem situação-problema desafiadora sobre **"${conteudo}"** e registram em ${letra} a estratégia de resolução. Circulem pela sala mediando e fazendo perguntas que levem ao aprofundamento.`,
    `**Atividade por Estações:** Organize 3 estações temáticas sobre aspectos diferentes de **"${conteudo}"** (conceitual, aplicação, criativo). Grupos rodam pelas estações, garantindo diversidade de abordagem e ritmo individual de aprendizagem.`,
    `**Pesquisa Orientada e Síntese:** Alunos recebem material de pesquisa sobre **"${conteudo}"** (texto, infográfico ou vídeo), identificam informações-chave e produzem síntese própria em ${letra}. Compartilham e debatem as descobertas.`,
    `**Criação Colaborativa:** Em grupos, os alunos produzem material (cartaz, mapa mental, esquema ou texto informativo) sobre **"${conteudo}"**, articulando diferentes aspectos do conteúdo. Valorize a coautoria e a negociação de ideias.`,
  ]

  // Selecionar variantes por disciplina e rotação baseada no conteúdo
  const rotIdx = conteudo.length % 3
  const discKey = Object.keys(aberturasDisc).find(d => disciplina.toLowerCase().includes(d.toLowerCase())) || ''
  const aberturas = aberturasDisc[discKey] || [
    `Inicie com uma pergunta provocadora sobre **"${conteudo}"**: *"O que já sabem sobre isso? Onde encontram no cotidiano?"* Mapeie os conhecimentos prévios no quadro antes de aprofundar.`,
    `Apresente um caso real ou situação concreta relacionada a **"${conteudo}"**. Estimule a análise coletiva antes de apresentar conceitos. Valorize o raciocínio espontâneo da turma.`,
    `Inicie com recurso visual, musical ou manipulativo ligado a **"${conteudo}"**. Conduza uma exploração guiada por perguntas antes de sistematizar. Registre as percepções dos alunos no quadro.`,
  ]
  const abertura = aberturas[rotIdx % aberturas.length]

  const ativIdx = (conteudo.length + numAtividades) % (ehInfantil ? variantesMomento2Infantil.length : variantesMomento2Fund.length)
  const ativPrincipal = ehInfantil ? variantesMomento2Infantil[ativIdx] : variantesMomento2Fund[ativIdx]

  // Atividades adicionais baseadas no numAtividades
  const atividadesExtras = Array.from({length: Math.max(0, numAtividades - 1)}, (_, i) => {
    const tiposAtv = ehInfantil ? [
      `**Atividade Extra ${i+2} — Registro e Expressão:** As crianças registram por desenho ou escrita espontânea algo que aprenderam sobre **"${conteudo}"**. O professor anota falas significativas para o portfólio.`,
      `**Atividade Extra ${i+2} — Movimento e Corpo:** Brincadeira motora que incorpore elementos de **"${conteudo}"**, estimulando aprendizagem cinestésica e integração.`,
    ] : [
      `**Atividade Extra ${i+2} — Consolidação Individual:** Cada aluno resolve exercício de nível ${nivel} sobre **"${conteudo}"** de forma autônoma. O professor realiza avaliação formativa circulando pela sala.`,
      `**Atividade Extra ${i+2} — Conexão Interdisciplinar:** Proponha situação que articule **"${conteudo}"** com outra área do conhecimento. Estimule a transferência de aprendizagem e o pensamento integrado.`,
      `**Atividade Extra ${i+2} — Produção Autoral:** Os alunos criam registro original sobre **"${conteudo}"** em ${letra} (resumo, esquema, minilivro ou outro formato). Compartilham com a turma.`,
    ]
    return tiposAtv[i % tiposAtv.length]
  }).join('\n\n')

  const distribuicaoAulas = numAulas > 1
    ? `Este planejamento está organizado em **${numAulas} aulas** com continuidade progressiva:\n`
      + Array.from({length: numAulas}, (_, i) =>
          `\n**Aula ${i+1}:** ${i === 0 ? `Introdução e sensibilização para ${conteudo}` : i === numAulas-1 ? `Sistematização, avaliação e encerramento sobre ${conteudo}` : `Aprofundamento e prática de ${conteudo} — ativid`}`
      ).join('')
    : ''

  const recursos = disciplina === 'Matemática' ? `Materiais concretos (blocos, régua, calculadora), quadro branco, folhas para registro em ${letra}`
    : disciplina === 'Língua Portuguesa' ? `Textos de apoio, dicionário, quadro branco, caderno de produção em ${letra}`
    : disciplina === 'Ciências' ? `Materiais para experimento/observação, lupa (se disponível), quadro branco, caderno científico`
    : disciplina === 'História' ? `Fontes históricas (imagens, mapas, relatos), linha do tempo, quadro branco, caderno de registro`
    : disciplina === 'Geografia' ? `Mapas, imagens de paisagens, atlas, quadro branco, caderno de registro`
    : `Quadro branco, materiais específicos para ${disciplina}, caderno de registro em ${letra}`

  // Seção de orientações especiais com destaque visual
  const oriBlock = orientacoes
    ? `

---
**🎯 ORIENTAÇÕES ESPECIAIS DO PROFESSOR (aplicadas nesta aula):**
> ${orientacoes}

Com base nas orientações acima, adapte as atividades conforme necessário: ajuste o agrupamento dos alunos, diversifique os materiais de apoio, inclua recursos visuais ou adapte o nível de abstração para atender às necessidades específicas da turma.
---`
    : ''

  return `${distribuicaoAulas}**RECURSOS NECESSÁRIOS:** ${recursos}

**DESENVOLVIMENTO DA AULA:**

**Momento 1 — Sensibilização e Mobilização**
${abertura}
${ehInfantil ? '' : 'Anote as respostas e hipóteses no quadro — este registro será retomado na sistematização final para evidenciar o aprendizado.'}
${oriBlock ? oriBlock + '\n\n' : ''}
**Momento 2 — Desenvolvimento das Atividades**
${ativPrincipal}
${atividadesExtras ? '\n\n' + atividadesExtras : ''}

**Momento 3 — Roda Final e Sistematização**
${ehInfantil
  ? `Reúna as crianças em roda. Mostre as produções e pergunte: *"O que fizemos hoje? O que você descobriu sobre ${conteudo}?"* Faça a mediação das falas e fotografe os trabalhos para o portfólio. Comunique às famílias o que foi aprendido.`
  : `Retome o registro inicial do quadro. Pergunte: *"O que mudou no que vocês sabiam sobre ${conteudo}? O que ficou mais claro? O que ainda gera dúvida?"* Sistematize os conceitos-chave de forma clara e deixe visível para consulta futura. Proponha reflexão: *"Onde usaremos isso fora da escola?"*`}

**⏱️ TEMPO TOTAL DA AULA:** ${numAulas * 50} minutos (${numAulas} aula${numAulas > 1 ? 's' : ''} de 50 min cada)`
}
function gerarConclusao(disciplina: string, serie: string, conteudo: string): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
  return ehInfantil
    ? `**Encerramento:** Reuna as crianças em roda de conversa. Cada uma completa a frase: *"Hoje eu aprendi que ${conteudo}..."* O professor registra no diário de bordo com fotos das produções. Para as famílias: envie bilhete sugerindo que perguntem à criança o que ela aprendeu sobre ${conteudo} — o diálogo em casa fortalece a aprendizagem.
    
**Avaliação formativa:** Observe a participação, engajamento e vocabulário usado. Registre: quem demonstrou compreensão? Quem precisa de mais apoio? Que estratégia usar na próxima aula?`
    : `**Sistematização final:** Revise os pontos essenciais sobre ${conteudo} com a turma. Peça que cada aluno escreva, em suas próprias palavras, uma definição ou resumo de ${conteudo} — sem copiar do caderno, somente com o que internalizou.

**Conexão interdisciplinar:** Oriente os alunos a identificar onde ${conteudo} aparece em outras disciplinas ou no cotidiano deles. Isso fortalece a aprendizagem significativa.

**Avaliação:** Utilize rubrica simples: Compreendeu o conceito? Aplicou corretamente? Expressou com clareza? Registre para planejamento da próxima sequência didática.`
}

// Variante 2 da conclusão — abordagem por avaliação diagnóstica
function gerarConclusaoVariante2(disciplina: string, serie: string, conteudo: string): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
    return ehInfantil
        ? `**Roda de Encerramento:** Sente as crianças em círculo e mostre as produções do dia sobre ${conteudo}. Peça que cada criança escolha um "tesouro" — algo que ela criou ou aprendeu — e explique para o grupo. Fotografe os momentos para o portfólio. **Comunicação com a família:** Envie uma mensagem breve contando o que foi trabalhado sobre ${conteudo} e sugira uma conversa em casa: "Pergunte ao seu filho o que descobriu hoje!" **Registro docente:** Anote no diário quem participou ativamente, quem ficou mais tímido e o que chamou mais atenção nas falas das crianças.`
            : `**Fechamento estruturado:** Distribua um bilhete de saída (post-it ou ficha pequena) com 3 perguntas sobre ${conteudo}: 1) O que aprendi? 2) O que ainda tenho dúvida? 3) Onde posso usar isso? Os alunos respondem individualmente e entregam ao sair. **Uso diagnóstico:** Leia as respostas antes da próxima aula. Identifique lacunas e retome no início da aula seguinte os pontos que precisam de reforço sobre ${conteudo}. **Conexão com o projeto de vida:** Ajude os alunos a perceber como ${conteudo} se conecta com escolhas, profissões e situações do cotidiano.`
            }

            // Variante 3 da conclusão — abordagem por síntese criativa
            function gerarConclusaoVariante3(disciplina: string, serie: string, conteudo: string): string {
              const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
                return ehInfantil
                    ? `**Celebração da Aprendizagem:** Convide as crianças para uma "exposição relâmpago" — cada uma escolhe como mostrar o que aprendeu sobre ${conteudo}: com um desenho, uma fala, um gesto ou uma música inventada. O professor registra em vídeo curto (com autorização). **Encerramento afetivo:** Forme um círculo, dê as mãos e peça que cada criança diga uma palavra sobre como se sentiu aprendendo ${conteudo}. Termine com uma música ou cantiga do grupo. **Avaliação:** Observe critérios de desenvolvimento integral: linguagem, socialização, criatividade e relação com ${conteudo}.`
                        : `**Síntese visual:** Peça que cada aluno crie um "mapa mental" ou esquema visual de no máximo 1 página resumindo ${conteudo} com palavras-chave, setas e símbolos próprios — sem texto corrido. Compartilhem em grupos de 4. **Autoavaliação:** Cada aluno preenche: "Sei muito bem: ___ / Ainda preciso revisar: ___ / Quero aprender mais sobre: ___" (referente a ${conteudo}). **Próximos passos:** Com base nas autoavaliações, organize grupos de reforço e aprofundamento para a próxima sequência didática sobre ${conteudo}.`
                        }
                        
// Gera dinâmica EXCLUSIVA para o conteúdo específico
function gerarDinamica(disciplina: string, serie: string, conteudo: string): string {
  const d = disciplina.toLowerCase()
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
  const dinamicas = [
    {
      teste: () => true, // default
      gerar: () => ehInfantil
        ? `**Dinâmica: "Caixa Surpresa de ${conteudo}"**
📦 **Materiais:** Uma caixa decorada, objetos ou imagens sobre ${conteudo}
🎯 **Como jogar:** Coloque dentro da caixa itens relacionados a ${conteudo}. Cada criança enfia a mão (sem olhar) e descreve o que sentiu. Depois olha e confirma.
✨ **Aprendizado:** Estimula linguagem descritiva, vocabulário de ${conteudo} e curiosidade científica`
        : `**Dinâmica: "Quiz Rápido — ${conteudo}"**
🎯 **Como jogar:** Divida a turma em 3 grupos. O professor lê perguntas sobre ${conteudo} (fácil, médio, difícil). Cada equipe tem 30 segundos para discutir e responder. Cada acerto vale 1 ponto.
📋 **Exemplos de perguntas:** O que é ${conteudo}? Onde encontramos ${conteudo}? Como ${conteudo} se relaciona com nossa vida?
✨ **Aprendizado:** Revisão ativa, trabalho em equipe, oralidade`,
    },
  ]
  // Escolhe dinâmica baseada na disciplina
  if (d.match(/matem/)) {
    return ehInfantil
      ? `**Dinâmica: "Boliche Matemático com ${conteudo}"**
🎳 **Materiais:** 6 garrafas PET numeradas, bola pequena
🎯 **Como jogar:** Cada garrafa derrubada pede uma tarefa sobre ${conteudo} (ex: mostrar no ábaco, contar, representar). A turma ajuda a confirmar a resposta.
✨ **Aprendizado:** ${conteudo} de forma cinestésica e divertida`
      : `**Dinâmica: "Olimpíada de ${conteudo}"**
🏆 **Materiais:** Fichas com problemas sobre ${conteudo}, cronômetro
🎯 **Como jogar:** Equipes de 3 alunos. Cada rodada tem 1 problema de ${conteudo} para resolver em 2 minutos. A equipe que resolver corretamente primeiro marca ponto. 5 rodadas.
✨ **Aprendizado:** ${conteudo} com raciocínio ágil e colaboração`
  }
  if (d.match(/portugu|lingua/)) {
    return ehInfantil
      ? `**Dinâmica: "Caça às Letras de ${conteudo}"**
🔍 **Materiais:** Letras impressas espalhadas pela sala, fichas de palavras
🎯 **Como jogar:** O professor fala uma palavra de ${conteudo}. As crianças correm para encontrar as letras que formam essa palavra e montam no tapete.
✨ **Aprendizado:** Alfabetização contextualizada com ${conteudo}`
      : `**Dinâmica: "Telegrama de ${conteudo}"**
📨 **Materiais:** Papéis, canetas
🎯 **Como jogar:** Cada aluno tem 5 minutos para escrever um "telegrama" (máx 30 palavras) sobre ${conteudo} para um destinatário fictício. Depois leem em dupla e identificam: tem clareza? Informação suficiente?
✨ **Aprendizado:** Síntese, escrita objetiva, revisão de ${conteudo}`
  }
  return dinamicas[0].gerar()
}

// Gera PDI detalhado e específico
function gerarPdiLocal(disciplina: string, serie: string, conteudo: string, pdiAluno: string, pdiNecessidades: string): string {
  const nomeAluno = pdiAluno || '[Nome do aluno]'
  const nec = pdiNecessidades || 'necessidades específicas de aprendizagem'
  const adaptacoesEspecificas = nec.toLowerCase().match(/autis|tea/)
    ? ['Ambiente previsível com rotina visual clara','Minimizar estímulos sensoriais distratores','Usar interesses específicos do aluno como ponte para ' + conteudo,'Instruções curtas e diretas, uma de cada vez','Reforço positivo imediato e consistente']
    : nec.toLowerCase().match(/dislexia|dislex/)
    ? ['Texto com fonte ampliada (Arial 14), espaço duplo','Áudio dos enunciados das atividades de ' + conteudo,'Tempo extra e redução de quantidade (manter qualidade)','Usar cores diferentes para destacar palavras-chave de ' + conteudo,'Feedback oral além do escrito']
    : nec.toLowerCase().match(/tdah|deficit|atencao/)
    ? ['Atividades curtas sobre ' + conteudo + ' com pausas frequentes','Posicionar próximo ao professor durante explicações','Dar tarefas de movimento/manipulação sobre ' + conteudo,'Checklist visual das etapas da atividade','Sinal combinado entre professor e aluno para refoco']
    : ['Cartões visuais com imagens relacionadas a ' + conteudo,'Material manipulável concreto para cada etapa','Apoio de colega tutor durante as atividades','Avaliação por observação e portfólio','Redução de exigência quantitativa mantendo aprofundamento']

  return `**PDI - PLANO DE DESENVOLVIMENTO INDIVIDUAL**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 **Aluno(a):** ${nomeAluno}
📋 **Necessidades:** ${nec}
📚 **Disciplina:** ${disciplina} | **Turma:** ${serie}
📖 **Conteúdo adaptado:** ${conteudo}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🎯 OBJETIVOS FUNCIONAIS ADAPTADOS:**
• Participar das atividades sobre ${conteudo} com suporte visual e concreto
• Explorar os conceitos de ${conteudo} respeitando seu ritmo e estilo de aprendizagem
• Desenvolver autonomia progressiva nas tarefas sobre ${conteudo}
• Comunicar o que aprendeu sobre ${conteudo} de forma alternativa se necessário

**🛠️ ADAPTAÇÕES ESPECÍFICAS PARA ${nec.toUpperCase()}:**
${adaptacoesEspecificas.map(a => '• ' + a).join('\n')}

**🖼️ RECURSOS VISUAIS E TECNOLÓGICOS:**
• Cartões PECS com imagens de ${conteudo} para comunicação alternativa
• Cronograma visual ilustrado com etapas da aula sobre ${conteudo}
• Timer visual (ampulheta ou relógio colorido) para cada atividade
• Prancha de comunicação com símbolos do tema
• Ficha de atividade adaptada com fonte maior e menos itens por página

**👩‍🏫 ESTRATÉGIAS PEDAGÓGICAS INCLUSIVAS:**
• Modelagem: o professor demonstra antes de pedir que o aluno execute
• Instrução em pequenos passos sequenciais para cada tarefa de ${conteudo}
• Pareamento com colega tutor durante atividades em grupo
• Feedback imediato, específico e positivo: "Você identificou corretamente..."
• Generalização: transferir o aprendizado de ${conteudo} para outros contextos

**📊 AVALIAÇÃO ADAPTADA:**
• Portfólio: coleta de produções e registros fotográficos ao longo do período
• Observação participante com registro descritivo dos progressos
• Avaliação por engajamento, participação e tentativas, não só produto final
• Autoavaliação simplificada com imagens de expressões (😊😐😕)
• Reunião bimestral com família para alinhamento de estratégias

**📅 METAS DO BIMESTRE:**
1. Meta curto prazo: ${nomeAluno} participa de ao menos 70% das atividades sobre ${conteudo}
2. Meta médio prazo: demonstra compreensão de 2 conceitos centrais de ${conteudo}
3. Meta longo prazo: aplica conhecimentos de ${conteudo} em situação nova com suporte mínimo`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      disciplina, serie, bimestre, conteudo, orientacoes,
      numObjetivos, tipoLetra, numAulas, numAtividades, nivelAtividade,
      regenerar, gerarPdi, pdiAluno, pdiNecessidades,
      gerarAtividade, promptAtividade, habilidadesManuais, codigoManual
    } = body

    if (!disciplina || !serie || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios: disciplina, serie, conteudo' }, { status: 400 })
    }

    const nObj = parseInt(numObjetivos) || 3
    const nAulas = parseInt(numAulas) || 1
    const nAtiv = parseInt(numAtividades) || 2
    const nivel = nivelAtividade || 'medio'
    const letra = 'forma' // Sempre letra de forma (cursiva removida)

    // Modo PDI
    if (gerarPdi) {
      const pdiTexto = gerarPdiLocal(disciplina, serie, conteudo, pdiAluno || '', pdiNecessidades || '')
      return NextResponse.json({ success: true, plano: { pdi: pdiTexto }, fonte: 'local' })
    }

    // Modo Gerar Atividade Impressa
  if (gerarAtividade && promptAtividade) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.length < 20) {
      // Fallback local sem IA — 10 questoes com Bloom
      const tot = (parseInt(String(numAulas)) || 1) * 50
      const nvl = nivel === 'facil' ? 'Facil' : nivel === 'dificil' ? 'Dificil' : 'Medio'
      const cab = 'ATIVIDADE IMPRESSA — ' + (disciplina || 'DISCIPLINA').toUpperCase() + '\n' + (serie || 'Serie') + ' | Nivel: ' + nvl + ' | Tempo: ' + tot + ' min\n\nNome: __________________________ Turma: _____ Data: ___/___/______\n\nCONTEUDO: ' + conteudo + '\n' + '='.repeat(60)
      const ativ = cab + '\n\nINSTRUCOES: Responda com atencao e argumentos completos. Use letra de forma.\n\n1. Defina "' + conteudo + '" e explique sua importancia para ' + disciplina + ':\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n\n2. Quais sao as principais caracteristicas de "' + conteudo + '"?\n( ) A) So aspectos teoricos  ( ) B) Especificas que o diferenciam  ( ) C) So historicos  ( ) D) So abstratos\n\n3. De 2 exemplos de "' + conteudo + '" no cotidiano brasileiro:\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n\n4. Qual e a origem historica/cientifica de "' + conteudo + '"?\n' + '_'.repeat(60) + '\n\n5. "' + conteudo + '" tem aplicacao pratica. V ou F? Justifique:\n' + '_'.repeat(60) + '\n\n6. Compare "' + conteudo + '" com outro conceito da mesma area:\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n\n7. O que ocorreria sem "' + conteudo + '"? Desenvolva:\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n\n8. "Dominar ' + conteudo + ' e essencial." Voce concorda? Justifique:\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n\n9. Que profissoes usam "' + conteudo + '" na pratica?\n' + '_'.repeat(60) + '\n\n10. Sintese: 3 pontos mais importantes de "' + conteudo + '" e por que cada um e relevante:\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n' + '_'.repeat(60) + '\n\n' + '='.repeat(60) + '\nGABARITO: 1-pessoal | 2-B | 3-pessoal | 4-pessoal | 5-V+just | 6-pessoal | 7-pessoal | 8-pessoal | 9-pessoal | 10-pessoal\nTempo total: ' + tot + ' min'
      return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: ativ }, fonte: 'local' })
    }
    try {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({ apiKey })
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista pedagógico brasileiro com doutorado em Didática e domínio da BNCC. REGRAS: (1) Crie EXATAMENTE o número de questões pedido. (2) Cada questão menciona o conteúdo específico. (3) Taxonomia de Bloom aplicada à série. (4) Tipos variados. (5) Contexto brasileiro real. (6) Alinhamento explícito às habilidades BNCC. (7) Gabarito comentado ao final. JAMAIS crie questões genéricas.'
          },
          { role: 'user', content: promptAtividade }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      })
      const atividadeTexto = completion.choices[0].message.content || ''
      return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: atividadeTexto }, fonte: 'ia' })
    } catch (err: any) {
      console.error('[gerar-plano] Erro IA atividade:', err.message)
      return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: 'Erro ao gerar atividade sobre ' + conteudo }, fonte: 'local' })
    }
  }

    // Gera plano rico localmente
    const habilidadesBase = getBNCCparaDisc(disciplina, serie)
    const habilidadesExtras: string[] = [
      ...(Array.isArray(habilidadesManuais) ? habilidadesManuais : []),
      ...(codigoManual && typeof codigoManual === 'string' ? codigoManual.split(/[,\s]+/).map((c: string) => c.trim()).filter((c: string) => c.length > 0) : [])
    ]
    const habilidades = habilidadesExtras.length > 0 ? [...habilidadesExtras, ...habilidadesBase.filter((h: string) => !habilidadesExtras.includes(h))] : habilidadesBase
    const objetivos = gerarObjetivosEspecificos(disciplina, serie, conteudo, nObj)
    const desenvolvimento = gerarDesenvolvimento(disciplina, serie, conteudo, nAulas, nAtiv, nivel, orientacoes || '')
    const conclusao = gerarConclusao(disciplina, serie, conteudo)
    const dinamica = gerarDinamica(disciplina, serie, conteudo)

    const planoLocal = { habilidades_bncc: habilidades, objetivos, desenvolvimento, conclusao, dinamica: '' }

    // Modo regenerar seção específica
      // Modo regenerar seção específica - gera variação real a cada chamada
        if (regenerar) {
            const idx = Date.now() % 3 // 0, 1 ou 2 — rotaciona entre variantes
                const conclusaoVariantes = [
                      gerarConclusao(disciplina, serie, conteudo),
                            gerarConclusaoVariante2(disciplina, serie, conteudo),
                                  gerarConclusaoVariante3(disciplina, serie, conteudo),
                                      ]
                                          const desenvolvimentoNovo = gerarDesenvolvimento(disciplina, serie, conteudo, nAulas, nAtiv, nivel, orientacoes || '')
                                              const dinamicaNova = gerarDinamica(disciplina, serie, conteudo)
                                                  const objetivosNovos = gerarObjetivosEspecificos(disciplina, serie, conteudo, nObj)
                                                      const secoes: Record<string, string> = {
                                                            habilidades_bncc: habilidades.join(', '),
                                                                  objetivos: objetivosNovos.join('\n'),
                                                                        desenvolvimento: desenvolvimentoNovo,
                                                                              conclusao: conclusaoVariantes[idx],
                                                                                    dinamica: dinamicaNova,
                                                                                        }
                                                                                            return NextResponse.json({ success: true, plano: { [regenerar]: secoes[regenerar] || desenvolvimentoNovo }, fonte: 'local' })
                                                                                              }
    // Tenta enriquecer com OpenAI se disponível
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.length < 20) {
      return NextResponse.json({ success: true, plano: planoLocal, fonte: 'local' })
    }

    try {
      const OpenAI = (await import('openai')).default
      const openai = new OpenAI({ apiKey })
      const tipoLetraInstrucao = 'Atividades em letra de forma (padrão BNCC).'
      const nivelInstrucao = nivel === 'facil' ? 'atividades simples e acessíveis' : nivel === 'dificil' ? 'atividades desafiadoras e complexas' : 'atividades de nível médio progressivo'
      const prompt = `Você é um especialista em pedagogia brasileira e BNCC.
Crie um plano de aula RICO, ESPECÍFICO e DETALHADO com:
- Disciplina: ${disciplina} | Série: ${serie} | Bimestre: ${bimestre || '1'}°
- Conteúdo ESPECÍFICO: "${conteudo}"
- ${nObj} objetivos usando verbos de Bloom adequados à série
- ${nAulas} aula(s) com distribuição temporal clara
- ${nAtiv} atividades ${nivelInstrucao} — DIFERENTES entre si
- ${tipoLetraInstrucao}
${orientacoes ? '- Orientações do professor: ' + orientacoes : ''}

IMPORTANTE: Seja ESPECÍFICO sobre "${conteudo}" — não use frases genéricas. Mencione exemplos reais, situações concretas, materiais específicos para este conteúdo.

Retorne APENAS JSON válido:
{
  "habilidades_bncc": [${habilidades.map(h => '"' + h + '"').join(',')}],
  "objetivos": ["objetivo 1 específico","objetivo 2 específico"],
  "desenvolvimento": "Desenvolvimento detalhado com momentos, recursos e atividades específicas para ${conteudo}",
  "conclusao": "Como encerrar, avaliar e conectar ${conteudo} com a vida real",
  "dinamica": "Jogo ou dinâmica criativa e específica para ensinar ${conteudo}"
}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um pedagogo brasileiro especialista na BNCC (Base Nacional Comum Curricular). Seus planos de aula seguem RIGOROSAMENTE as diretrizes da BNCC, contemplando habilidades específicas, competências gerais, avaliação formativa e metodologias ativas. Responda APENAS com JSON válido, sem markdown, sem texto fora do JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 3000,
      })
      const responseText = completion.choices[0].message.content || '{}'
      let planoIA
      try {
        const cleaned = responseText.replace(/^```json\n?/, '').replace(/```$/, '').trim()
        planoIA = JSON.parse(cleaned)
        // Garante que tem todos os campos; usa local como fallback
        if (!planoIA.desenvolvimento) planoIA.desenvolvimento = desenvolvimento
        if (!planoIA.conclusao) planoIA.conclusao = conclusao
        planoIA.dinamica = ''
        if (!planoIA.objetivos?.length) planoIA.objetivos = objetivos
        if (!planoIA.habilidades_bncc?.length) planoIA.habilidades_bncc = habilidades
      } catch {
        planoIA = planoLocal
      }
      return NextResponse.json({ success: true, plano: planoIA, fonte: 'ia' })
    } catch (openaiError: any) {
      console.error('[gerar-plano] OpenAI erro:', openaiError.message)
      return NextResponse.json({ success: true, plano: planoLocal, fonte: 'local' })
    }
  } catch (error: any) {
    console.error('[gerar-plano] Erro geral:', error)
    return NextResponse.json({ error: 'Erro ao gerar plano: ' + error.message }, { status: 500 })
  }
}
