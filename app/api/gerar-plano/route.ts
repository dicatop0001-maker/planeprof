import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// ============================================================
// BANCO DE CONHECIMENTO EDUCACIONAL BRASILEIRO
// Conteúdos específicos, objetivos únicos e atividades variadas
// por disciplina, série e tema para nunca repetir
// ============================================================

// Habilidades BNCC reais por disciplina
const BNCC: Record<string, Record<string, string[]>> = {
  'Matemática': {
    'Infantil': ['EI03ET01','EI03ET02','EI03ET03','EI03ET04','EI03ET05'],
    'Fundo1': ['EF01MA01','EF01MA02','EF01MA03','EF01MA04','EF01MA05','EF02MA01','EF02MA02','EF03MA01'],
    'Fundo2': ['EF04MA01','EF04MA02','EF05MA01','EF05MA02','EF06MA01','EF06MA02','EF07MA01'],
    'Médio': ['EM13MAT101','EM13MAT102','EM13MAT201','EM13MAT301','EM13MAT401'],
  },
  'Lingua Portuguesa': {
    'Infantil': ['EI03EF01','EI03EF02','EI03EF03','EI03EF04','EI03EF05','EI03EF06'],
    'Fundo1': ['EF01LP01','EF01LP02','EF01LP03','EF02LP01','EF02LP02','EF03LP01','EF03LP02'],
    'Fundo2': ['EF04LP01','EF04LP02','EF05LP01','EF06LP01','EF06LP02','EF07LP01'],
    'Médio': ['EM13LP01','EM13LP02','EM13LP03','EM13LP10','EM13LP27'],
  },
  'Ciências': {
    'Infantil': ['EI03ET04','EI03ET05','EI03ET06'],
    'Fundo1': ['EF01CI01','EF01CI02','EF02CI01','EF02CI02','EF03CI01','EF03CI02'],
    'Fundo2': ['EF04CI01','EF04CI02','EF05CI01','EF05CI02','EF06CI01','EF07CI01'],
    'Médio': ['EM13CNT101','EM13CNT102','EM13CNT201','EM13CNT301'],
  },
  'História': {
    'Infantil': ['EI03TS01','EI03TS02'],
    'Fundo1': ['EF01HI01','EF01HI02','EF02HI01','EF03HI01'],
    'Fundo2': ['EF04HI01','EF04HI02','EF05HI01','EF06HI01','EF07HI01'],
    'Médio': ['EM13CHS101','EM13CHS102','EM13CHS201','EM13CHS301'],
  },
  'Geografia': {
    'Infantil': ['EI03TS03','EI03TS04'],
    'Fundo1': ['EF01GE01','EF01GE02','EF02GE01','EF03GE01'],
    'Fundo2': ['EF04GE01','EF04GE02','EF05GE01','EF06GE01','EF07GE01'],
    'Médio': ['EM13CHS101','EM13CHS103','EM13CHS203','EM13CHS304'],
  },
  'Arte': {
    'Infantil': ['EI03CG01','EI03CG02','EI03CG03'],
    'Fundo1': ['EF01AR01','EF01AR02','EF02AR01','EF03AR01'],
    'Fundo2': ['EF04AR01','EF05AR01','EF06AR01','EF07AR01'],
    'Médio': ['EM13LGG101','EM13LGG102','EM13LGG201'],
  },
  'Educação Física': {
    'Infantil': ['EI03CG04','EI03CG05'],
    'Fundo1': ['EF01EF01','EF01EF02','EF02EF01','EF03EF01'],
    'Fundo2': ['EF04EF01','EF05EF01','EF06EF01','EF07EF01'],
    'Médio': ['EM13LGG401','EM13LGG402','EM13LGG403'],
  },
}

