# 🏗️ Arquitetura — Planeprof

tags: #arquitetura #nextjs #estrutura #planeprof

Parte de: [[00-MAPA-PLANEPROF]] | [[01-PROJETO-OVERVIEW]]

---

## 📁 Estrutura de Pastas

```
planeprof/
├── .github/workflows/     → CI/CD automação
├── aplicativo/            → App Next.js (App Router)
│   ├── (auth)/
│   │   ├── login/
│   │   └── cadastro/
│   ├── dashboard/         → Painel principal
│   ├── planejamento/
│   │   ├── novo/          → Criar novo plano
│   │   └── [id]/          → Ver/editar plano
│   ├── pdi/               → Plano Desenv. Individual
│   ├── pagamento/         → Fluxo de assinatura
│   └── api/               → API Routes
├── biblioteca/            → lib/ utilitários
│   ├── supabase.ts        → Cliente Supabase
│   ├── openai.ts          → Cliente OpenAI
│   └── bncc.ts            → Dados BNCC
├── superbase/             → Migrações SQL
│   └── migrations/
├── middleware.ts          → Auth middleware
├── .gitignore
└── README.md
```

---

## 🔄 Fluxo de Dados

```
Usuario → Next.js (Frontend)
         ↓
    Supabase Auth (autenticação)
         ↓
    API Routes (Next.js)
         ↓
    OpenAI GPT-4 (geração IA)
         ↓
    Supabase DB (persistência)
         ↓
    Vercel (deploy)
```

---

## 🔗 Conexões

- [[03-BANCO-DE-DADOS]] — Schema Supabase
- - [[04-FRONTEND]] — Páginas e componentes
  - - [[05-COMPONENTES]] — UI components
    - - [[06-INTEGRACAO-IA]] — OpenAI integration
      - - [[07-AUTENTICACAO]] — Auth flow
        - - [[12-DEPLOY]] — Vercel CI/CD
