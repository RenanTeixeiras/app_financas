# Sprint 5 - Relatorios e Polimento

## Objetivo

Transformar a rota `/reports` em uma tela real de relatorios do produto, usando dados do banco para mostrar resumo do mes, tendencia mensal e breakdowns analiticos de receitas e despesas.

Ao final da Sprint 5, o app deve sair do estado de dashboard funcional isolado e passar a oferecer uma camada de leitura analitica mais completa, com melhoria de estados vazios, loading states e polimento visual geral.

---

## Resultado Esperado

Ao final da Sprint 5, o usuario deve conseguir:

1. abrir uma tela real de relatorios em `/reports`
2. trocar o mes da analise por query string
3. ver resumo do mes na tela de relatorios
4. ver tendencia mensal dos ultimos meses
5. ver breakdown de despesas por categoria
6. ver breakdown de receitas por categoria
7. perceber loading states mais claros durante navegacao
8. encontrar estados vazios mais consistentes no app
9. usar `dashboard`, `entries`, `categories` e `reports` com melhor acabamento visual e responsivo

---

## Escopo da Sprint 5

### Incluido

1. tela real de relatorios
2. filtro por mes em `/reports`
3. resumo mensal em relatorios
4. tendencia mensal com `Recharts`
5. breakdown de despesas por categoria em relatorios
6. breakdown de receitas por categoria em relatorios
7. estados vazios melhores
8. skeletons e loading states nas rotas principais
9. polimento visual adicional
10. revisao completa de responsividade nas telas principais
11. atualizacao de textos antigos da UI que ainda mencionam sprints passadas

### Fora da Sprint 5

1. exportacao
2. configuracoes reais em `/settings`
3. comparativo avancado entre periodos arbitrarios
4. configuracao de widgets
5. refinamento final de PWA
6. microinteracoes avancadas
7. auditoria completa de acessibilidade
8. revisao profunda de performance
9. deploy final

---

## Dependencias Ja Prontas

Esta sprint parte do que ja foi concluido nas sprints anteriores:

