
// Fallback local rico de atividade impressa — por disciplina
function gerarAtividadeLocalRica(disciplina: string, serie: string, conteudo: string, nivel: string, numAulas: string | number): string {
  const d = (disciplina || '').toLowerCase()
  const ehInfantil = (serie || '').toLowerCase().match(/infantil|pre|berç|maternal/)
  const nAulas = parseInt(String(numAulas)) || 1
  const totalMin = nAulas * 50
  const nivelLabel = nivel === 'facil' ? 'Facil' : nivel === 'dificil' ? 'Dificil' : 'Medio'

  const cabecalho = `ATIVIDADE IMPRESSA — ${disciplina?.toUpperCase() || 'DISCIPLINA'}
${serie || 'Série'} | Nivel: ${nivelLabel} | Tempo total: ${totalMin} minutos

Nome: _________________________________________________ Turma: _______ Data: ___/___/______

CONTEÚDO: ${conteudo}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  if (ehInfantil) {
    return `${cabecalho}

INSTRUCOES: Leia com sua professora. Faca com capricho!

1. DESENHE o que voce sabe sobre "${conteudo}":

[Espaco para desenho]

2. CIRCULE todos os objetos que tem a ver com "${conteudo}":
(Imagens seriam inseridas aqui pelo professor)

3. COMPLETE a frase:
Eu aprendi que ${conteudo} e __________________________________________

4. PINTE com sua cor favorita o que representa ${conteudo}:
(Ilustracao seria inserida aqui)

5. FALE para um colega: o que e ${conteudo}? O que voce aprendeu?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARABENS! Voce completou a atividade sobre ${conteudo}!
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
  }

  // Banco de questoes por disciplina
  if (d.match(/matem/)) {
    return `${cabecalho}

INSTRUCOES: Leia com atencao. Mostre todos os calculos nas questoes dissertativas. Boa sorte!

1. (Memorizar) Qual e o resultado de: 15 × 8 - 40 ÷ 5?
A) 112    B) 120    C) 128    D) 136

2. (Compreender) Explique com suas palavras o que significa "${conteudo}" e como ele e utilizado em situacoes do dia a dia. De um exemplo concreto.
___________________________________________
___________________________________________
___________________________________________

3. (Aplicar) Uma turma de 32 alunos foi dividida em grupos iguais para estudar sobre ${conteudo}. Se cada grupo ficou com 8 alunos, quantos grupos foram formados? Mostre a operacao.
___________________________________________
___________________________________________

4. (Analisar) Leia as afirmacoes abaixo e marque V (Verdadeiro) ou F (Falso). Justifique as falsas:
( ) Em ${conteudo}, a ordem dos fatores sempre altera o resultado
( ) Podemos verificar uma conta de ${conteudo} fazendo a operacao inversa
( ) ${conteudo} nao tem aplicacao no cotidiano
Justificativa: ___________________________________________

5. (Aplicar) Maria foi ao mercado com R$ 50,00. Comprou 3 cadernos a R$ 8,50 cada e uma mochila. Se recebeu R$ 1,50 de troco, qual foi o preco da mochila?
___________________________________________
___________________________________________

6. (Analisar) Qual das alternativas representa CORRETAMENTE uma propriedade relacionada a ${conteudo}?
A) A comutatividade indica que a ordem dos termos nao importa no resultado
B) A associatividade e exclusiva da multiplicacao
C) O elemento neutro da adicao e o numero 1
D) A distributividade se aplica apenas a subtracao

7. (Aplicar - Problema Real) Uma escola tem 480 alunos distribuídos em turmas de ${conteudo}. Se cada turma tem 30 alunos, quantas turmas ha? Se uma nova turma for aberta com 25 alunos, qual sera o novo total?
___________________________________________
___________________________________________
___________________________________________

8. (Avaliar) Um colega resolveu a questao abaixo e chegou a um resultado errado. Identifique o erro e corrija:
Problema: 24 ÷ 4 + 2 × 3 = ?
Resposta do colega: 24 ÷ (4 + 2) × 3 = 12
Corrija: ___________________________________________

9. (Sintetizar) Crie voce mesmo um problema matematico envolvendo ${conteudo} que um colega de turma poderia resolver. Escreva o enunciado e a resposta.
Enunciado: ___________________________________________
___________________________________________
Resposta: ___________________________________________

10. (Avaliar) Explique por que e importante aprender sobre ${conteudo} na sua serie. Cite pelo menos dois exemplos de situacoes reais onde esse conhecimento e necessario.
___________________________________________
___________________________________________
___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GABARITO: 1-A | 2-Resposta pessoal | 3-4 grupos | 4-V, V, F (tem aplicacao no cotidiano) | 5-R$23,50 | 6-A | 7-16 turmas, 505 alunos | 8-Erro na ordem das operacoes: 24÷4=6, 6+2×3=6+6=12 (correto e 12 mas pelo motivo errado); correto: 6+6=12 | 9-Criacao livre | 10-Resposta pessoal
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
  }

  if (d.match(/portugu|lingua/)) {
    return `${cabecalho}

INSTRUCOES: Leia cada questao com atencao. Responda de forma completa e com letra legivel.

1. (Memorizar) Qual alternativa apresenta a palavra grafada CORRETAMENTE conforme a ortografia oficial da lingua portuguesa?
A) Excessao    B) Excecao    C) Excecao    D) Exceção

