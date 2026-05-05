# 🔧 Setup Obsidian — Skill Grafiphy para Planeprof

> Guia completo para configurar o Obsidian com Graph View em outra tela
> > e sincronizar com o repositório GitHub
> >
> > tags: #setup #obsidian #grafiphy #graphview #instalacao
> >
> > Parte de: [[00-MAPA-PLANEPROF]] | [[14-TOKENS-PERSONALIZADOS]]
> >
> > ---
> >
> > ## 📥 Passo 1 — Clonar o Repositório
> >
> > ```bash
> > git clone https://github.com/dicatop0001-maker/planeprof.git
> > cd planeprof
> > ```
> >
> > ---
> >
> > ## 🏠 Passo 2 — Abrir Vault no Obsidian
> >
> > 1. Abra o **Obsidian**
> > 2. 2. Clique em **"Abrir pasta como vault"**
> >    3. 3. Selecione a pasta: `planeprof/docs/obsidian-vault/`
> >       4. 4. Clique em **"Confiar no autor e habilitar todos os plugins"**
> >         
> >          5. ---
> >         
> >          6. ## 🔌 Passo 3 — Instalar Plugins Essenciais
> >         
> >          7. ### Plugins Comunidade (Settings → Plugins da Comunidade):
> >
> > | Plugin | Função |
> > |--------|--------|
> > | **Obsidian Git** | Sync automático com GitHub |
> > | **Dataview** | Queries dinâmicas nas notas |
> > | **Graph Analysis** | Métricas de conexão no grafo |
> > | **Templater** | Templates para novos nós |
> > | **Mind Map** | Mapa mental interativo |
> >
> > ### Como instalar:
> > 1. `Configurações` → `Plugins da comunidade`
> > 2. 2. `Buscar` → nome do plugin
> >    3. 3. `Instalar` → `Habilitar`
> >      
> >       4. ---
> >      
> >       5. ## 🗺️ Passo 4 — Configurar Graph View em Outra Tela
> >      
> >       6. ### Abrir Graph View:
> > 1. Pressione `Ctrl+G` (Windows/Linux) ou `Cmd+G` (Mac)
> > 2. 2. No Graph View: clique no ícone **"Abrir em nova janela"** (canto superior direito)
> >    3. 3. Arraste a janela do Graph View para o **monitor secundário**
> >      
> >       4. ### Configurações Recomendadas do Graph View:
> >       5. ```
> >          Filtros:
> >            ✅ Exibir links existentes
> >            ✅ Exibir tags
> >            ❌ Links órfãos (desabilitado)
> >
> >          Grupos (Colorir por tag):
> >            🟡 #moc → amarelo
> >            🔵 #arquitetura → azul
> >            🟢 #bncc → verde
> >            🔴 #pagamentos → vermelho
> >
> >          Exibição:
> >            Forças de nós: 3
> >            Repulsão de links: 2
> >            Distância de link: 250
> >          ```
> >
> > ---
> >
> > ## ⚙️ Passo 5 — Configurar Obsidian Git (Sync Automático)
> >
> > 1. Instale o plugin **Obsidian Git**
> > 2. 2. `Configurações` → `Obsidian Git`
> >    3. 3. Configure:
> >       4.    - **Auto pull interval:** 10 minutos
> >             -    - **Auto push interval:** 30 minutos
> >                  -    - **Commit message:** `vault: auto-sync {{date}}`
> >                       - 4. Autentique com GitHub (token pessoal)
> >                        
> >                         5. ---
> >                        
> >                         6. ## 🖥️ Passo 6 — Layout de Telas Recomendado
> >                        
> >                         7. ```
> > ┌─────────────────────┬─────────────────────┐
> > │  MONITOR PRINCIPAL  │  MONITOR SECUNDÁRIO  │
> > │                     │                     │
> > │  ┌───────────────┐  │  ┌───────────────┐  │
> > │  │   VS Code /   │  │  │   Obsidian    │  │
> > │  │   Terminal    │  │  │   Graph View  │  │
> > │  └───────────────┘  │  └───────────────┘  │
> > │  ┌───────────────┐  │                     │
> > │  │  Chat IA      │  │  Veja todos os nós  │
> > │  │  (Claude)     │  │  conectados         │
> > │  └───────────────┘  │  visualmente!       │
> > └─────────────────────┴─────────────────────┘
> > ```
> >
> > ---
> >
> > ## 🔄 Workflow Diário com Grafiphy
> >
> > ### Para consultar a IA sobre o projeto:
> >
> > ```
> > 1. Olhe o Graph View no Obsidian (monitor secundário)
> > 2. 2. Identifique o nó com a informação que precisa
> >    3. 3. Abra esse nó no Obsidian
> >       4. 4. Copie o conteúdo (Ctrl+A, Ctrl+C)
> >          5. 5. Cole no chat da IA com sua pergunta
> >             6. 6. Economia: ~99% menos tokens!
> >                7. ```
> >
> >                   ### Para adicionar novo módulo ao projeto:
> >
> >                   ```
> >                   1. Crie novo arquivo .md na pasta obsidian-vault/
> >                   2. 2. Use o template: [[TEMPLATE-NO]]
> >                      3. 3. Adicione [[wikilinks]] para nós relacionados
> >                         4. 4. O Graph View atualiza automaticamente
> >                            5. 5. Faça commit: Obsidian Git auto-sync
> >                               6. ```
> >
> >                                  ---
> >
> >                                  ## 📋 Arquivos do Vault
> >
> >                                  | Arquivo | Descrição |
> >                                  |---------|-----------|
> >                                  | [[00-MAPA-PLANEPROF]] | 🗺️ MOC — Mapa central do projeto |
> >                                  | [[01-PROJETO-OVERVIEW]] | 📌 Visão geral e stack |
> >                                  | [[02-ARQUITETURA]] | 🏗️ Estrutura de pastas |
> >                                  | [[03-BANCO-DE-DADOS]] | 🗄️ Supabase schema |
> >                                  | [[04-FRONTEND]] | 🖥️ Next.js páginas |
> >                                  | [[05-COMPONENTES]] | 🧩 React components |
> >                                  | [[06-INTEGRACAO-IA]] | 🤖 OpenAI GPT-4 |
> >                                  | [[07-AUTENTICACAO]] | 🔐 Supabase Auth |
> >                                  | [[08-PAGAMENTOS]] | 💳 Mercado Pago PIX |
> >                                  | [[09-BNCC]] | 📚 Base Nacional Curricular |
> >                                  | [[10-PDI]] | 👤 Plano Desenvolvimento Individual |
> >                                  | [[11-EXPORTACAO]] | 📄 PDF e Word |
> >                                  | [[12-DEPLOY]] | 🚀 Vercel CI/CD |
> >                                  | [[13-ROADMAP]] | 🗓️ Próximos passos |
> >                                  | [[14-TOKENS-PERSONALIZADOS]] | 💰 Estratégia Grafiphy |
> >
> >                                  ---
> >
> >                                  ## 🔗 Conexões
> >
> >                                  - [[00-MAPA-PLANEPROF]] — Mapa central
> >                                  - [[14-TOKENS-PERSONALIZADOS]] — Estratégia de redução de tokens