função getBNCCparaDisc(disciplina: string, série: string): string[] {
  const d = disciplina.replace(/[áàâã]/g,'a').replace(/[éê]/g,'e').replace(/[í]/g,'i').replace(/[óôõ]/g,'o').replace(/[ú]/g,'u')
  const key = Object.keys(BNCC).find(k => d.toLowerCase().includes(k.toLowerCase().split(' ')[0])) || 'Ciencias'
  const nivelSerie = serie.toLowerCase().match(/infantil|pré|berç|maternal/) ? 'Infantil'
    : serie.match(/[1-3].*ano|1.*fund|2.*fund|3.*fund/i) ? 'Fund1'
    : serie.match(/[4-9].*ano|fund.*[456789]/i) ? 'Fundo2'
    : 'Médio'
  return (BNCC[chave]?.[nívelSerie] || BNCC['Ciências']['Fundo1']).slice(0, 4)
}

// Gera objetivos ESPECÍFICOS para o conteúdo, não genéricos
function gerarObjetivosEspecificos(disciplina: string, serie: string, conteudo: string, num: number): string[] {
  const d = disciplina.toLowerCase()
  const c=conteudo.toLowerCase()
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
    `desenvolver raciocínio lógico a partir de situações envolvidas ${c}`,
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
    `vocabulário específico de ${c} na interação com colega e professora`,
    `curiosidade e interesse pelo tema ${c}`,
  ]
  const contextosGeral = [
    `os conceitos fundamentais de ${c} com claro e precisão`,
    `a importância de ${c} no contexto social e histórico`,
    `${c} em situações práticas e interdisciplinares`,
    `a relação entre ${c} e outros conteúdos já treinados`,
    `o conhecimento de ${c} em produções escritas e orais`,
  ]

  let contextos: string[]
  se (d.match(/matem/)) contextos = contextosMat
  else if (d.match(/portugu|lingua/)) contextos = contextosPort
  else if (ehInfantil) contextos = contextosGeralInfantil
  else contextos = contextosGeral

  const objetivos: string[] = []
  para (seja i = 0; i < Math.min(num, 5); i++) {
    objetivos.push(`${verbos[i % verbos.length]} ${contextos[i % contextos.length]}`)
  }
  objetivos de retorno
}