2. (Compreender) Leia o trecho abaixo e responda: qual e a ideia principal do texto e o que o autor quis comunicar ao leitor? Justifique com informacoes do proprio texto.
[Texto sobre ${conteudo} seria inserido aqui pelo professor]
___________________________________________
___________________________________________
___________________________________________

3. (Aplicar) Reescreva a frase a seguir transformando o verbo da VOZ ATIVA para a VOZ PASSIVA, mantendo o sentido original:
"Os alunos estudaram ${conteudo} com muito interesse."
___________________________________________
___________________________________________

4. (Analisar) Identifique e classifique as oracoes do periodo abaixo, explicando a relacao de sentido entre elas:
"Embora ${conteudo} seja desafiador, os alunos que se dedicam conseguem aprender muito bem."
___________________________________________
___________________________________________
___________________________________________

5. (Aplicar) Qual figura de linguagem esta presente na frase: "${conteudo} e uma luz que ilumina o caminho do aprendizado"?
A) Metonimia    B) Hiperbole    C) Metafora    D) Ironia

6. (Analisar - Gramatica) Analise o periodo: "Os professores que dominam ${conteudo} ensinam com mais seguranca." Identifique: sujeito, predicado e o tipo de sujeito.
___________________________________________
___________________________________________

7. (Avaliar) Leia as duas afirmacoes e avalie qual e mais correta sobre ${conteudo}, justificando sua escolha com argumentos:
A) "${conteudo} e importante apenas para quem quer ser escritor"
B) "${conteudo} desenvolve a capacidade de comunicacao e pensamento critico de todos"
Justificativa: ___________________________________________
___________________________________________

8. (Aplicar) Complete as lacunas com a forma verbal correta do verbo indicado:
a) Os alunos __________ (aprender - futuro do subjuntivo) ${conteudo} rapidamente.
b) Se eu __________ (estudar - imperfeito do subjuntivo) mais, teria aprendido melhor.
c) E preciso que voce __________ (compreender - presente do subjuntivo) ${conteudo}.

9. (Criar) Escreva um paragrafo argumentativo de 5 a 8 linhas defendendo a importancia de ${conteudo} para a vida dos estudantes. Use pelo menos um dado ou exemplo concreto.
___________________________________________
___________________________________________
___________________________________________
___________________________________________

