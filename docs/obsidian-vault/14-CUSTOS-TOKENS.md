# 💰 Estratégia de Custos de Tokens — Skill Grafiphy

tags: #grafiphy #tokens #obsidian #custos #otimizacao

Parte de: [[00-MAPA-PLANEPROF]]

---

## 🎯 O que é a Skill Grafiphy?

A **Skill Grafiphy** é uma metodologia de organização de projetos baseada em:
- **Notas atômicas** em Markdown conectadas por `[[wikilinks]]`
- **Map of Content (MOC)** como ponto de entrada
- **Graph View do Obsidian** para visualização visual das conexões
- **Redução drástica de tokens** ao consultar IAs (como Claude)

---

## 📉 Como Reduz Tokens?

### ❌ Sem Grafiphy (método antigo)
```
Prompt para IA: "Leia todos os arquivos do projeto X e me explique..."
→ Envia: 50+ arquivos, 10.000+ linhas de código
→ Custo: ~150.000 tokens por consulta
```

### ✅ Com Grafiphy (método novo)
```
Prompt para IA: "Leia o MOC do projeto X: [cola 00-MAPA-PLANEPROF.md]"
→ Envia: 1 arquivo de mapa, 80 linhas
→ IA entende toda a estrutura
→ Custo: ~800 tokens por consulta
→ Economia: 99% menos tokens!
```

---

## 🗺️ Como Funciona na Prática

### Passo 1 — Abrir o MOC
Sempre comece a conversa com a IA colando o arquivo `00-MAPA-PLANEPROF.md`

### Passo 2 — Navegar pelo Mapa
A IA lê o mapa e sabe exatamente onde está cada informação.
Ela só pede o arquivo específico quando necessário.

### Passo 3 — Zoom no Nó
Quando precisar de detalhes de um componente específico, cole apenas aquele nó:
- Ex: "Me explique o [[03-BANCO-DE-DADOS]]" → cola só esse arquivo

### Passo 4 — Graph View no Obsidian
Use o Obsidian em outra tela para ver o grafo completo visualmente.
Isso permite navegar visualmente e saber exatamente qual arquivo cole.

---

## 🔢 Estimativa de Economia

| Método | Tokens por sessão | Custo (GPT-4) |
|--------|------------------|---------------|
| Sem Grafiphy | ~150.000 tokens | ~$4,50/sessão |
| Com Grafiphy | ~2.000 tokens | ~$0,06/sessão |
| **Economia** | **~148.000 tokens** | **~98% menos** |

---

## 🛠️ Setup Obsidian para Grafiphy

### Plugins Recomendados
- **Graph View** (nativo) — visualização de grafo
- **Dataview** — queries dinâmicas nas notas
- **Graph Analysis** — métricas de conexão
- **Templater** — templates para novos nós
- **Obsidian Git** — sync automático com GitHub

### Configuração do Graph View
1. Abra Graph View: `Ctrl+G`
2. Abra em nova janela: clique no ícone de janela (topo direito)
3. Configure filtros:
   - Mostrar tags: ✅
      - Mostrar links órfãos: ❌
         - Profundidade: 3

         ### Workflow Diário
         ```
         1. Abra Obsidian em monitor secundário
         2. Abra Graph View na mesma janela
         3. No monitor principal: IDE + Chat IA
         4. Para consultas: copie o nó relevante do Obsidian
         5. Cole no chat da IA com contexto mínimo
         ```

         ---

         ## 📋 Template para Novos Projetos

         Para aplicar o Grafiphy em qualquer projeto novo:
         1. Crie pasta `docs/obsidian-vault/`
         2. Crie `00-MAPA-[PROJETO].md` como MOC
         3. Crie nós para cada módulo principal
         4. Adicione `[[wikilinks]]` entre nós relacionados
         5. Abra no Obsidian e visualize o grafo

         ---

         ## 🔗 Conexões

         - [[00-MAPA-PLANEPROF]] — Mapa principal
         - [[01-PROJETO-OVERVIEW]] — Visão geral
         - [[02-ARQUITETURA]] — Estrutura técnica
         - [[13-ROADMAP]] — Próximos passos
