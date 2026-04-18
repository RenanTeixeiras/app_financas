# Status da Sprint 4

## Visao Geral

A Sprint 4 teve como foco transformar o modulo de `dashboard` em uma tela real de consulta mensal, conectada ao banco e util no uso diario.

A base tecnica para isso ja existia desde as sprints anteriores: autenticacao, protecao server-side, schema com `entries` e `categories`, queries de resumo mensal e ultimos lancamentos, utilitarios de data e moeda, e revalidacao do dashboard nas actions de lancamentos.

O trabalho principal desta sprint foi compor esses recursos em uma tela server-side consistente com o restante do app, adicionando a agregacao que faltava para o breakdown por categoria.

---

## Objetivo da Sprint 4

Implementar um dashboard mensal real, permitindo ao usuario:

- ver receitas do mes
- ver despesas do mes
- ver saldo liquido do mes
- consultar os ultimos lancamentos
- entender o breakdown de despesas por categoria
- entender o breakdown de receitas por categoria
- trocar o mes via query string
- usar a tela com boa experiencia em mobile

---

## Base Ja Existente Antes da Implementacao

Antes desta sprint, o projeto ja contava com:

- autenticacao com Supabase
- guard server-side nas rotas privadas
- pagina de lancamentos funcional
- `getMonthlySummary(...)`
- `getRecentEntries(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- revalidacao do dashboard nas actions de `entries`

Ou seja, a maior parte da infraestrutura necessaria ja estava pronta. Faltava transformar a rota `/dashboard` em uma visao mensal consolidada de verdade.

---

## O Que Foi Implementado

## 1. Dashboard real em `/dashboard`

A rota `/dashboard`, que antes era um placeholder com valores fixos, passou a usar dados reais do banco.

Foi implementado:

- leitura do mes via `searchParams`
- conversao do mes em intervalo real `start/end`
- carregamento server-side dos dados do dashboard
- cards com resumo mensal real
- lista de ultimos lancamentos
- breakdown de despesas por categoria
- breakdown de receitas por categoria
- estados vazios reais
- aviso quando o mes informado e invalido

Com isso, o dashboard deixou de ser uma tela de apresentacao e passou a ser um modulo funcional do produto.

---

## 2. Filtro mensal por query string

Foi implementado o filtro por mes em `/dashboard`, seguindo o mesmo principio ja usado em `entries`.

Exemplo de uso:

- `?month=2026-04`

Comportamento aplicado:

- leitura do mes vindo da URL
- uso de `getMonthRange(...)` para obter `start/end`
- fallback automatico para o mes atual quando o valor informado e invalido
- mensagem visual avisando quando o filtro foi corrigido automaticamente

Isso manteve a tela simples, previsivel e compativel com navegacao por URL.

---

## 3. Cards de resumo mensal

Os cards do topo foram conectados a `getMonthlySummary(...)`.

Agora a tela mostra com dados reais:

- receitas do mes
- despesas do mes
- saldo liquido

O valor mostrado respeita o mes selecionado e usa a formatacao monetaria do projeto.

---

## 4. Ultimos lancamentos

Foi criada uma secao dedicada para os ultimos lancamentos do usuario.

Decisao aplicada nesta sprint:

- mostrar os 5 ultimos lancamentos gerais do usuario
- nao limitar essa lista ao mes filtrado do dashboard

Cada item mostra:

- descricao
- categoria
- data
- valor
- diferenciacao visual entre receita e despesa
- link para a tela de edicao do lancamento

Tambem foi incluido um estado vazio quando ainda nao existem lancamentos.

---

## 5. Breakdown de despesas por categoria

Foi implementada uma nova query agregada para o dashboard:

- `getCategoryBreakdown(userId, start, end, type)`

Essa query:

- filtra por usuario autenticado
- filtra pelo intervalo do mes selecionado
- filtra por tipo (`expense` ou `income`)
- agrupa por categoria
- soma os valores por categoria
- ordena do maior para o menor valor
- calcula o percentual relativo ao total do mesmo tipo

Com isso, o dashboard passou a exibir uma lista visual de despesas por categoria com total e participacao percentual.

---

## 6. Breakdown de receitas por categoria

A mesma query agregada foi reutilizada para receitas.

Isso permitiu manter:

- uma unica regra de agregacao
- menor duplicacao de logica
- consistencia entre despesas e receitas

Cada categoria mostra:

- nome
- cor
- total recebido
- percentual dentro do total de receitas do mes

---

## 7. Componentes dedicados de dashboard

Para organizar a tela e evitar concentrar toda a implementacao em `page.tsx`, foram criados componentes especificos para o modulo.

Componentes criados:

- `dashboard-month-filter.tsx`
- `dashboard-stat-cards.tsx`
- `dashboard-recent-entries.tsx`
- `dashboard-category-breakdown.tsx`

Essa divisao manteve a pagina principal como composicao de dados e deixou a renderizacao mais clara e reutilizavel.

---

## 8. Ajuste em utilitario de data

Foi adicionado em `lib/utils/date.ts` o helper:

- `formatMonthLabel(...)`

Ele foi usado para transformar o valor da query string em uma apresentacao amigavel no cabecalho do dashboard.

---

## 9. Estados vazios e comportamento de fallback

Foram adicionados estados para:

- dashboard sem movimentacoes no mes
- sem despesas no mes
- sem receitas no mes
- sem lancamentos recentes

Tambem foi adicionado fallback de mes invalido para o mes atual, evitando que a tela ficasse com comportamento incorreto ou ambiguo.

---

## Arquivos Criados na Sprint 4

### Queries

- `app/src/lib/db/queries/dashboard.ts`

### Componentes

- `app/src/components/dashboard/dashboard-month-filter.tsx`
- `app/src/components/dashboard/dashboard-stat-cards.tsx`
- `app/src/components/dashboard/dashboard-recent-entries.tsx`
- `app/src/components/dashboard/dashboard-category-breakdown.tsx`

---

## Arquivos Alterados na Sprint 4

- `app/src/app/(app)/dashboard/page.tsx`
- `app/src/lib/utils/date.ts`

---

## Fluxos Ja Funcionando

Com o que foi entregue nesta sprint, o usuario ja consegue:

1. abrir o dashboard
2. ver receitas do mes atual
3. ver despesas do mes atual
4. ver saldo liquido do mes atual
5. trocar o mes pela interface
6. ver o dashboard atualizar conforme o mes escolhido
7. consultar os ultimos lancamentos do usuario
8. identificar quais categorias mais concentram despesas no mes
9. identificar quais categorias mais concentram receitas no mes

---

## Verificacao Tecnica

Apos a implementacao da Sprint 4, foi validado que:

- `npm run lint` passa
- `npm run build` passa

Isso confirma que a sprint ficou consistente em compilacao, tipagem e estrutura de rotas.

---

## Estado Atual da Sprint 4

Neste momento, a Sprint 4 esta concluida com o escopo planejado.

Ja existe:

- dashboard mensal real
- cards com resumo financeiro do mes
- filtro por mes via query string
- lista de ultimos lancamentos
- breakdown de despesas por categoria
- breakdown de receitas por categoria
- estados vazios claros
- experiencia coerente com o layout mobile-first atual do app

O modulo de `dashboard` deixou de ser placeholder e passou a ser uma parte funcional do MVP.

---

## O Que Fica Para Depois

Itens que continuam fora do escopo da Sprint 4:

- graficos com biblioteca externa
- comparativo com mes anterior
- tendencia mensal
- relatorios mais completos
- exportacao
- widgets configuraveis

Esses pontos ficam preparados para sprints futuras, especialmente a evolucao de relatorios.

---

## Conclusao

A Sprint 4 avancou o projeto de um app com entradas e categorias funcionais para um produto que ja oferece visao consolidada mensal ao usuario.

Com isso, o MVP passa a ter dois modulos realmente uteis no dia a dia:

- lancamentos
- dashboard

Esse passo fortalece a utilidade pratica do produto e prepara melhor o terreno para a proxima etapa de relatorios.