10. (Avaliar - Producao) Qual das alternativas apresenta o paragrafo mais bem escrito segundo as normas da lingua culta e com argumento mais consistente sobre ${conteudo}?
A) "O conteudo e bom. Todos devem aprender. E muito importante."
B) "O estudo de ${conteudo} contribui significativamente para o desenvolvimento da competencia comunicativa dos alunos, preparando-os para diferentes situacoes sociais."
C) "Eu acho que ${conteudo} e legal porque a professora fala que e importante."
D) "Nao sei muito sobre ${conteudo} mas deve ser importante porque esta no curriculo."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GABARITO: 1-D | 2-Resposta pessoal | 3-${conteudo} foi estudado com muito interesse pelos alunos | 4-Oracao subordinada adverbial concessiva + oracao principal | 5-C | 6-Sujeito: "Os professores que dominam ${conteudo}" (simples, com oração adjetiva); Predicado: "ensinam com mais segurança" | 7-B com justificativa | 8-aprenderem, estudasse, compreenda | 9-Producao livre | 10-B
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
  }

  if (d.match(/histor/)) {
    return `${cabecalho}

INSTRUCOES: Responda com base no que estudou. Questoes dissertativas exigem argumentos e nao apenas citacao de datas.

1. (Memorizar) Qual evento historico diretamente relacionado a ${conteudo} ocorreu no Brasil durante o seculo XIX?
A) Proclamacao da Republica (1889)
B) Descobrimento do Brasil (1500)
C) Construcao de Brasilia (1960)
D) Criacao do Mercosul (1991)

2. (Compreender) Explique com suas palavras o que foi ${conteudo} e quais foram suas principais causas. Por que esse evento ou tema e estudado hoje?
___________________________________________
___________________________________________
___________________________________________
___________________________________________

3. (Analisar) Compare o contexto historico de ${conteudo} com algum evento atual ou recente. Quais semelhancas e diferencas voce identifica?
___________________________________________
___________________________________________
___________________________________________

4. (Aplicar) Qual das alternativas apresenta a CONSEQUENCIA mais importante de ${conteudo} para o Brasil?
A) Nao trouxe nenhuma mudanca significativa para a sociedade brasileira
B) Gerou transformacoes economicas, sociais ou politicas que influenciam o Brasil ate hoje
C) Foi um evento isolado que nao se relaciona com outros fatos historicos
D) Teve impacto apenas nas regioes Sul e Sudeste do pais

5. (Analisar) Julgue V (Verdadeiro) ou F (Falso) e justifique as afirmacoes incorretas:
( ) ${conteudo} aconteceu num contexto de transformacoes sociais e politicas mais amplas
( ) Os grupos sociais foram afetados igualmente por ${conteudo}
( ) E possivel compreender ${conteudo} sem analisar as causas que o geraram
Justificativas: ___________________________________________

6. (Avaliar) Por que historiadores divergem na interpretacao de ${conteudo}? Que fontes historicas voce usaria para pesquisar esse tema?
___________________________________________
___________________________________________
___________________________________________

7. (Sintetizar) Crie uma linha do tempo com pelo menos 4 eventos relacionados a ${conteudo}, em ordem cronologica, com uma frase explicativa para cada um.
___________________________________________
___________________________________________
___________________________________________
___________________________________________

8. (Aplicar) Imagine que voce e um jornalista da epoca de ${conteudo}. Escreva uma manchete de jornal e um paragrafo de 4 linhas noticiando o fato principal.
Manchete: ___________________________________________
Noticia: ___________________________________________
___________________________________________
___________________________________________

9. (Analisar) Quais grupos sociais foram beneficiados e quais foram prejudicados por ${conteudo}? Justifique com informacoes historicas.
Beneficiados: ___________________________________________
Prejudicados: ___________________________________________

10. (Avaliar - Reflexao Final) Qual a relevancia de estudar ${conteudo} nos dias atuais? Como esse conhecimento contribui para a formacao de cidadaos criticos?
___________________________________________
___________________________________________
___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GABARITO: 1-A | 2-Resposta pessoal argumentada | 3-Resposta pessoal comparativa | 4-B | 5-V, F (grupos foram afetados diferentemente), F (causas sao essenciais) | 6-Resposta pessoal | 7-Criacao livre cronologica | 8-Criacao jornalistica | 9-Analise social critica | 10-Reflexao cidada
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
  }

  if (d.match(/cienc|biolog|fisic|quim/)) {
    return `${cabecalho}

INSTRUCOES: Responda com base no metodo cientifico. Observe, formule hipoteses e justifique suas respostas.

1. (Memorizar) Qual e o conceito correto de ${conteudo} segundo as Ciencias?
A) Um fenomeno que ocorre apenas em laboratorios controlados
B) Um processo natural que pode ser observado, descrito e explicado cientificamente
C) Uma teoria ainda nao comprovada pelos cientistas
D) Um conceito exclusivo da quimica sem relacao com biologia ou fisica

2. (Compreender) Explique o que e ${conteudo}, quais sao seus principais componentes ou etapas e por que ele e importante para os seres vivos ou para o planeta.
___________________________________________
___________________________________________
___________________________________________

3. (Aplicar - Experimento) Descreva como voce montaria um experimento simples para observar ${conteudo}. Inclua: materiais, procedimento, hipotese e resultado esperado.
Materiais: ___________________________________________
Procedimento: ___________________________________________
Hipotese: ___________________________________________
Resultado esperado: ___________________________________________

4. (Analisar) Qual das alternativas apresenta a relacao CORRETA entre ${conteudo} e o cotidiano?
A) ${conteudo} nao tem nenhuma relacao com a vida das pessoas comuns
B) ${conteudo} esta presente em processos que utilizamos ou observamos diariamente
C) Apenas cientistas precisam conhecer ${conteudo}
D) ${conteudo} e um conceito abstrato sem aplicacao pratica

5. (Analisar) Julgue V ou F e corrija as afirmacoes falsas:
( ) ${conteudo} pode ser explicado por leis ou principios cientificos
( ) O estudo de ${conteudo} nao contribui para a preservacao ambiental
( ) Tecnologias modernas sao desenvolvidas com base em conhecimentos sobre ${conteudo}

