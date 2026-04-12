# Sprint 3 - Lancamentos

## Objetivo

Implementar o nucleo funcional de lancamentos financeiros do app, permitindo registrar, listar, editar, excluir e filtrar receitas e despesas com boa experiencia mobile-first.

Ao final da Sprint 3, o produto deve permitir uso real basico no dia a dia para captura e revisao de movimentacoes financeiras.

---

## Resultado Esperado

Ao final da Sprint 3, o usuario deve conseguir:

1. criar um lancamento de receita
2. criar um lancamento de despesa
3. listar lancamentos existentes
4. editar um lancamento
5. excluir um lancamento
6. filtrar por mes
7. filtrar por tipo
8. filtrar por categoria

O dashboard ainda pode continuar simples nesta sprint. O foco aqui e garantir que o fluxo de lancamentos funcione de ponta a ponta.

---

## Escopo da Sprint 3

### Incluido

1. tela de listagem de lancamentos
2. formulario de criacao de lancamento
3. formulario de edicao de lancamento
4. exclusao de lancamento
5. filtros por mes, tipo e categoria
6. integracao com as server actions ja criadas
7. uso real das queries de `entries`
8. validacao visual de erros
9. experiencia mobile-first

### Fora da Sprint 3

1. graficos avancados
2. dashboard final
3. relatorios completos
4. recorrencia
5. importacao CSV
6. anexos
7. orcamentos
8. parcelamento

---

## Dependencias Ja Prontas

Esta sprint parte do que ja foi concluido nas Sprints 1 e 2:

- autenticacao com Supabase
- guard server-side
- schema do banco criado
- RLS e policies aplicadas
- tabelas `profiles`, `categories` e `entries`
- validacoes Zod de `entries`
- queries base de `entries`
- server actions de `entries`
- categorias globais e personalizadas funcionando

---

## Objetivos Funcionais

### 1. Criar lancamento

O usuario deve conseguir criar um lancamento com:

- tipo: `income` ou `expense`
- categoria
- valor
- descricao
- data
- notas opcionais

### 2. Listar lancamentos

A tela deve mostrar:

- tipo
- valor
- descricao
- categoria
- data
- estado visual claro entre receita e despesa

### 3. Editar lancamento

O usuario deve poder editar:

- categoria
- tipo
- valor
- descricao
- data
- notas

### 4. Excluir lancamento

O usuario deve poder remover lancamentos proprios com seguranca.

### 5. Filtrar lancamentos

Filtros previstos:

- mes
- tipo
- categoria
- busca por descricao

---

## Fluxo de UX Esperado

### Fluxo principal mobile

1. abrir app
2. ir para `Lancamentos`
3. tocar em `Novo lancamento`
4. escolher `Receita` ou `Despesa`
5. preencher valor, categoria e descricao
6. salvar
7. voltar para a lista atualizada

### Fluxo de edicao

1. abrir lista
2. tocar no lancamento
3. editar campos
4. salvar
5. voltar com atualizacao visivel

### Fluxo de exclusao

1. abrir item
2. excluir
3. confirmar visualmente a remocao

---

## Telas da Sprint 3

### `/entries`

Tela principal de listagem.

Deve conter:

- cabecalho da pagina
- botao de novo lancamento
- filtros
- lista de lancamentos
- estados vazios
- mensagens de erro ou sucesso

### `/entries/new`

Tela de criacao.

Pode depois virar modal ou sheet, mas nesta sprint pode comecar como pagina dedicada.

### `/entries/[id]/edit`

Tela de edicao.

Deve reutilizar ao maximo o mesmo formulario da criacao.

---

## Estrutura Recomendada de Componentes

### Componentes de `entries`

Criar ou completar:

- `entry-form.tsx`
- `entry-list.tsx`
- `entry-filters.tsx`
- `entry-card.tsx`

### Responsabilidade de cada um

#### `entry-form.tsx`
Responsavel por:

- montar inputs
- exibir validacoes
- escolher categoria
- escolher tipo
- salvar

#### `entry-list.tsx`
Responsavel por:

- receber lista pronta
- renderizar agrupamentos simples ou lista direta
- lidar com estado vazio

#### `entry-filters.tsx`
Responsavel por:

- mes
- tipo
- categoria
- busca por descricao

#### `entry-card.tsx`
Responsavel por mostrar cada item com:

- descricao
- categoria
- data
- valor
- diferenciacao visual de receita/despesa

---

## Estrutura de Arquivos Esperada

```txt
src/
  app/
    (app)/
      entries/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx

  components/
    entries/
      entry-form.tsx
      entry-list.tsx
      entry-filters.tsx
      entry-card.tsx

  lib/
    db/
      queries/
        entries.ts
    validations/
      entry.ts

  actions/
    entries/
      create-entry.ts
      update-entry.ts
      delete-entry.ts
```

---

## Regras de Negocio

Estas regras ja existem em parte no backend e precisam ser respeitadas na UI:

1. `amount_cents` deve ser positivo
2. categoria deve existir
3. categoria deve estar visivel para o usuario
4. categoria nao pode estar arquivada
5. categoria deve ter o mesmo tipo do lancamento
6. tudo deve pertencer ao usuario autenticado
7. descricao e obrigatoria
8. notas sao opcionais