// Gera desenvolvimento pedagógico DETALHADO e ÚNICO
function gerarDesenvolvimento(disciplina: string, série: string, conteúdo: string, numAulas: número, numAtividades: número, nivelAtividade: string, tipoLetra: string, orientações: string): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal|berç/)
  const nivel = nivelAtividade === 'facil' ? 'simples, com suporte visual e concreto' : nivelAtividade === 'dificil' ? 'desafiador, com cálculo elaborado' : 'adequado, progressivo em complexidade'
  const letra = tipoLetra === 'cursiva' ? 'letra cursiva' : 'letra de forma'
  const oriExtra = orientacoes ? `

**Orientações específicas do professor:** ${orientações}` : ''

  const distribuiçãoAulas = numAulas > 1
    ? `Este planejamento está organizado em **${numAulas} aulas** com continuidade progressiva:\n`
      + Array.from({length: numAulas}, (_, i) =>
          `\n**Aula ${i+1}:** ${i === 0 ? `Introdução e sensibilização para ${conteudo}` : i === numAulas-1 ? `Sistematização, avaliação e encerramento sobre ${conteudo}` : `Aprofundamento e prática de ${conteudo} — atividade ${i+1}`}`
        ).juntar('')
      + '\n\n'
    : ''

  const recursos = ehInfantil
    ? `materiais concretos (blocos, cartões, objetos do cotidiano), imagens coloridas, fantoche ou boneco, espaço no chão para exploração livre`
    : `quadro, materiais de escrita em ${letra}, fichas de atividade, imagens ilustrativas, material de apoio visual`

  const atividadesDesc = Array.from({comprimento: numAtividades}, (_, i) => {
    const tiposAtv = [
      `**Atividade ${i+1} — Exploração Inicial:** ${ehInfantil ? 'As crianças manuseavam materiais concretos relacionados a ' + conteudo + '. O professor observa e faz perguntas mediadoras: "O que você vê? O que isso te lembra?"' : 'Leitura e análise de texto/imagem de referência sobre ' + conteudo + '. Os alunos registram suas percepções iniciais em ' + letra + '.'}`,
      `**Atividade ${i+1} — Construção do Conhecimento:** ${ehInfantil ? 'Em pequenos grupos, as crianças criam representações sobre ' + conteúdo + ' usando recortes, massinha ou desenho.' : 'Em duplas, os alunos realizam tarefa estruturada de nível ' + nível + ' sobre ' + conteúdo + ', registrando respostas em ' + letra + '.'}`,
      `**Atividade ${i+1} — Aplicação Prática:** Os alunos resolvem situação-problema real envolvendo ${conteudo}. Nível: ${nível}. Cada aluno ${ehInfantil ? 'apresenta sua solução oralmente' : 'registra sua solução em ' + letra + ' e apresenta ao grupo'}.`,
      `**Atividade ${i+1} — Síntese e Consolidação:** ${ehInfantil ? 'Roda de conversa onde cada criança mostra o que fez e diz uma coisa que aprendeu sobre ' + conteudo + '.' : 'Cada aluno escreve em ' + letra + ' um parágrafo resumindo o que aprendeu sobre ' + conteudo + '. Compartilham com a turma.'}`,
      `**Atividade ${i+1} — Avaliação Formativa:** O professor propõe questão oral/escrita de nível ${nivel} sobre ${conteudo}. Registre as respostas para avaliação individual.`,
    ]
    retornar tiposAtv[i % tiposAtv.length]
  }).join('\n\n')

  return `${distribuicaoAulas}**RECURSOS NECESSÁRIOS:** ${recursos}

**DESENVOLVIMENTO DA AULA:**

**Momento 1 — Sensibilização e Mobilização (10-15 min)**
Comece com os alunos em roda. Apresente o tema **"${conteudo}"** com uma pergunta provocadora: *"${ehInfantil ? 'Quem já viu ou ouviu falar em ' + conteudo + '? Me conta!' : 'O que vocês já sabem sobre ' + conteudo + '? Como isso aparece na nossa vida?'}"*
Use imagens, vídeos curtos ou objetos específicos para criar interesse genuíno. Anote as respostas das crianças no quadro criando um mapa de conhecimentos prévios.

**Momento 2 — Desenvolvimento das Atividades (25-30 min)**
${atividadesDesc}

**Momento 3 — Roda Final e Sistematização (10 min)**
Retome as respostas do quadro inicial. Consulte: *"${ehInfantil ? 'O que aprender hoje sobre ' + conteúdo + '?' : 'O que mudou no que vocês sabiam sobre ' + conteudo + '?'}"*
Sistematize no quadro os conceitos-chave sobre ${conteudo}. Deixe visível para referência futura.${oriExtra}

**⏱️ TEMPO TOTAL DA AULA:** ${numAulas * 50} minutos (${numAulas} aula${numAulas > 1 ? 's' : ''} de 50 min cada)`
}

// Gera conclusão específica e reflexiva
função gerarConclusão(disciplina: string, série: string, conteúdo: string): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
  retornar ehInfantil
    ? `**Encerramento:** Reuna as crianças em roda de conversa. Cada uma completa a frase: *"Hoje eu aprendi que ${conteudo}..."* O professor registra no diário de bordo com fotos das produções. Para as famílias: envie um bilhete de verificação que perguntem à criança o que ela aprendeu sobre ${conteudo} — o diálogo em casa fortalece a aprendizagem.
    
**Avaliação formativa:** Observe a participação, engajamento e vocabulário usados. Cadastre-se: quem demonstrou compreensão? Quem precisa de mais apoio? Que estratégia usar na próxima aula?`
    : `**Sistematização final:** Revise os pontos essenciais sobre ${conteudo} com a turma. Peça que cada aluno escreva, em suas próprias palavras, uma definição ou resumo de ${conteudo} — sem copiar o caderno, somente com o que internalizou.

**Conexão interdisciplinar:** Oriente os alunos a identificar onde ${conteudo} aparece em outras disciplinas ou no cotidiano deles. Isso fortalece a aprendizagem significativa.

**Avaliação:** Utilize rubrica simples: Compreendeu o conceito? Aplicou corretamente? Expressou com clareza? Registre-se para planejamento da próxima sequência didática.`
}

