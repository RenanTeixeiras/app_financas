# Prompt Para Obter Informacoes do Supabase

Quero que voce me guie passo a passo, de forma bem didatica, para encontrar no painel do Supabase as informacoes abaixo para configurar meu app web com Next.js:

## Informacoes que eu preciso obter

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `DATABASE_URL`
4. confirmar se `Magic Link` esta ativado
5. confirmar se a callback URL de desenvolvimento esta configurada
6. me dizer exatamente em qual menu clicar no painel do Supabase

## Contexto

Estou configurando um app Next.js com Supabase Auth e Postgres.
Quero usar login por magic link.
Estou em ambiente de desenvolvimento local.
A callback esperada e:

`http://localhost:3000/auth/callback`

## O que eu quero na sua resposta

Me responda em portugues do Brasil e organize assim:

### 1. Como encontrar a Project URL
- diga exatamente onde clicar no painel
- diga como reconhecer o valor correto
- mostre um exemplo do formato esperado

### 2. Como encontrar a chave publica correta
- explique a diferenca entre `publishable key` e `anon key`, se necessario
- diga qual delas eu devo copiar para uso no frontend
- mostre o formato esperado

### 3. Como encontrar a `DATABASE_URL`
- diga exatamente onde clicar
- explique se devo usar `direct connection` ou `pooled connection`
- recomende a melhor opcao para Drizzle migrations
- mostre o formato esperado

### 4. Como verificar se o Magic Link esta ativado
- diga onde fica a configuracao
- diga o que deve estar habilitado
- se houver mais de uma opcao de email auth, explique rapidamente

### 5. Como configurar a callback URL
- diga onde clicar
- diga exatamente quais URLs devo cadastrar para desenvolvimento local
- se fizer sentido, inclua tambem a URL de producao

### 6. Checklist final
No fim, monte um checklist simples para eu conferir se peguei tudo certo.

## Regras importantes

- nao assuma que eu conheco o painel do Supabase
- explique como se eu estivesse fazendo isso pela primeira vez
- seja objetivo, mas detalhado
- se houver nomes de menus diferentes em versoes recentes do Supabase, mencione isso
- nao invente valores; apenas explique onde encontrar cada um