---

## Estrategia de Implementacao

### Etapa 1: UI base da pagina de lancamentos

Implementar `/entries` com:

- titulo
- botao `Novo lancamento`
- container visual consistente com o app shell

### Etapa 2: Filtros

Adicionar `entry-filters.tsx` com:

- seletor de mes
- seletor de tipo
- seletor de categoria
- busca textual

Nesta fase, os filtros podem usar query string.

Exemplo de parametros:

- `?month=2026-04`
- `?type=expense`
- `?categoryId=...`
- `?query=mercado`

### Etapa 3: Query real da listagem

Usar `listEntries(...)` para renderizar a lista real.

A tela `/entries` deve:

1. ler filtros da URL
2. converter mes em intervalo `start/end`
3. chamar a query
4. renderizar os resultados

### Etapa 4: Formulario de criacao

Implementar `/entries/new` usando `entry-form.tsx`.

O formulario deve:

- aceitar tipo
- carregar categorias visiveis
- receber valor
- descricao
- notas
- data

Ao submeter:

- chamar `createEntry`
- redirecionar para `/entries`
- mostrar feedback

### Etapa 5: Formulario de edicao

Implementar `/entries/[id]/edit`.

O fluxo deve:

- carregar lancamento por ID
- preencher formulario
- permitir atualizacao
- chamar `updateEntry`

### Etapa 6: Exclusao

Adicionar botao de exclusao na listagem ou na tela de edicao.

Ao excluir:

- chamar `deleteEntry`
- revalidar paginas
- redirecionar ou atualizar a lista

### Etapa 7: Estados e polimento minimo

Adicionar:

- estado vazio para lista sem lancamentos
- estado vazio filtrado
- mensagens de erro
- mensagens de sucesso
- feedback de campos invalidos

---

## Detalhes Tecnicos Importantes

### 1. Conversao de valor

A UI provavelmente vai trabalhar com valor monetario legivel, mas o banco usa `amount_cents`.

Entao a sprint precisa decidir uma abordagem clara:

#### Opcao recomendada
Receber no formulario um campo textual/numerico amigavel e converter para centavos no server layer.

Exemplo:
- `12,50` -> `1250`

Se quiser simplificar nesta sprint:
- usar input numerico com duas casas
- converter antes da action

### 2. Categorias por tipo

Quando o usuario escolher `income`, a lista de categorias deve mostrar so categorias `income`.

Quando escolher `expense`, deve mostrar so categorias `expense`.

### 3. Edicao segura

Ao editar, o backend ja precisa continuar garantindo:

- usuario so edita o que e dele
- categoria e valida
- tipo continua consistente

### 4. Filtros por mes

A UI deve converter um mes como `2026-04` em:

- inicio: `2026-04-01`
- fim: ultimo dia do mes

---

## Criterios de Pronto

A Sprint 3 so deve ser considerada concluida quando:

1. o usuario conseguir criar receitas e despesas
2. a listagem renderizar dados reais do banco
3. filtros funcionarem por mes, tipo e categoria
4. edicao funcionar
5. exclusao funcionar
6. validacoes visuais aparecerem corretamente
7. tudo funcionar no mobile sem quebra de layout
8. `lint` e `build` passarem

---

## Testes Manuais Recomendados

### Criacao
1. criar uma receita valida
2. criar uma despesa valida
3. tentar criar com descricao vazia
4. tentar criar com categoria incompativel

### Listagem
1. verificar se os itens aparecem ordenados por data
2. verificar diferenca visual entre receita e despesa
3. verificar estado vazio

### Filtros
1. filtrar por mes
2. filtrar por tipo
3. filtrar por categoria
4. buscar por texto

### Edicao
1. editar descricao
2. editar valor
3. trocar categoria
4. trocar tipo com categoria compativel

### Exclusao
1. excluir um lancamento
2. confirmar que saiu da lista

### Mobile
1. usar tela pequena
2. validar espacamentos
3. validar inputs
4. validar botao principal

---

## Riscos da Sprint 3

1. formulario ficar burocratico demais
2. conversao monetaria gerar inconsistencias
3. filtros ficarem confusos
4. UI desktop funcionar melhor que mobile
5. duplicar logica entre criacao e edicao

---

## Mitigacoes

1. usar um unico `entry-form.tsx`
2. centralizar conversao monetaria
3. manter filtros minimos e claros
4. testar mobile primeiro
5. reaproveitar as actions existentes

---

## Ordem Recomendada de Execucao

1. criar `entry-filters.tsx`
2. implementar `/entries` com query real
3. criar `entry-list.tsx`
4. criar `entry-card.tsx`
5. criar `entry-form.tsx`
6. implementar `/entries/new`
7. implementar `/entries/[id]/edit`
8. adicionar exclusao
9. revisar UX mobile
10. rodar `lint` e `build`

---

## Definicao de Pronto

A Sprint 3 estara pronta quando o app sair do estado de "infraestrutura pronta" e entrar no estado de "ja consigo registrar e revisar minhas movimentacoes financeiras reais".