- autenticacao com Supabase
- guard server-side
- schema do banco com `entries` e `categories`
- pagina de lancamentos funcional
- pagina de dashboard funcional
- `getMonthlySummary(...)`
- `getRecentEntries(...)`
- `getCategoryBreakdown(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- revalidacao de dashboard e relatorios nas actions de lancamentos

Ou seja, a Sprint 5 depende principalmente de uma nova composicao de tela em `reports`, de queries agregadas para tendencia mensal e de um passe de acabamento visual no app.

---

## Objetivos Funcionais

### 1. Tela real de relatorios

A rota `/reports` deve deixar de ser placeholder e passar a renderizar dados reais do usuario autenticado.

Ela deve conter:

- cabecalho de relatorios
- seletor de mes
- cards de resumo
- grafico de tendencia mensal
- breakdown de despesas
- breakdown de receitas
- estados vazios apropriados

### 2. Filtro por mes

A tela deve aceitar filtro por mes via query string.

Exemplo:

- `?month=2026-04`

Comportamento esperado:

- ler o mes da URL
- converter para `start/end` reais com `getMonthRange(...)`
- usar fallback para o mes atual se o valor vier invalido
- avisar visualmente quando houver correcao automatica do filtro

### 3. Resumo mensal em relatorios

A tela deve mostrar, para o mes selecionado:

- total de receitas
- total de despesas
- saldo liquido

Esses dados podem reaproveitar a logica ja usada no dashboard.

### 4. Tendencia mensal

A tela deve mostrar uma tendencia dos ultimos meses usando `Recharts`.

Dados minimos por mes:

- mes
- receitas
- despesas
- saldo

Escopo fechado desta sprint:

- grafico simples e legivel
- leitura boa em mobile
- sem excesso de configuracao visual

### 5. Breakdown de despesas por categoria

Deve mostrar as categorias de despesa do mes selecionado com:

- nome
- cor
- total
- percentual

### 6. Breakdown de receitas por categoria

Deve mostrar as categorias de receita do mes selecionado com:

- nome
- cor
- total
- percentual

### 7. Estados vazios melhores

Melhorar os estados vazios em:

- `reports`
- `dashboard`
- `entries`
- `categories`, se necessario

Objetivo:

- mais clareza
- melhor hierarquia visual
- CTA quando fizer sentido

### 8. Loading states e skeletons

Adicionar loading states para as principais rotas privadas:

- `/dashboard`
- `/entries`
- `/categories`
- `/reports`

### 9. Polimento visual e responsivo

Revisar acabamento visual e responsividade em:

- `dashboard`
- `entries`
- `categories`
- `reports`
- landing page
- sidebar

Tambem corrigir textos stale que ainda mencionam `Sprint 1` ou estados antigos do projeto.

---

## Fluxo de UX Esperado

### Fluxo principal de relatorios

1. abrir app
2. entrar em `Relatorios`
3. visualizar resumo do mes atual
4. ver a tendencia dos ultimos meses
5. ver breakdown de despesas e receitas
6. trocar o mes
7. ver os dados atualizados

### Fluxo de consulta analitica

1. abrir relatorios
2. entender se o saldo esta melhorando ou piorando
3. identificar padrao de receitas e despesas ao longo dos meses
4. identificar categorias mais relevantes no mes selecionado
5. navegar para `Lancamentos` se quiser aprofundar

---

## Telas da Sprint 5

### `/reports`

Tela principal da sprint.

Deve conter:

- cabecalho da pagina
- seletor de mes
- cards de resumo mensal
- grafico de tendencia mensal
- breakdown de despesas
- breakdown de receitas
- estados vazios
- feedback de filtro invalido, se necessario

---

## Estrutura Recomendada de Componentes

### Componentes de `reports`

Criar:

- `reports-month-filter.tsx`
- `reports-stat-cards.tsx`
- `monthly-trend-chart.tsx`
- `reports-breakdown-section.tsx`
- `reports-skeleton.tsx`

### Componentes compartilhados recomendados

- `loading-skeleton.tsx`

### Responsabilidade de cada um

#### `reports-month-filter.tsx`

Responsavel por:

- selecionar o mes
- atualizar query string
- manter interacao simples no mobile

#### `reports-stat-cards.tsx`

Responsavel por:

- mostrar receitas
- mostrar despesas
- mostrar saldo liquido

#### `monthly-trend-chart.tsx`

Responsavel por:

- renderizar a tendencia mensal com `Recharts`
- mostrar leitura clara em desktop e mobile
- exibir estado vazio quando nao houver historico suficiente

#### `reports-breakdown-section.tsx`

Responsavel por:

- renderizar breakdown de categorias
- mostrar total e percentual
- suportar `income` e `expense`

#### `reports-skeleton.tsx`

Responsavel por:

- compor o loading da rota `/reports`
- manter a percepcao visual premium durante carregamento

---

## Estrutura de Arquivos Esperada

```txt
src/
  app/
    (app)/
      reports/
        page.tsx
        loading.tsx
      dashboard/
        loading.tsx
      entries/
        loading.tsx
      categories/
        loading.tsx

  components/
    reports/
      reports-month-filter.tsx
      reports-stat-cards.tsx
      monthly-trend-chart.tsx
      reports-breakdown-section.tsx
      reports-skeleton.tsx
    ui/
      loading-skeleton.tsx

  lib/
    db/
      queries/
        reports.ts
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
- `getCategoryBreakdown(userId, start, end, type)`
- `getMonthRange(month)`

### Nova query da Sprint 5

Criar em `lib/db/queries/reports.ts`:

#### `getMonthlyTrend(userId, months)`

Responsavel por retornar os ultimos meses com agregacao por tipo.

Parametros esperados:

- `userId`
- `months`: quantidade de meses a considerar, por exemplo `6`

Retorno esperado por item:

- `month`
- `income`
- `expense`
- `balance`

Regras:

- considerar apenas lancamentos do usuario autenticado
- agrupar por mes
- incluir meses sem dados com zero quando necessario para manter o grafico consistente
- ordenar do mais antigo para o mais recente

Opcional dentro do mesmo arquivo:

- `getReportsSnapshot(userId, start, end)` para centralizar o carregamento da tela, se isso simplificar a composicao

---

## Estrategia de Implementacao

### Etapa 1: query de tendencia mensal

Criar `reports.ts` com `getMonthlyTrend(...)`.

O objetivo e preparar a camada analitica que falta para a tela de relatorios.

### Etapa 2: transformar `/reports` em tela real

Substituir o placeholder atual por uma tela server-side que:

1. leia `searchParams.month`
2. converta o mes em `start/end`
3. carregue resumo, tendencia e breakdowns em paralelo
4. renderize estados vazios corretos

### Etapa 3: grafico com `Recharts`

Adicionar `Recharts` ao projeto e implementar um grafico de tendencia mensal simples.

Escopo visual recomendado:

- linhas ou barras simples
- leitura rapida
- sem excesso de legenda ou controles

### Etapa 4: breakdowns em relatorios

Reaproveitar `getCategoryBreakdown(...)` para mostrar despesas e receitas em formato mais analitico dentro de `/reports`.