6. (Aplicar) Descreva uma situacao-problema real relacionada a ${conteudo} que afeta comunidades brasileiras. Como o conhecimento cientifico pode ajudar a resolver esse problema?
___________________________________________
___________________________________________
___________________________________________

7. (Avaliar) Dois cientistas divergem sobre ${conteudo}: um defende que e prejudicial ao ambiente, outro diz que e benefico. Que evidencias voce buscaria para formar sua propria opiniao?
___________________________________________
___________________________________________

8. (Sintetizar) Crie um esquema visual (descrito por escrito) mostrando as relacoes entre ${conteudo} e pelo menos tres outros conceitos cientificos que voce conhece.
___________________________________________
___________________________________________
___________________________________________

9. (Aplicar) Calcule ou estime: se ${conteudo} aumenta em 15% por decada, qual sera seu valor em 30 anos se hoje e de 200 unidades? Mostre o raciocinio.
___________________________________________
___________________________________________

10. (Avaliar - Reflexao) Como o conhecimento sobre ${conteudo} pode influenciar decisoes politicas e economicas no Brasil? Cite um exemplo concreto.
___________________________________________
___________________________________________
___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GABARITO: 1-B | 2-Resposta cientifica fundamentada | 3-Experimento descrito | 4-B | 5-V, F (contribui para preservacao), V | 6-Situacao-problema real | 7-Busca de evidencias | 8-Mapa conceitual | 9-200 × 1,15^3 ≈ 304 unidades | 10-Reflexao socioambiental
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
  }

  if (d.match(/geograf/)) {
    return `${cabecalho}

INSTRUCOES: Responda considerando o espaco geografico brasileiro e mundial. Use dados e exemplos reais.

1. (Memorizar) Qual e a melhor definicao de ${conteudo} dentro do contexto da Geografia?
A) Um fenomeno natural que ocorre exclusivamente em regioes tropicais
B) Um conceito geografico que analisa as relacoes entre sociedade, espaco e natureza
C) Uma teoria geografica aplicada apenas em paises desenvolvidos
D) Um processo que ocorre somente em areas urbanas do Brasil

2. (Compreender) Explique o que e ${conteudo} e como ele se manifesta no territorio brasileiro. Cite pelo menos duas regioes onde seus efeitos sao mais visiveis.
___________________________________________
___________________________________________
___________________________________________

3. (Aplicar) Analise o mapa mental abaixo sobre ${conteudo} e responda: quais sao as tres principais causas e tres consequencias desse fenomeno?
Causas: ___________________________________________
Consequencias: ___________________________________________

4. (Analisar) Qual alternativa descreve CORRETAMENTE o impacto de ${conteudo} na vida das populacoes brasileiras?
A) Afeta apenas as populacoes rurais, sem impacto nas cidades
B) Gera transformacoes economicas, sociais e ambientais que afetam diferentes grupos
C) Nao tem relacao com as desigualdades sociais brasileiras
D) E um fenomeno positivo que sempre melhora a qualidade de vida

5. (Analisar) Compare ${conteudo} em duas regioes brasileiras diferentes. Quais semelhancas e diferencas voce identifica?
Regiao 1: ___________________________________________
Regiao 2: ___________________________________________
Comparacao: ___________________________________________

6. (Aplicar) Se voce fosse prefeito de uma cidade afetada por ${conteudo}, que tres politicas publicas implantaria? Justifique cada uma.
___________________________________________
___________________________________________
___________________________________________

7. (Avaliar) Verdadeiro ou Falso. Justifique as afirmacoes falsas:
( ) ${conteudo} e exclusivamente resultado de acoes humanas, sem componente natural
( ) O Brasil possui mecanismos institucionais para lidar com ${conteudo}
( ) A globalizacao nao influencia ${conteudo} no territorio brasileiro

8. (Sintetizar) Elabore um paragrafo argumentativo explicando como ${conteudo} esta relacionado ao desenvolvimento sustentavel. Use dados do IBGE ou INPE se conhecer.
___________________________________________
___________________________________________
___________________________________________

9. (Aplicar) Calcule: se uma regiao tem 500 km² de area e 250.000 habitantes, qual e sua densidade demografica? Como isso se relaciona com ${conteudo}?
Calculo: ___________________________________________
Relacao: ___________________________________________

10. (Avaliar - Global) Como ${conteudo} no Brasil se compara com paises da America Latina? O Brasil esta melhor ou pior? Que indicadores voce usaria para comparar?
___________________________________________
___________________________________________
___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GABARITO: 1-B | 2-Resposta geografica fundamentada | 3-Analise causal | 4-B | 5-Comparacao regional | 6-Politicas publicas fundamentadas | 7-F (tem componente natural tambem), V, F (globalizacao influencia) | 8-Paragrafo argumentativo | 9-500 hab/km² | 10-Analise comparativa
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
  }

  // DEFAULT — qualquer disciplina nao mapeada
  return `${cabecalho}

INSTRUCOES: Leia com atencao. Responda de forma completa, usando seus conhecimentos sobre ${conteudo}.

1. (Memorizar) Qual das alternativas define CORRETAMENTE o conceito de "${conteudo}"?
A) Um conceito teorico sem aplicacao pratica no cotidiano
B) Um tema relevante que pode ser compreendido, analisado e aplicado na realidade
C) Uma ideia exclusivamente academica, sem relacao com a vida social
D) Um assunto que so interessa a especialistas da area

