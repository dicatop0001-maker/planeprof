# 🎓 Planeprof

**Planeprof** é um Web App para professores brasileiros de Educação Infantil e Ensino Fundamental, que automatiza a criação de planos de aula baseados na **BNCC** (Base Nacional Comum Curricular).

---

## 🚀 Funcionalidades Principais

- **Planejamento BNCC**: Seleção de conteúdo programático alinhado à BNCC
- - **Habilidades**: Anexação automática de códigos BNCC por conteúdo
  - - **Objetivos**: Geração de 1 a 5 objetivos por aula
    - - **Desenvolvimento**: Passo a passo da aula com caixa de orientações customizadas
      - - **Conclusão/Reflexão**: Sugestão de encerramento e autoavaliação
        - - **Dinâmica Visual**: Geração de jogos e dinâmicas com imagem ilustrativa
          - - **PDI**: Plano de Desenvolvimento Individual para alunos com necessidades especiais
            - - **Exportação**: PDF e Word
              - - **Monetização**: Plano mensal R$ 9,90 / anual R$ 100,00 (40 planejamentos/mês)
               
                - ---

                ## 🛠️ Stack Tecnológica

                - **Frontend**: Next.js + TypeScript + TailwindCSS
                - - **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
                  - - **Deploy**: Vercel
                    - - **IA**: OpenAI API (GPT-4) para geração de conteúdo
                      - - **Pagamento**: Mercado Pago (PIX - chave: 42988880353)
                       
                        - ---

                        ## 📁 Estrutura do Projeto

                        ```
                        planeprof/
                        ├── app/
                        │   ├── (auth)/
                        │   │   ├── login/
                        │   │   └── cadastro/
                        │   ├── dashboard/
                        │   ├── planejamento/
                        │   │   ├── novo/
                        │   │   └── [id]/
                        │   ├── pdi/
                        │   └── pagamento/
                        ├── components/
                        │   ├── Header/
                        │   ├── PlanejamentoCard/
                        │   ├── HabilidadesCard/
                        │   ├── ObjetivosCard/
                        │   ├── DesenvolvimentoCard/
                        │   ├── ConclusaoCard/
                        │   ├── DinamicaCard/
                        │   └── PDIButton/
                        ├── lib/
                        │   ├── supabase.ts
                        │   ├── openai.ts
                        │   └── bncc.ts
                        └── public/
                        ```

                        ---

                        ## 🗄️ Banco de Dados (Supabase)

                        Tabelas principais:
                        - `usuarios` - Dados dos professores
                        - - `planos_de_aula` - Planos gerados
                          - - `habilidades_bncc` - Base de dados da BNCC
                            - - `pagamentos` - Controle de assinaturas e cotas
                              - - `comprovantes` - Upload de comprovantes PIX
                               
                                - ---

                                ## 💰 Modelo de Monetização

                                - **Plano Mensal**: R$ 9,90 → 40 planejamentos/mês
                                - - **Plano Anual**: R$ 100,00 → 40 planejamentos/mês
                                  - - **Cota Extra**: R$ 9,90 → +40 planejamentos
                                    - - **Pagamento**: PIX (Mercado Pago) → chave: 42988880353
                                      - - **Liberação**: Automática após envio do comprovante
                                       
                                        - ---

                                        ## 🌐 Links

                                        - **Repositório**: https://github.com/dicatop0001-maker/planeprof
                                        - - **Deploy**: https://planeprof.vercel.app
                                          - - **Supabase**: https://nrhpphgoqxiadbptunqs.supabase.co
                                            - - **Email**: dicatop0001@gmail.com
                                             
                                              - ---

                                              ## 📋 Próximos Passos

                                              1. [ ] Implementar estrutura Next.js
                                              2. 2. [ ] Configurar autenticação Supabase
                                                 3. 3. [ ] Criar tabelas do banco de dados
                                                    4. 4. [ ] Integrar OpenAI API para geração de conteúdo
                                                       5. 5. [ ] Implementar sistema de pagamento PIX
                                                          6. 6. [ ] Criar componente PDI
                                                             7. 7. [ ] Adicionar exportação PDF/Word
                                                                8. 8. [ ] Configurar domínio personalizado
                                                                  
                                                                   9. ---
                                                                  
                                                                   10. *Desenvolvido com ❤️ para educadores brasileiros*
