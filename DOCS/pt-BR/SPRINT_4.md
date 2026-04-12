# Sprint 4 - Dashboard Real

## Objetivo

Transformar a rota `/dashboard` em um painel mensal real do produto, usando dados do banco para mostrar resumo financeiro, ultimos lancamentos e breakdown por categoria.

Ao final da Sprint 4, o dashboard deve deixar de ser uma tela placeholder e passar a ser a principal visao consolidada do mes para o usuario.

---

## Resultado Esperado

Ao final da Sprint 4, o usuario deve conseguir:

1. ver o total de receitas do mes
2. ver o total de despesas do mes
3. ver o saldo liquido do mes
4. ver os ultimos lancamentos
5. ver o breakdown de despesas por categoria
6. ver o breakdown de receitas por categoria
7. trocar o mes do dashboard
8. usar o dashboard com boa experiencia em mobile

O foco desta sprint nao e construir graficos avancados, mas sim entregar um dashboard mensal real, confiavel e util.

---

## Escopo da Sprint 4

### Incluido

1. dashboard com dados reais do banco
2. cards de resumo mensal
3. filtro por mes no dashboard
4. lista de ultimos lancamentos
5. breakdown de despesas por categoria
6. breakdown de receitas por categoria
7. estados vazios reais
8. experiencia mobile-first

### Fora da Sprint 4

1. graficos com biblioteca externa
2. comparativo com mes anterior
3. tendencia mensal
4. relatorios completos
5. exportacao
6. widgets configuraveis
7. configuracao de dashboard

---

## Dependencias Ja Prontas

Esta sprint parte do que ja foi concluido nas sprints anteriores:

- autenticacao com Supabase
- guard server-side
- schema do banco com `entries` e `categories`
- pagina de lancamentos funcional
- `getMonthlySummary(...)`
- `getRecentEntries(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- revalidacao do dashboard nas actions de lancamentos

Ou seja, a Sprint 4 depende mais de composicao de tela e agregacao de dados do que de infraestrutura nova.

---

## Objetivos Funcionais

### 1. Resumo mensal real

O dashboard deve mostrar:

- receitas do mes
- despesas do mes
- saldo liquido do mes

Esses valores devem respeitar o mes selecionado na tela.

### 2. Ultimos lancamentos

O dashboard deve exibir uma lista resumida com os ultimos lancamentos do usuario, contendo:

- descricao
- categoria
- data
- valor
- diferenciacao visual entre receita e despesa

### 3. Breakdown de despesas por categoria

O dashboard deve mostrar uma lista com as categorias de despesa do mes, ordenadas por maior valor.

Cada item deve mostrar:

- nome da categoria
- cor da categoria
- total gasto
- percentual em relacao ao total de despesas do mes

### 4. Breakdown de receitas por categoria

O dashboard deve mostrar uma lista com as categorias de receita do mes, ordenadas por maior valor.

Cada item deve mostrar:

- nome da categoria
- cor da categoria
- total recebido
- percentual em relacao ao total de receitas do mes

### 5. Filtro por mes

O dashboard deve aceitar filtro por mes via query string.

Exemplo:

- `?month=2026-04`

A UI deve converter o mes em intervalo real de datas para consulta no banco.

---

## Fluxo de UX Esperado

### Fluxo principal

1. abrir app
2. entrar em `Dashboard`
3. visualizar resumo do mes atual
4. ver ultimos lancamentos
5. ver breakdown de despesas e receitas
6. trocar o mes
7. ver os dados sendo atualizados

### Fluxo de consulta rapida

1. abrir dashboard
2. identificar saldo do mes
3. identificar para onde o dinheiro foi
4. identificar de onde o dinheiro entrou
5. navegar para `Lancamentos` se quiser aprofundar

---

## Telas da Sprint 4

### `/dashboard`

Tela principal da sprint.

Deve conter:

- cabecalho do dashboard
- seletor de mes
- cards de resumo
- lista de ultimos lancamentos
- breakdown de despesas
- breakdown de receitas
- estados vazios e mensagens adequadas

---

## Estrutura Recomendada de Componentes

### Componentes de `dashboard`

Criar:

- `dashboard-month-filter.tsx`
- `dashboard-stat-cards.tsx`
- `dashboard-recent-entries.tsx`
- `dashboard-category-breakdown.tsx`

### Responsabilidade de cada um

#### `dashboard-month-filter.tsx`

Responsavel por:

- selecionar o mes
- atualizar query string
- manter a interacao simples no mobile

#### `dashboard-stat-cards.tsx`

Responsavel por:

- mostrar receitas
- mostrar despesas
- mostrar saldo liquido

#### `dashboard-recent-entries.tsx`

Responsavel por:

- mostrar os ultimos lancamentos
- exibir estado vazio quando nao houver itens
- levar o usuario para `entries` ou para edicao do item

#### `dashboard-category-breakdown.tsx`

Responsavel por:

- renderizar breakdown de categorias
- mostrar valor total
- mostrar percentual
- mostrar lista ordenada
- suportar tanto `income` quanto `expense`

---

## Estrutura de Arquivos Esperada

```txt
src/
  app/
    (app)/
      dashboard/
        page.tsx

  components/
    dashboard/
      dashboard-month-filter.tsx
      dashboard-stat-cards.tsx
      dashboard-recent-entries.tsx
      dashboard-category-breakdown.tsx

  lib/
    db/
      queries/
        dashboard.ts
        entries.ts
    utils/
      date.ts
      currency.ts
