# 🗄️ Banco de Dados — Supabase

tags: #supabase #banco-de-dados #postgresql #planeprof

Parte de: [[00-MAPA-PLANEPROF]] | [[02-ARQUITETURA]]

---

## 📊 Tabelas Principais

### `usuarios`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Primary key (Supabase Auth) |
| email | TEXT | Email do professor |
| nome | TEXT | Nome completo |
| plano | TEXT | 'mensal' ou 'anual' |
| cota_usada | INT | Planejamentos usados no mês |
| cota_limite | INT | Limite (40 padrão) |
| created_at | TIMESTAMP | Data de cadastro |

### `planos_de_aula`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Primary key |
| usuario_id | UUID | FK → usuarios.id |
| titulo | TEXT | Título do plano |
| etapa | TEXT | Ed. Infantil / Fund. I / Fund. II |
| componente | TEXT | Disciplina (Matemática, etc.) |
| habilidades | JSONB | Códigos BNCC |
| objetivos | JSONB | Array de objetivos |
| desenvolvimento | TEXT | Passo a passo da aula |
| conclusao | TEXT | Encerramento e reflexão |
| dinamica | JSONB | Jogo/dinâmica + imagem |
| created_at | TIMESTAMP | Data de criação |

### `habilidades_bncc`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Primary key |
| codigo | TEXT | Ex: EF01MA01 |
| descricao | TEXT | Descrição da habilidade |
| componente | TEXT | Disciplina |
| ano | TEXT | Ano escolar |
| etapa | TEXT | Ed. Infantil / Fundamental |

### `pagamentos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Primary key |
| usuario_id | UUID | FK → usuarios.id |
| plano | TEXT | 'mensal', 'anual', 'extra' |
| valor | DECIMAL | Valor pago |
| status | TEXT | 'pendente', 'aprovado' |
| comprovante_url | TEXT | URL do arquivo no Storage |
| created_at | TIMESTAMP | Data do pagamento |

---

## 📁 Migrações

Localização: `superbase/migrations/`

---

## 🔗 Conexões

- [[02-ARQUITETURA]] — Estrutura geral
- - [[07-AUTENTICACAO]] — Supabase Auth
  - - [[08-PAGAMENTOS]] — Tabela pagamentos
    - - [[09-BNCC]] — Tabela habilidades_bncc
      - - [[10-PDI]] — PDI no banco
