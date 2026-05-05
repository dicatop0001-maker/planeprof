# 🗺️ MAPA PLANEPROF — Map of Content (MOC)

> **Skill: Grafiphy** | Vault Obsidian | Graph View habilitado
> Projeto: Planeprof — Planejamento de Aulas BNCC
> Repositório: https://github.com/dicatop0001-maker/planeprof
> Deploy: https://planeprof.vercel.app

---

## 🎯 Visão Geral do Projeto

tags: #planeprof #MOC #mapa #grafiphy #obsidian

[[01-PROJETO-OVERVIEW]] — Visão geral, stack, objetivos
[[02-ARQUITETURA]] — Estrutura de pastas e componentes
[[03-BANCO-DE-DADOS]] — Supabase, tabelas, migrações
[[04-FRONTEND]] — Next.js, páginas, rotas
[[05-COMPONENTES]] — Componentes React reutilizáveis
[[06-INTEGRACAO-IA]] — OpenAI GPT-4, geração de conteúdo
[[07-AUTENTICACAO]] — Supabase Auth, login/cadastro
[[08-PAGAMENTOS]] — Mercado Pago, PIX, assinaturas
[[09-BNCC]] — Base Nacional Comum Curricular, habilidades
[[10-PDI]] — Plano de Desenvolvimento Individual
[[11-EXPORTACAO]] — PDF e Word
[[12-DEPLOY]] — Vercel, CI/CD, workflows
[[13-ROADMAP]] — Próximos passos e melhorias
[[14-CUSTOS-TOKENS]] — Estratégia de redução de tokens com Grafiphy

---

## 🔗 Conexões Principais

```mermaid
graph TD
    A[🗺️ MOC-PLANEPROF] --> B[Projeto Overview]
        A --> C[Arquitetura]
            A --> D[Banco de Dados]
                A --> E[Frontend]
                    A --> F[IA / OpenAI]
                        A --> G[Autenticação]
                            A --> H[Pagamentos]
                                C --> D
                                    C --> E
                                        E --> F
                                            E --> G
                                                H --> G
                                                    D --> I[BNCC]
                                                        D --> J[PDI]
                                                        ```

                                                        ---

                                                        ## 📁 Estrutura do Vault

                                                        ```
                                                        docs/obsidian-vault/
                                                        ├── 00-MAPA-PLANEPROF.md       ← VOCÊ ESTÁ AQUI
                                                        ├── 01-PROJETO-OVERVIEW.md
                                                        ├── 02-ARQUITETURA.md
                                                        ├── 03-BANCO-DE-DADOS.md
                                                        ├── 04-FRONTEND.md
                                                        ├── 05-COMPONENTES.md
                                                        ├── 06-INTEGRACAO-IA.md
                                                        ├── 07-AUTENTICACAO.md
                                                        ├── 08-PAGAMENTOS.md
                                                        ├── 09-BNCC.md
                                                        ├── 10-PDI.md
                                                        ├── 11-EXPORTACAO.md
                                                        ├── 12-DEPLOY.md
                                                        ├── 13-ROADMAP.md
                                                        └── 14-CUSTOS-TOKENS.md
                                                        ```

                                                        ---

                                                        ## 💡 Como usar com Obsidian

                                                        1. Clone o repositório localmente
                                                        2. Abra a pasta `docs/obsidian-vault/` como vault no Obsidian
                                                        3. Ative o **Graph View** (`Ctrl+G` ou `Cmd+G`) em outra janela
                                                        4. Use o plugin **Dataview** para queries dinâmicas
                                                        5. Use o plugin **Graph Analysis** para métricas de conexão

                                                        ---

                                                        ## 🏷️ Tags do Projeto

                                                        #planeprof #bncc #educacao #nextjs #typescript #supabase #openai #vercel #grafiphy #obsidian #moc