2. (Compreender) Com suas proprias palavras, explique o que e ${conteudo} e por que ele e estudado nessa disciplina. Qual e a sua importancia na area do conhecimento?
___________________________________________
___________________________________________
___________________________________________

3. (Aplicar) De dois exemplos concretos do cotidiano brasileiro em que ${conteudo} esta presente. Explique como ele se manifesta em cada situacao.
Exemplo 1: ___________________________________________
Exemplo 2: ___________________________________________

4. (Analisar) Compare ${conteudo} com outro conceito da mesma disciplina que voce ja estudou. Quais sao as semelhancas e as diferencas?
Semelhancas: ___________________________________________
Diferencas: ___________________________________________

5. (Analisar) Avalie as afirmacoes sobre ${conteudo} (V ou F) e corrija as que forem falsas:
( ) ${conteudo} se relaciona com outros conteudos ja estudados nessa disciplina
( ) O estudo de ${conteudo} nao tem nenhuma utilidade fora da sala de aula
( ) Compreender ${conteudo} contribui para o pensamento critico

6. (Aplicar) Resolva a situacao-problema: Um grupo de pesquisadores esta estudando ${conteudo} e encontrou dados contradictorios. Que perguntas voce faria para investigar melhor o assunto?
___________________________________________
___________________________________________

7. (Avaliar) Por que e importante estudar ${conteudo} nessa fase da sua escolaridade? Como esse conhecimento pode ser util no seu projeto de vida?
___________________________________________
___________________________________________
___________________________________________

8. (Sintetizar) Crie um mapa mental (descrito em palavras) com "${conteudo}" no centro e pelo menos 5 conceitos relacionados ao redor, com uma frase de conexao para cada um.
___________________________________________
___________________________________________
___________________________________________

9. (Criar) Elabore uma questao de multipla escolha sobre ${conteudo} que voce faria para um colega. Inclua 4 alternativas e o gabarito.
Questao: ___________________________________________
A) ___ B) ___ C) ___ D) ___
Gabarito: ___

10. (Avaliar - Reflexao Final) O que voce mudaria na forma como ${conteudo} e ensinado para tornar o aprendizado mais significativo? Justifique com argumentos.
___________________________________________
___________________________________________
___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GABARITO: 1-B | 2-Resposta pessoal fundamentada | 3-Exemplos concretos | 4-Comparacao conceitual | 5-V, F (tem utilidade), V | 6-Perguntas investigativas | 7-Reflexao sobre projeto de vida | 8-Mapa mental | 9-Criacao livre | 10-Reflexao critica
Tempo total da aula: ${totalMin} minutos (${nAulas} aula${nAulas > 1 ? 's' : ''} de 50 min)`
}

// Modo Gerar Atividade Impressa
if (gerarAtividade && promptAtividade) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.length < 20) {
    const atividadeLocal = gerarAtividadeLocalRica(disciplina, serie, conteudo, nivel, numAulas)
    return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: atividadeLocal }, fonte: 'local' })
  }

  try {
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Voce e um especialista pedagogico brasileiro com doutorado em Didatica, alinhado com a BNCC. REGRAS ABSOLUTAS para criar atividades impressas:
1. QUANTIDADE EXATA: se o prompt pede 10 questoes, crie EXATAMENTE 10 numeradas. Se pede 5, crie 5. Nunca menos.
2. ESPECIFICIDADE: cada questao cita o conteudo especifico pelo nome. PROIBIDO questoes genericas.
3. PROFUNDIDADE: distribua pelas taxonomias de Bloom — memorizar, compreender, aplicar, analisar, avaliar, criar.
4. TIPOS VARIADOS: alterne multipla escolha (4 alternativas plausíveis), dissertativa, V ou F com justificativa, lacuna, situacao-problema.
5. CONTEXTO BRASILEIRO: use exemplos, dados e situacoes do Brasil.
6. GABARITO: inclua gabarito comentado e completo ao final.
7. CALCULO: questoes de calculo DEVEM ter numeros reais e resolucao passo a passo.`
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
    const atividadeLocal = gerarAtividadeLocalRica(disciplina, serie, conteudo, nivel, numAulas)
    return NextResponse.json({ success: true, plano: { atividadeImpressaTexto: atividadeLocal }, fonte: 'local' })
  }
}