// Variante 2 da conclusão — abordagem por avaliação diagnóstica
function gerarConclusaoVariante2(disciplina: string, serie: string, conteudo: string): string {
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
    retornar ehInfantil
        ? `**Roda de Encerramento:** Sente as crianças em círculo e mostre as produções do dia sobre ${conteudo}. Peça que cada criança escolha um "tesouro" — algo que ela criou ou aprendeu — e explique para o grupo. Fotografe os momentos para o portfólio. **Comunicação com a família:** Envie uma mensagem breve contando o que foi trabalhado sobre ${conteudo} e sugira uma conversa em casa: "Pergunte ao seu filho o que descobriu hoje!" **Registro docente:** Anote no diário quem participou, quem ficou mais tímido e o que chamou mais atenção nas falas das crianças.`
            : `**Fechamento estruturado:** Distribua um bilhete de saída (post-it ou ficha pequena) com 3 perguntas sobre ${conteudo}: 1) O que aprendeu? 2) O que ainda tenho dúvidas? 3) Onde posso usar isso? As aulas serão solicitadas individualmente e entregues ao sair. **Uso diagnóstico:** Leia as respostas antes da próxima aula. Identifique lacunas e retome no início da aula após os pontos que precisam de reforço sobre ${conteudo}. **Conexão com o projeto de vida:** Ajude os alunos a perceber como ${conteudo} se conecta com escolhas, profissões e situações do cotidiano.`
            }

            // Variante 3 da conclusão — abordagem por síntese criativa
            function gerarConclusaoVariante3(disciplina: string, serie: string, conteudo: string): string {
              const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
                retornar ehInfantil
                    ? `**Celebração da Aprendizagem:** Convide as crianças para uma "exposição relâmpago" — cada uma escolhe como mostrar o que aprendeu sobre ${conteudo}: com um desenho, uma fala, um gesto ou uma música inventada. O professor registre em vídeo curto (com autorização). **Encerramento afetivo:** Forme um círculo, dê as mãos e peça que cada criança diga uma palavra sobre como se sentiu aprendendo ${conteudo}. Termine com uma música ou cantiga do grupo. **Avaliação:** Observar critérios de desenvolvimento integral: linguagem, socialização, criatividade e relação com ${conteudo}.`
                        : `**Síntese visual:** Peça que cada aluno cria um "mapa mental" ou esquema visual de no máximo 1 página resumindo ${conteudo} com palavras-chave, setas e símbolos próprios — sem texto corrido. Compartilhem em grupos de 4. **Autoavaliação:** Cada aluno preenche: "Sei muito bem: ___ / Ainda preciso revisar: ___ / Quero aprender mais sobre: ​​___" (referente a ${conteudo}). **Próximos passos:** Com base nas autoavaliações, organize grupos de reforço e aprofundamento para a próxima sequência didática sobre ${conteudo}.`
                        }
                        