```

---

## Queries Necessarias

### Ja existentes e reaproveitadas

- `getMonthlySummary(userId, start, end)`
- `getRecentEntries(userId, limit)`

### Nova query da Sprint 4

Criar em `lib/db/queries/dashboard.ts`:

#### `getCategoryBreakdown(userId, start, end, type)`

Responsavel por retornar agregacao por categoria para o mes selecionado.

Parametros esperados:

- `userId`
- `start`
- `end`
- `type`: `income` ou `expense`

Retorno esperado por item:

- `categoryId`
- `name`
- `color`
- `total`
- `share`

Regras:

- considerar apenas lancamentos do usuario autenticado
- considerar apenas o intervalo do mes selecionado
- agrupar por categoria
- ordenar por maior total
- calcular percentual relativo ao total do mesmo tipo
- se o total for zero, o percentual deve ser zero

---

## Estrategia de Implementacao

### Etapa 1: filtro mensal do dashboard

Implementar leitura de `searchParams.month` em `/dashboard`.

O fluxo deve:

1. ler o mes da URL
2. usar `getMonthRange(...)`
3. definir intervalo real `start/end`

### Etapa 2: cards de resumo com dados reais

Substituir os valores fixos por `getMonthlySummary(...)`.

Os cards devem refletir:

- receitas
- despesas
- saldo

### Etapa 3: ultimos lancamentos

Usar `getRecentEntries(...)` para renderizar os ultimos lancamentos.

Nesta sprint, basta mostrar os ultimos 5 itens.

### Etapa 4: breakdown de despesas

Criar a nova query agregada e mostrar uma lista visual simples de categorias de despesa.

### Etapa 5: breakdown de receitas

Reutilizar a mesma query agregada para mostrar categorias de receita.

### Etapa 6: estados vazios

Adicionar estados para:

- dashboard sem dados no mes
- sem despesas no mes
- sem receitas no mes
- sem lancamentos recentes

### Etapa 7: polimento minimo

Garantir:

- boa leitura em mobile
- layout consistente com o app shell
- hierarquia visual clara

---

## Detalhes Tecnicos Importantes

### 1. Dashboard baseado em server component

A pagina `/dashboard` deve continuar no modelo server-side, buscando os dados diretamente das queries.

Motivo:

- simplicidade
- consistencia com a arquitetura atual
- sem necessidade de criar API extra

### 2. Filtro por query string

O mes deve seguir o mesmo principio da tela de `entries`, com query string simples.

Exemplo:

- `/dashboard?month=2026-04`

### 3. Sem biblioteca de grafico nesta sprint

O breakdown sera entregue como lista visual simples, sem adicionar dependencias novas.

Motivo:

- menor risco
- menor acoplamento
- entrega mais rapida
- prepara terreno para Sprint 5

### 4. Reaproveitamento dos helpers existentes

Reaproveitar ao maximo:

- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- padroes ja usados em `entries`

---

## Regras de Negocio

1. dashboard mostra apenas dados do usuario autenticado
2. resumo considera apenas o mes selecionado
3. breakdown de despesas considera apenas `expense`
4. breakdown de receitas considera apenas `income`
5. percentuais devem ser calculados por tipo, nao no total geral
6. listas devem ser ordenadas do maior para o menor valor
7. se nao houver dados, a UI deve mostrar estado vazio claro

---

## Criterios de Pronto

A Sprint 4 so deve ser considerada concluida quando:

1. `/dashboard` usar dados reais do banco
2. cards mostrarem receitas, despesas e saldo corretamente
3. o mes puder ser alterado via query string
4. os ultimos lancamentos aparecerem corretamente
5. o breakdown de despesas funcionar
6. o breakdown de receitas funcionar
7. os estados vazios aparecerem corretamente
8. a tela funcionar bem em mobile
9. `lint` e `build` passarem

---

## Testes Manuais Recomendados

### Resumo mensal

1. verificar receitas do mes
2. verificar despesas do mes
3. verificar saldo liquido

### Mes

1. trocar o mes
2. confirmar que cards mudam
3. confirmar que breakdown muda
4. confirmar que ultimos lancamentos continuam coerentes

### Breakdown

1. verificar categorias de despesa
2. verificar categorias de receita
3. verificar ordenacao por maior valor
4. verificar percentual

### Estados vazios

1. mes sem lancamentos
2. mes sem receitas
3. mes sem despesas

### Mobile

1. validar cards em tela pequena
2. validar listas empilhadas
3. validar legibilidade dos valores

---

## Riscos da Sprint 4

1. dashboard ficar pesado visualmente
2. breakdown ficar confuso sem hierarquia clara
3. duplicar logica entre dashboard e entries
4. tentar colocar graficos cedo demais

---

## Mitigacoes

1. manter layout simples e claro
2. usar listas visuais antes de graficos
3. reaproveitar helpers e queries existentes
4. manter foco em leitura rapida e utilidade real

---

## Ordem Recomendada de Execucao

1. criar `dashboard.ts` com query de breakdown
2. implementar filtro mensal no dashboard
3. conectar cards com `getMonthlySummary(...)`
4. conectar ultimos lancamentos com `getRecentEntries(...)`
5. implementar breakdown de despesas
6. implementar breakdown de receitas
7. adicionar estados vazios
8. revisar UX mobile
9. rodar `lint` e `build`

---

## Definicao de Pronto

A Sprint 4 estara pronta quando o dashboard deixar de ser uma tela de apresentacao e passar a ser uma visao mensal real do produto, mostrando com clareza o que entrou, o que saiu e onde cada tipo de valor se concentra.