Ir para o conteúdo
dicatop0001-maker
planeprof
Navegação do repositório
Código
Problemas
Pull requests
Agentes
Ações
Projetos
Wiki
Segurança e qualidade
Percepções
Configurações
 principal
Migalhas de pão
planeprofaplicativo​planejamento​/ novo
/página.tsx
t
T
Último commit
dicatop0001-maker
Corrigir sintaxe de criação de cliente Supabase: corrigir erro de digitação em createClient e …
ec687c8
 · 
História
1846 linhas (1777 locais) · 385 KB
Metadados e controles de arquivos
Código
Culpa
Cru
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
'usar cliente'
importar { useState, useRef } de 'reagir'
importar { usarRoteador } de 'próximo/navegação'
importar Link de 'próximo/link'
importar { criarCliente } de '@supabase/supabase-js'


função getSupabase() {
  retornar criarCliente(
    processo.ambiente.NEXT_PUBLIC_SUPABASE_URL || '',
    processo.ambiente.PRÓXIMA_CHAVE_ANÔN_SUPABASE_PÚBLICA || ''
  )
}


constante DISCIPLINAS = ['Matemática','Língua Portuguesa','Ciências','História','Geografia','Arte','Educação Física','Ensino Religioso','Inglês']
constante SÉRIE = ['Berçário I','Berçário II','Infantil I','Infantil II','Infantil III','Infantil IV','Infantil V','1º Ano','2º Ano','3º Ano','4º Ano','5º Ano','6º Ano','7º Ano','8º Ano','9º Ano']


