# Oficina Conexão 2026 — App de teste

Aplicação inicial com React 19 + Vite, layout responsivo e integração preparada para Supabase.

## Requisitos

- Node.js compatível com Vite 8 (Node.js 20.19+ ou 22.12+).
- npm.

## Executar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha `.env.local` com a URL do projeto e a chave **publishable** do Supabase:

```env
VITE_SUPABASE_URL=https://SEU-PROJECT-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Nunca coloque uma chave `service_role` ou `sb_secret` em variáveis `VITE_*` ou no frontend.

## Preparar o banco Supabase

No SQL Editor do seu projeto, execute o conteúdo de [supabase/schema.sql](./supabase/schema.sql). Ele cria a tabela `public.teste_nomes`, ativa RLS e permite somente inserções anônimas para este protótipo. A leitura pública dos registros não é permitida.

## Build

```bash
npm run build
npm run preview
```

No Vercel, configure as mesmas variáveis de ambiente e use `npm run build` com diretório de saída `dist`.

## Interface

- Top header com status de conexão e perfil mockado.
- Sidebar com navegação demonstrativa.
- Área principal com um único campo de nome.
- Rodapé com links de demonstração.
- Layout responsivo para celular e desktop.