// Gera dinâmica EXCLUSIVA para o conteúdo específico
função gerarDinamica(disciplina: string, série: string, conteúdo: string): string {
  const d = disciplina.toLowerCase()
  const ehInfantil = serie.toLowerCase().match(/infantil|pré|maternal/)
  const dinamicas = [
    {
      teste: () => true, // padrão
      gerar: () => ehInfantil
        ? `**Dinâmica: "Caixa Surpresa de ${conteudo}"**
📦 **Materiais:** Uma caixa decorada, objetos ou imagens sobre ${conteudo}
🎯 **Como jogar:** Coloque dentro da caixa os itens relacionados a ${conteudo}. Cada criança enfia a mão (sem olhar) e descreve o que sente. Depois olha e confirma.
✨ **Aprendizado:** Estimula linguagem descritiva, vocabulário de ${conteudo} e curiosidade científica`
        : `**Dinâmica: "Quiz Rápido — ${conteudo}"**
🎯 **Como jogar:** Divida a turma em 3 grupos. O professor lê perguntas sobre ${conteudo} (fácil, médio, difícil). Cada equipe tem 30 segundos para discutir e responder. Cada acerto vale 1 ponto.
📋 **Exemplos de perguntas:** O que é ${conteudo}? Onde encontramos ${conteudo}? Como ${conteudo} está relacionado com nossa vida?
✨ **Aprendizado:** Revisão ativa, trabalho em equipe, oralidade`,
    },
  ]
  // Escolhe dinâmica baseada na disciplina
  se (d.match(/matem/)) {
    retornar ehInfantil
      ? `**Dinâmica: "Boliche Matemático com ${conteudo}"**
🎳 **Materiais:** 6 garrafas PET numeradas, bola pequena
🎯 **Como jogar:** Cada garrafa derrubada pede uma tarefa sobre ${conteudo} (ex: mostrar no ábaco, contar, representar). A turma ajuda a confirmar a resposta.
✨ **Aprendizado:** ${conteudo} de forma cinestésica e divertida`
      : `**Dinâmica: "Olimpíada de ${conteudo}"**
🏆 **Materiais:** Fichas com problemas sobre ${conteudo}, cronômetro
🎯 **Como jogar:** Equipes de 3 alunos. Cada rodada tem 1 problema de ${conteudo} para resolver em 2 minutos. A equipe que resolve corretamente primeiro marca ponto. 5 rodadas.
✨ **Aprendizado:** ${conteudo} com análise ágil e colaboração`
  }
  if (d.match(/portugu|língua/)) {
    retornar ehInfantil
      ? `**Dinâmica: "Caça às Letras de ${conteudo}"**
🔍 **Materiais:** Letras impressas espalhadas pela sala, fichas de palavras
🎯 **Como jogar:** O professor fala uma palavra de ${conteudo}. As crianças correm para encontrar as letras que formam essa palavra e montam no tapete.
✨ **Aprendizado:** Alfabetização contextualizada com ${conteudo}`
      : `**Dinâmica: "Telegrama de ${conteudo}"**
📨 **Materiais:** Papéis, canetas
🎯 **Como jogar:** Cada aluno tem 5 minutos para escrever um "telegrama" (máx 30 palavras) sobre ${conteudo} para um planejador fictício. Depois leem em dupla e identificam: tem claro? Informação suficiente?
✨ **Aprendizado:** Síntese, escrita objetiva, revisão de ${conteudo}`
  }
  retornar dinamicas[0].gerar()
}