constante HABILIDADES_BNCC_DADOS:Registro<corda, {código:corda, descrição:corda}[]> = {
  'Matemática':[
    {código:'EF01MA01', descrição:'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas'},
    {código:'EF01MA06', descrição:'Realizar adição de dois números, com e sem agrupamento, com e sem suporte de material manipulável'},
    {código:'EF02MA01', descrição:'Comparar e ordenar números naturais, inteiros e racionais em diferentes contextos'},
    {código:'EF03MA01', descrição:'Ler, escrever e comparar números naturais de até a ordem dos milhar com compreensão'},
    {código:'EF04MA01', descrição:'Ler, escrever e ordenar números naturais até a ordem dos milhões'},
    {código:'EF04MA09', descrição:'Reconhecer as frações unitárias mais usuais como metade, terça parte, quarta parte, décima parte'},
    {código:'EF05MA01', descrição:'Ler, escrever, comparar e ordenar números naturais, racionais e inteiros'},
    {código:'EF05MA07', descrição:'Calcular e representar frações equivalentes e simplificação de frações'},
    {código:'EF06MA01', descrição:'Comparar e ordenar números inteiros em diferentes contextos incluindo o histórico'},
    {código:'EF06MA07', descrição:'Resolver e elaborar problemas que envolvam percentagem, de preferência relacionados ao contexto social'},
    {código:'EF07MA01', descrição:'Compreender a ideia de número real, representar na reta numérica e compará-los'},
    {código:'EF07MA13', descrição:'Verificar relações entre os ângulos formados por retas paralelas cortadas por uma transversal'},
    {código:'EF08MA01', descrição:'Resolver e elaborar problemas envolvendo partes percentuais, incluindo os que ainda deverão calcular taxas percentuais'},
    {código:'EF08MA14', descrição:'Demonstrar que a soma dos ângulos internos de um triângulo é 180°'},
    {código:'EF09MA01', descrição:'Compreender os números reais, com e sem o uso de tecnologias digitais'},
    {código:'EF09MA14', descrição:'Reconhecer as condições permitidas e suficientes para que dois triângulos sejam semelhantes'},
  ],
  'Língua Portuguesa':[
    {código:'EF01LP01', descrição:'Reconhecer que palavras e frases são formadas por letras e que há diferença entre letras e outros sinais gráficos'},
    {código:'EF02LP01', descrição:'Ler e compreender, em colaboração com os colegas, anunciadas de tarefas escolares'},
    {código:'EF03LP01', descrição:'Ler e compreender textos literários de diferentes gêneros e extensões'},
    {código:'EF04LP01', descrição:'Demonstrar compreensão de textos lidos em voz alta por adultos e de textos multissemióticos'},
    {código:'EF05LP01', descrição:'Compreender e interpretar textos de diferentes gêneros textuais, identificando tema e propósito'},
    {código:'EF35LP04', descricao: 'Inferir informações implícitas nos textos lidos'},
    {codigo: 'EF06LP01', descricao: 'Engajar-se e contribuir com a escuta atenta às apresentações de trabalhos e às instruções'},
    {codigo: 'EF07LP01', descricao: 'Identificar os efeitos de sentido do uso de recursos expressivos sonoros em textos'},
    {codigo: 'EF08LP01', descricao: 'Reconhecer e utilizar formas de progressão temática que conferem coerência textual'},
    {codigo: 'EF09LP01', descricao: 'Identificar e compreender, em textos argumentativos, os posicionamentos e as estratégias argumentativas'},
    {codigo: 'EF69LP44', descricao: 'Inferir a presença de valores nos textos considerando a relação entre contexto de produção e circulação'},
  ],
  'Ciências': [
    {codigo: 'EF01CI01', descricao: 'Comparar características de diferentes materiais presentes em objetos de uso cotidiano'},
    {codigo: 'EF02CI01', descricao: 'Identificar de onde vêm os alimentos consumidos em casa, na escola e no município'},
    {codigo: 'EF03CI01', descricao: 'Produzir diferentes misturas e comparar as características dos materiais antes e depois de serem misturados'},
    {codigo: 'EF04CI01', descricao: 'Identificar misturas na vida diária e propor como separá-las com base nas propriedades físicas'},
    {codigo: 'EF04CI09', descricao: 'Identificar os pontos cardeais por meio de indicadores naturais e bússola'},
    {codigo: 'EF05CI01', descricao: 'Explorar fenômenos da vida cotidiana que evidenciem propriedades físicas dos materiais'},
    {codigo: 'EF05CI08', descricao: 'Organizar um cardápio equilibrado baseando-se nas características dos grupos alimentares'},
    {codigo: 'EF06CI01', descricao: 'Classificar como homogêneas ou heterogêneas misturas envolvendo diferentes materiais do cotidiano'},
    {codigo: 'EF07CI01', descricao: 'Discutir a aplicação, no dia a dia, de métodos de separação de misturas'},
    {codigo: 'EF07CI09', descricao: 'Interpretar as condições do tempo atmosférico e distinguir tempo de clima'},
    {codigo: 'EF08CI01', descricao: 'Identificar e analisar fontes de energia renováveis e não renováveis e seus impactos ambientais'},
    {codigo: 'EF09CI01', descricao: 'Investigar as transformações que ocorrem no corpo durante a puberdade'},
    {codigo: 'EF09CI14', descricao: 'Descrever a composição e a estrutura do sistema Solar'},
  ],
  'História': [
    {codigo: 'EF01HI01', descricao: 'Identificar aspectos do seu crescimento por meio do registro das lembranças particulares ou de um grupo social'},
    {codigo: 'EF02HI01', descricao: 'Reconhecer espaços de sociabilidade e identificar os motivos que aproximam e separam as pessoas'},
    {codigo: 'EF03HI01', descricao: 'Identificar aspectos do próprio desenvolvimento e os processos de formação da comunidade'},
    {codigo: 'EF04HI01', descricao: 'Reconhecer a história como resultado da ação dos seres humanos no tempo e no espaço'},
    {codigo: 'EF05HI01', descricao: 'Identificar os processos de produção, hierarquização e difusão dos marcos de memória'},
    {codigo: 'EF06HI01', descricao: 'Identificar diferentes formas de compreensão da noção de tempo e de periodização dos processos históricos'},
    {codigo: 'EF07HI01', descricao: 'Explicar o significado de "modernidade" e suas lógicas de inclusão e exclusão'},
    {codigo: 'EF08HI01', descricao: 'Conhecer e apreciar a história do Brasil no contexto da América e do mundo'},
    {codigo: 'EF08HI24', descricao: 'Identificar e analisar processos que contribuíram para a emergência dos direitos civis no Brasil'},
    {codigo: 'EF09HI01', descricao: 'Descrever e contextualizar os principais aspectos da história do Brasil contemporâneo'},
  ],
  'Geografia': [
    {codigo: 'EF01GE01', descricao: 'Descrever características observadas de seus lugares de vivência (moradia, escola etc.)'},
    {codigo: 'EF02GE01', descricao: 'Comparar diferentes paisagens, identificando ações humanas e naturais que as constituem'},
    {codigo: 'EF03GE01', descricao: 'Identificar instâncias do poder público responsáveis por buscar soluções para as comunidades'},
    {codigo: 'EF04GE01', descricao: 'Selecionar e construir argumentos sobre a contribuição dos grupos sociais no processo de produção'},
    {codigo: 'EF05GE01', descricao: 'Descrever e analisar dinâmicas populacionais na UF em que vive'},
    {codigo: 'EF06GE01', descricao: 'Comparar modificações das paisagens nos lugares de vivência em diferentes tempos'},
    {codigo: 'EF06GE11', descricao: 'Analisar distintas interações das sociedades com a natureza a partir do desenvolvimento técnico'},
    {codigo: 'EF07GE01', descricao: 'Avaliar, por meio de exemplos, a importância do trabalho na formação de paisagens'},
    {codigo: 'EF08GE01', descricao: 'Descrever as rotas de dispersão da espécie humana pelo planeta'},
    {codigo: 'EF09GE01', descricao: 'Analisar criticamente de que forma a hegemonia europeia foi exercida nos diferentes territórios colonizados'},
    {codigo: 'EF09GE14', descricao: 'Elaborar e interpretar gráficos de barras e de setores, mapas temáticos e esquemáticos'},
  ],
  'Arte': [
    {codigo: 'EF15AR01', descricao: 'Identificar e apreciar formas distintas das artes visuais presentes no cotidiano'},
    {codigo: 'EF15AR02', descricao: 'Explorar e praticar a produção artística em artes visuais considerando diferentes materiais'},
    {codigo: 'EF15AR14', descricao: 'Perceber e explorar os elementos constitutivos da música como ritmo, duração, altura e timbre'},
    {codigo: 'EF15AR20', descricao: 'Explorar e fruir teatralidades na vida cotidiana e nas diversas culturas'},
    {codigo: 'EF15AR22', descricao: 'Explorar possibilidades expressivas dos movimentos cotidianos e dos elementos constitutivos da dança'},
    {codigo: 'EF69AR01', descricao: 'Pesquisar, desenvolver e experienciar investigações sobre diferentes linguagens artísticas'},
    {codigo: 'EF69AR25', descricao: 'Criar e improvisar movimentos de dança como prática de integração e expressão'},
    {codigo: 'EF69AR32', descricao: 'Analisar e explorar, em projetos temáticos, as relações entre as artes visuais e as demais áreas do conhecimento'},
  ],
  'Educação Física': [
    {codigo: 'EF12EF01', descricao: 'Experimentar e fruir variações de habilidades motoras básicas como correr, saltar e arremessar'},
    {codigo: 'EF35EF01', descricao: 'Experimentar e fruir brincadeiras e jogos da cultura popular, identificando a diversidade cultural'},
    {codigo: 'EF35EF07', descricao: 'Experimentar e fruir elementos básicos das ginásticas de condicionamento físico'},
    {codigo: 'EF35EF12', descricao: 'Experimentar e fruir, com controle e adequação às condições da ação motora, habilidades técnicas'},
    {codigo: 'EF69EF01', descricao: 'Experimentar e fruir esportes de marca, precisão, campo e taco, rede/divisória e invasão'},
    {codigo: 'EF69EF10', descricao: 'Experimentar e fruir lutas do Brasil e do mundo, identificando marcas e contextos de origem'},
    {codigo: 'EF69EF14', descricao: 'Experimentar e fruir diferentes danças do contexto comunitário e regional'},
  ],
  'Ensino Religioso': [
    {codigo: 'EF01ER01', descricao: 'Identificar e acolher as semelhanças e diferenças nas formas que as pessoas se identificam culturalmente'},
    {codigo: 'EF02ER01', descricao: 'Identificar as histórias sagradas e seus personagens em diferentes tradições religiosas'},
    {codigo: 'EF35ER01', descricao: 'Reconhecer e valorizar a diversidade de práticas religiosas no contexto escolar e comunitário'},
    {codigo: 'EF69ER01', descricao: 'Reconhecer e respeitar a diversidade de crenças, valores e expressões religiosas como parte da identidade cultural humana'},
    {codigo: 'EF69ER09', descricao: 'Discutir como as tradições religiosas se relacionam com práticas de cuidado com a natureza'},
  ],
  'Inglês': [
    {codigo: 'EF06LI01', descricao: 'Identificar o contexto de uso de palavras e expressões de língua inglesa presentes no cotidiano'},
    {codigo: 'EF06LI14', descricao: 'Localizar informações específicas em textos curtos escritos em língua inglesa'},
    {codigo: 'EF07LI01', descricao: 'Usar língua inglesa para interagir e compartilhar informações, experiências e sentimentos'},
    {codigo: 'EF07LI15', descricao: 'Identificar e reproduzir, em meio digital ou impresso, palavras e expressões-chave de um texto'},
    {codigo: 'EF08LI01', descricao: 'Usar recursos de língua inglesa para formular e responder perguntas em situações do cotidiano'},