### Etapa 5: empty states melhores

Padronizar empty states nas principais telas privadas.

### Etapa 6: loading states

Adicionar `loading.tsx` nas rotas privadas principais e skeletons reutilizaveis.

### Etapa 7: polimento e responsividade

Revisar visual e comportamento responsivo em todo o fluxo principal do app.

### Etapa 8: atualizar textos stale

Corrigir textos de UI que ainda indicam sprints antigas ou estados desatualizados do produto.

### Etapa 9: verificacao final

Rodar:

- `npm run lint`
- `npm run build`

---

## Detalhes Tecnicos Importantes

### 1. Recharts entra nesta sprint

Diferente da Sprint 4, esta sprint passa a incluir grafico.

Decisao fechada:

- usar `Recharts` para a tendencia mensal em `/reports`

Motivo:

- a tela de relatorios e o lugar natural para visualizacao grafica
- a stack planejada ja previa `Recharts`
- o escopo pode continuar controlado usando apenas um grafico inicial

### 2. Reports continua server-side

A pagina `/reports` deve continuar como server component, buscando dados diretamente das queries.

O grafico com `Recharts` fica encapsulado em componente client apenas se necessario.

### 3. Reaproveitamento maximo

Reaproveitar ao maximo:

- `getMonthlySummary(...)`
- `getCategoryBreakdown(...)`
- `getMonthRange(...)`
- `formatCurrencyFromCents(...)`
- padroes visuais do dashboard e de entries

### 4. Escopo controlado do grafico

Nao transformar a Sprint 5 em uma sprint de BI.

Manter:

- um grafico principal
- uma leitura simples
- foco em utilidade real

---

## Regras de Negocio

1. relatorios mostram apenas dados do usuario autenticado
2. resumo respeita o mes selecionado
3. breakdown de despesas considera apenas `expense`
4. breakdown de receitas considera apenas `income`
5. tendencia mensal deve considerar apenas dados do usuario autenticado
6. meses sem dados devem continuar aparecendo de forma consistente quando isso for necessario para o grafico
7. estados vazios devem ser claros e diferentes de loading

---

## Criterios de Pronto

A Sprint 5 so deve ser considerada concluida quando:

1. `/reports` usar dados reais do banco
2. o mes puder ser alterado por query string
3. o resumo mensal aparecer corretamente em relatorios
4. a tendencia mensal funcionar com `Recharts`
5. os breakdowns de despesas e receitas funcionarem
6. existirem estados vazios claros nas telas principais
7. existirem loading states nas rotas principais privadas
8. o polimento visual e responsivo principal tiver sido aplicado
9. textos stale de sprint antiga tiverem sido corrigidos
10. `lint` e `build` passarem

---

## Testes Manuais Recomendados

### Relatorios

1. abrir `/reports`
2. trocar o mes
3. confirmar que cards mudam
4. confirmar que breakdowns mudam
5. confirmar que a tendencia mensal renderiza corretamente

### Estados vazios

1. usuario sem lancamentos
2. mes sem receitas
3. mes sem despesas
4. historico curto para tendencia

### Loading

1. navegar entre `dashboard`, `entries`, `categories` e `reports`
2. validar se o loading parece consistente e nao quebra layout

### Responsividade

1. validar `360px` ate desktop
2. validar grafico em tela pequena
3. validar legibilidade dos cards e listas

---

## Riscos da Sprint 5

1. exagerar no escopo dos relatorios
2. duplicar logica entre `dashboard` e `reports`
3. deixar o grafico pesado ou confuso no mobile
4. misturar polimento transversal com refactors desnecessarios

---

## Mitigacoes

1. limitar a sprint a um grafico principal
2. reaproveitar queries e componentes existentes sempre que fizer sentido
3. revisar mobile cedo, nao so no final
4. manter o polimento como etapa final da sprint

---

## Ordem Recomendada de Execucao

1. adicionar `Recharts`
2. criar `reports.ts` com query de tendencia mensal
3. implementar `/reports` com dados reais
4. conectar resumo mensal e breakdowns
5. implementar grafico de tendencia mensal
6. adicionar estados vazios melhores
7. adicionar loading states e skeletons
8. revisar responsividade e polimento visual
9. atualizar textos stale da UI
10. rodar `lint` e `build`

---

## Definicao de Pronto

A Sprint 5 estara pronta quando a rota `/reports` deixar de ser um placeholder e passar a ser uma visao analitica real do produto, complementando o dashboard com tendencia mensal, breakdowns mais orientados a leitura e uma experiencia geral mais polida no app.