// Gera PDI detalhada e específica
function gerarPdiLocal(disciplina: string, serie: string, conteudo: string, pdiAluno: string, pdiNecessidades: string): string {
  const nomeAluno = pdiAluno || '[Nome do aluno]'
  const nec = pdiNecessidades || 'necessidades específicas de aprendizagem'
  const adaptacoesEspecificas = nec.toLowerCase().match(/autis|tea/)
    ? ['Ambiente previsível com rotina visual clara','Minimizar estímulos sensoriais distratores','Usar interesses específicos do aluno como ponte para ' + conteúdo,'Instruções curtas e diretas, uma de cada vez','Reforço positivo imediato e consistente']
    : nec.toLowerCase().match(/dislexia|dislex/)
    ? ['Texto com fonte ampliada (Arial 14), espaço duplo','Áudio dos enunciados das atividades de ' + conteudo,'Tempo extra e redução de quantidade (manter qualidade)','Usar cores diferentes para destacar palavras-chave de ' + conteudo,'Feedback oral além do escrito']
    : nec.toLowerCase().match(/tdah|déficit|atencao/)
    ? ['Atividades curtas sobre ' + conteúdo + ' com pausas frequentes','Posicionar próximo ao professor durante explicação','Dar tarefas de movimento/manipulação sobre ' + conteúdo,'Checklist visual das etapas da atividade','Sinal combinado entre professor e aluno para refoco']
    : ['Cartões visuais com imagens relacionadas a ' + conteúdo,'Material manipulável concreto para cada etapa','Apoio de colega tutor durante as atividades','Avaliação por observação e portfólio','Redução de exigência quantitativa mantendo aprofundamento']

  retornar `**PDI - PLANO DE DESENVOLVIMENTO INDIVIDUAL**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 **Aluno(a):** ${nomeAluno}
📋 **Necessidades:** ${nec}
📚 **Disciplina:** ${disciplina} | **Turma:** ${série}
📖 **Conteúdo adaptado:** ${conteudo}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🎯 OBJETIVOS FUNCIONAIS ADAPTADOS:**
• Participe das atividades sobre ${conteudo} com suporte visual e concreto
• Explorar os conceitos de ${conteudo} respeitando seu ritmo e estilo de aprendizagem
• Desenvolver autonomia progressiva nas tarefas sobre ${conteudo}
• Comunicar o que aprendeu sobre ${conteudo} de forma alternativa se necessário

**🛠️ ADAPTAÇÕES ESPECÍFICAS PARA ${nec.toUpperCase()}:**
${adaptacoesEspecificas.map(a => '• ' + a).join('\n')}

**🖼️ RECURSOS VISUAIS E TECNOLÓGICOS:**
• Cartões PECS com imagens de ${conteudo} para comunicação alternativa
• Cronograma visual ilustrado com etapas da aula sobre ${conteudo}
• Cronômetro visual (ampulheta ou relógio colorido) para cada atividade
• Prancha de comunicação com símbolos do tema
• Ficha de atividade adaptada com fonte maior e menos itens por página

**👩‍🏫 ESTRATÉGIAS PEDAGÓGICAS INCLUSIVAS:**
• Modelagem: o professor demonstra antes de pedir que o aluno execute
• Instrução em pequenos passos sequenciais para cada tarefa de ${conteudo}
• Pareamento com colega tutor durante atividades em grupo
• Feedback imediato, específico e positivo: "Você acordou corretamente..."
• Generalização: transferir o aprendizado de ${conteudo} para outros contextos

**📊 AVALIAÇÃO ADAPTADA:**
• Portfólio: coleta de produções e registros fotográficos ao longo do período
• Observação participante com registro descritivo dos progressos
• Avaliação por engajamento, participação e esforço, não apenas produto final
• Autoavaliação simplificada com imagens de expressões (😊😐😕)
• Reunião bimestral com família para alinhamento de estratégias

**📅 METAS DO BIMESTRE:**
1. Meta curto prazo: ${nomeAluno} participe de ao menos 70% das atividades sobre ${conteudo}
2. Prazo médio médio: demonstrar compreensão de 2 conceitos centrais de ${conteudo}
3. Prazo meta longo: aplicar conhecimentos de ${conteudo} em situação nova com suporte mínimo`
}

export async function POST(request: NextRequest) {
  tentar {
    const body = await request.json()
    const {
      disciplina, série, bimestre, conteúdo, orientações,
      numObjetivos, tipoLetra, numAulas, numAtividades, nivelAtividade,
      regenerar, gerarPdi, pdiAluno, pdiNecessidades,
      gerarAtividade, promptAtividade
    } = corpo

    if (!disciplina || !série || !conteudo) {
      return NextResponse.json({erro: 'Campos obrigatórios: disciplina, série, conteúdo' }, { status: 400 })
    }

    const nObj = parseInt(numObjetivos) || 3
    const nAulas = parseInt(numAulas) || 1
    const nAtiv = parseInt(numAtividades) || 2
    const nível = nívelAtividade || 'médio'
    const letra = tipoLetra || 'forma'

    // Modo PDI
    se (gerarPdi) {
      const pdiTexto = gerarPdiLocal(disciplina, série, conteudo, pdiAluno || '', pdiNecessidades || '')
      retornar NextResponse.json({ sucesso: true, plano: { pdi: pdiTexto }, fonte: 'local' })
    }

    // Modo Gerar Atividade Impressa
if (gerarAtividade && promptAtividade) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.length < 20) {
    const tot = (parseInt(String(numAulas)) || 1) * 50
    const nvl = nivel === 'facil' ? 'Facil' : nivel === 'dificil' ? 'Dificil' : 'Medio'
    const d = (disciplina || '').toLowerCase()
    const cab = 'ATIVIDADE IMPRESSA — ' + (disciplina || 'DISCIPLINA').toUpperCase() + '\n' + (serie || 'Serie') + ' | Nivel: ' + nvl + ' | Tempo: ' + tot + ' min\n\nNome: __________________________ Turma: _____ Data: ___/___/______\n\nCONTEUDO: ' + conteudo + '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    const ativ = cab + '\n\nINSTRUCOES: Leia com atencao e responda de forma completa.\n\n1. Defina "' + conteudo + '" e explique sua importancia para ' + disciplina + ':\n______________________\n______________________\n\n2. Quais sao as principais caracteristicas de "' + conteudo + '"?\n( ) A) So aspectos teoricos  ( ) B) Caracteristicas que o diferenciam  ( ) C) So aspectos historicos  ( ) D) So aspectos abstratos\n\n3. De 2 exemplos concretos de "' + conteudo + '" no cotidiano brasileiro:\n______________________\n______________________\n\n4. Qual e a origem historica ou cientifica de "' + conteudo + '"?\n______________________\n______________________\n\n5. "' + conteudo + '" tem aplicacao na vida cotidiana. V ou F? Justifique:\n______________________\n\n6. Compare "' + conteudo + '" com outro conceito da mesma area (semelhancas e diferencas):\n______________________\n______________________\n\n7. O que ocorreria se "' + conteudo + '" nao existisse? Desenvolva com exemplos:\n______________________\n______________________\n\n8. "Dominar ' + conteudo + ' e essencial para o desenvolvimento profissional." Voce concorda? Justifique:\n______________________\n______________________\n\n9. Que profissoes fazem uso direto de "' + conteudo + '"? Como esse uso acontece na pratica?\n______________________\n\n10. Sintese: destaque os 3 pontos mais importantes de "' + conteudo + '" e explique por que cada um e relevante:\n______________________\n______________________\n______________________\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nGABARITO: 1-pessoal | 2-B | 3-pessoal | 4-pessoal | 5-V-pessoal | 6-pessoal | 7-pessoal | 8-pessoal | 9-pessoal | 10-pessoal\nTempo total: ' + tot + ' min'
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
          content: 'Voce e um especialista pedagogico brasileiro com doutorado em Didatica. REGRAS ABSOLUTAS: (1) Se o prompt pede 10 questoes, crie EXATAMENTE 10 numeradas — nunca menos. (2) Cada questao menciona o conteudo especifico pelo nome — PROIBIDO genericas. (3) Taxonomia de Bloom. (4) Tipos variados: multipla escolha (4 alternativas), dissertativa, V/F com justificativa, situacao-problema. (5) Contexto brasileiro. (6) Gabarito comentado completo ao final.'
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
    const tot2 = (parseInt(String(numAulas)) || 1) * 50
    return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: 'Erro ao gerar atividade sobre ' + conteudo + '. Tempo: ' + tot2 + ' min' }, fonte: 'local' })
  }
}

// Gera plano rico localmente
    const habilidades = getBNCCparaDisc(disciplina, série)
    const objetivos = gerarObjetivosEspecificos(disciplina, serie, conteudo, nObj)
    const desenvolvimento = gerarDesenvolvimento(disciplina, série, conteúdo, nAulas, nAtiv, nível, letra, orientações || '')
    const conclusão = gerarConclusão(disciplina, série, conteúdo)
    const dinâmica = gerarDinamica(disciplina, série, conteudo)

    const planoLocal = { habilidades_bncc: habilidades, objetivos, desenvolvimento, conclusão, dinâmica: '' }

    // Modo regenerar seção específica
      // Modo regenerar seção específica - gera variação real a cada chamada
        se (regenerar) {
            const idx = Date.now() % 3 // 0, 1 ou 2 — rotação entre variantes
                const conclusaoVariantes = [
                      gerarConclusão(disciplina, série, conteúdo),
                            gerarConclusãoVariante2(disciplina, série, conteudo),
                                  gerarConclusãoVariante3(disciplina, série, conteudo),
                                      ]
                                          const desenvolvimentoNovo = gerarDesenvolvimento(disciplina, série, conteúdo, nAulas, nAtiv, nível, letra, orientações || '')
                                              const dinamicaNova = gerarDinamica(disciplina, serie, conteudo)
                                                  const objetivosNovos = gerarObjetivosEspecíficos(disciplina, série, conteúdo, nObj)
                                                      const secos: Record<string, string> = {
                                                            habilidades_bncc: habilidades.join(', '),
                                                                  objetivos: objetivosNovos.join('\n'),
                                                                        desenvolvimento: desenvolvimentoNovo,
                                                                              conclusão: conclusãoVariantes[idx],
                                                                                    dinamica: dinamicaNova,
                                                                                        }
                                                                                            return NextResponse.json({ sucesso: true, plano: { [regenerar]: secoes[regenerar] || desenvolvimentoNovo }, fonte: 'local' })
                                                                                              }
    // Tenta enriquecer com OpenAI se estiver disponível
    const apiKey = process.env.OPENAI_API_KEY
    se (!apiKey || apiKey.length < 20) {
      retornar NextResponse.json({ sucesso: true, plano: planoLocal, fonte: 'local' })
    }

    tentar {
      const OpenAI = (await import('openai')).default
      const openai = novo OpenAI({apiKey})
      const tipoLetraInstrucao = letra === 'cursiva' ? 'Atividades em letra cursiva.' : 'Atividades em letra de forma.'
      const nivelInstrucao = nivel === 'facil' ? 'atividades simples e acessíveis' : nivel === 'dificil' ? 'atividades desafiadoras e complexas' : 'atividades de nível médio progressivo'
      const prompt = `Você é um especialista em pedagogia brasileira e BNCC.
Crie um plano de aula RICO, ESPECÍFICO e DETALHADO com:
- Disciplina: ${disciplina} | Série: ${série} | Bimestre: ${bimestre || '1'}°
- Conteúdo ESPECÍFICO: "${conteudo}"
- ${nObj} objetivos usando verbos de Bloom adequados para série
- ${nAulas} aula(s) com distribuição temporal clara
- ${nAtiv} atividades ${nivelInstrucao} — DIFERENTES entre si
- ${tipoLetraInstrucao}
${orientações ? '- Orientações do professor: ' + orientações : ''}

IMPORTANTE: Seja ESPECÍFICO sobre "${conteudo}" — não use frases genéricas. Mencione exemplos reais, situações concretas, materiais específicos para este conteúdo.

Retorne APENAS JSON válido:
{
  "habilidades_bncc": [${habilidades.map(h => '"' + h + '"').join(',')}],
  "objetivos": ["objetivo 1 específico","objetivo 2 específico"],
  "desenvolvimento": "Desenvolvimento detalhado com momentos, recursos e atividades específicas para ${conteudo}",
  "conclusao": "Como garantir, avaliar e conectar ${conteudo} com a vida real",
  "dinamica": "Jogo ou dinâmica criativa e específica para ensinar ${conteudo}"
}`

      const completion = await openai.chat.completions.create({
        modelo: 'gpt-4o',
        mensagens: [
          { função: 'sistema', conteúdo: 'Pedagogo brasileiro especialista em BNCC. Responda APENAS com JSON válido, sem markdown.' },
          { role: 'user', content: prompt }
        ],
        temperatura: 0,8,
        max_tokens: 3000,
      })
      const responseText = completion.choices[0].message.content || '{}'
      deixe planoIA
      tentar {
        const cleaned = responseText.replace(/^```json\n?/, '').replace(/```$/, '').trim()
        planoIA = JSON.parse(limpo)
        // Garantir que todos os campos tenham; EUA local como substituto
        if (!planoIA.desenvolvimento) planoIA.desenvolvimento = desenvolvimento
        if (!planoIA.conclusao) planoIA.conclusao = conclusão
        planoIA.dinamica = ''
        if (!planoIA.objetivos?.length) planoIA.objetivos = objetivos
        if (!planoIA.habilidades_bncc?.length) planoIA.habilidades_bncc = habilidades
      } pegar {
        planoIA = planoLocal
      }
      return NextResponse.json({ sucesso: verdadeiro, plano: planoIA, fonte: 'ia' })
    } catch (openaiError: any) {
      console.error('[gerar plano] erro OpenAI:', openaiError.message)
      retornar NextResponse.json({ sucesso: true, plano: planoLocal, fonte: 'local' })
    }
  } catch (error: any) {
    console.error('[gerar-plano] Erro geral:', erro)
    return NextResponse.json({ error: 'Erro ao gerar plano: ' + error.message }, { status: 500 })
  }
}
