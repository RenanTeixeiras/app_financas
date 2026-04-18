# Sprint 6 - Finalizacao do MVP

## Objetivo

Finalizar o MVP do `app_financas` com foco em experiencia instalavel no celular, acabamento visual, acessibilidade, performance percebida e preparacao de deploy.

Ao final da Sprint 6, o produto deve estar pronto para ser considerado um MVP funcional e apresentavel, com os modulos principais implementados e com uma camada final de refinamento tecnico e visual.

---

## Resultado Esperado

Ao final da Sprint 6, o usuario deve conseguir:

1. instalar o app como PWA no celular
2. ver icones e identidade corretos ao instalar o app
3. usar a aplicacao com microinteracoes mais refinadas
4. navegar com foco visivel e melhor acessibilidade nas telas principais
5. perceber uma experiencia mais fluida nas rotas principais
6. usar um produto pronto para deploy final

---

## Escopo da Sprint 6

### Incluido

1. refinamento final de PWA
2. manifesto final do app
3. icones do app para instalacao
4. metadata mobile final
5. refino de microinteracoes
6. revisao de acessibilidade
7. revisao de performance percebida
8. checklist de deploy final
9. atualizacao da documentacao final da sprint

### Fora da Sprint 6

1. `service worker`
2. offline robusto
3. sincronizacao offline
4. novo modulo funcional
5. `/settings` completo
6. exportacao
7. refactors grandes de arquitetura

---

## Decisao Fechada Para PWA

Nesta sprint, o projeto vai seguir com:

- PWA instalavel com manifesto e icones
- sem offline robusto
- sem `service worker`

Motivo:

- menor risco tecnico
- menor custo de manutencao
- entrega mais focada no acabamento real do MVP
- suficiente para a proposta atual do produto

Em outras palavras, o objetivo desta sprint nao e transformar o app em um produto offline-first, e sim fechar corretamente a experiencia instalavel e o acabamento final da aplicacao.

---

## Base Ja Existente Antes da Implementacao

Antes desta sprint, o projeto ja conta com:

- autenticacao com Supabase
- `entries` funcional
- `dashboard` funcional
- `reports` funcional
- layout privado responsivo
- `manifest.ts` base
- `favicon.ico`
- loading states nas principais rotas privadas

Ou seja, o MVP funcional ja existe. O que falta agora e lapidar a entrega final e consolidar a experiencia de produto.

---

## Objetivos Funcionais

### 1. PWA instalavel

O app deve ficar corretamente configurado para instalacao no celular.

Isso inclui:

- manifesto consistente
- nome e descricao corretos
- `start_url` correto
- `display` adequado
- `theme_color` e `background_color`
- icones de instalacao
- suporte a `apple-touch-icon`

### 2. Metadata final do app

Revisar a metadata principal do projeto para melhorar:

- identidade do app
- comportamento em navegadores mobile
- consistencia visual ao instalar e abrir

### 3. Microinteracoes

Refinar microinteracoes nas telas principais para melhorar a sensacao de produto finalizado.

Aplicar principalmente em:

- botoes
- cards clicaveis
- filtros
- estados hover
- estados focus
- estados active
- transitions sutis entre blocos

### 4. Acessibilidade

Revisar as telas centrais do app para melhorar:

- contraste
- foco visivel
- semantica basica
- navegacao por teclado
- clareza de labels e titulos
- usabilidade de formularios

### 5. Performance percebida

Revisar pontos que possam prejudicar a fluidez do app, com foco em:

- navegacao entre rotas
- custo visual excessivo
- comportamento mobile
- peso do grafico em `reports`
- renderizacao desnecessaria no client

### 6. Preparacao para deploy

Fechar a sprint com checklist de deploy revisado, garantindo:

- variaveis de ambiente claras
- integracao de auth consistente
- banco funcionando como esperado
- estrutura pronta para `Vercel + Supabase`

---

## Fluxo de UX Esperado

### Fluxo de instalacao

1. abrir o app no celular
2. instalar o app na tela inicial
3. abrir o app como experiencia standalone
4. perceber identidade visual consistente

### Fluxo de uso diario

1. abrir o app instalado
2. navegar com rapidez entre dashboard, lancamentos, categorias e relatorios
3. perceber feedback visual claro nas interacoes
4. usar o produto com acabamento mais proximo de app real

---

## Areas Prioritarias da Sprint 6

### 1. PWA

Revisar:

- `manifest.ts`
- metadata do layout raiz
- icones do app
- configuracao de instalacao

### 2. Acessibilidade

Prioridade de revisao:

1. `entries`
2. `dashboard`
3. `reports`
4. `categories`
5. landing

### 3. Performance

Foco em:

- fluidez percebida
- sem regressao visual
- sem excesso de refactor

### 4. Deploy

Foco em:

- consistencia de ambiente
- autenticacao
- banco
- publicacao final

---

## Estrutura Recomendada de Arquivos

```txt
src/
  app/
    manifest.ts
    layout.tsx
    icon.png
    apple-icon.png
    favicon.ico

  components/
    ...

  lib/
    ...

public/
  ... (caso os icones sejam colocados aqui)
```

---

## Estrategia de Implementacao

### Etapa 1: manifesto e metadata

Revisar e completar:

- `manifest.ts`
- metadata do `layout.tsx`

### Etapa 2: icones do app

Adicionar os icones necessarios para PWA instalavel.

### Etapa 3: validacao de instalacao

Conferir se a experiencia instalada abre de forma coerente e com identidade visual correta.

### Etapa 4: microinteracoes

Aplicar refinamentos sutis nas interacoes principais.

### Etapa 5: acessibilidade

Fazer uma revisao pragmatica nas telas centrais, corrigindo problemas claros de foco, semantica, contraste e labels.

### Etapa 6: performance

Fazer uma revisao pragmatica de fluidez percebida e remover pontos de custo visual desnecessario.

### Etapa 7: checklist de deploy

Consolidar o que precisa estar correto para subir o app em producao.

### Etapa 8: verificacao final

Rodar:

- `npm run lint`
- `npm run build`

---

## Detalhes Tecnicos Importantes

### 1. Sem `service worker`

Esta sprint nao deve introduzir `service worker`.

Motivo:

- evita complexidade extra
- evita cache dificil de depurar
- mantem a sprint final focada no que agrega mais valor agora

### 2. PWA com escopo controlado

O objetivo e entregar:

- instalacao
- identidade visual
- boa experiencia standalone

Nao e objetivo entregar:

- offline-first
- sincronizacao local
- cache sofisticado

### 3. Acessibilidade pragmatica

A revisao de acessibilidade deve focar no que gera ganho real imediato:

- foco
- contraste
- labels
- navegacao por teclado
- semantica principal

### 4. Performance sem refactor grande

A sprint deve priorizar ajustes pequenos e seguros, em vez de abrir mudancas estruturais grandes perto da entrega final.

---

## Regras de Negocio

1. o app continua mostrando apenas dados do usuario autenticado
2. a finalizacao do PWA nao deve alterar a logica funcional dos modulos ja prontos
3. a sprint nao deve introduzir comportamento offline que mude regras de persistencia
4. acessibilidade e performance devem ser melhoradas sem regressao funcional

---

## Criterios de Pronto

A Sprint 6 so deve ser considerada concluida quando:

1. o app estiver corretamente configurado como PWA instalavel
2. o manifesto estiver finalizado
3. os icones do app estiverem configurados
4. a metadata mobile estiver revisada
5. microinteracoes principais estiverem refinadas
6. a acessibilidade das telas centrais tiver sido revisada
7. a performance percebida tiver sido revisada sem regressao evidente
8. o checklist de deploy final estiver consolidado
9. `lint` e `build` passarem
10. a documentacao da sprint estiver atualizada

---

## Testes Manuais Recomendados

### PWA

1. abrir o app no celular
2. instalar na tela inicial
3. abrir como app standalone
4. validar icone, nome e cor

### Acessibilidade

1. navegar por teclado nas telas principais
2. validar foco visivel
3. validar formularios e labels
4. validar contraste em dark mode

### Performance

1. navegar entre `dashboard`, `entries`, `categories` e `reports`
2. validar fluidez no mobile
3. validar comportamento do grafico de `reports`

### Deploy

1. revisar variaveis de ambiente
2. validar login
3. validar callback de auth
4. validar acesso ao banco

---

## Riscos da Sprint 6

1. tentar colocar offline robusto tarde demais
2. exagerar em animacao e perder clareza
3. abrir refactors grandes perto do fechamento do MVP
4. mexer em performance sem foco e introduzir regressao

---

## Mitigacoes

1. manter PWA com escopo controlado
2. usar microinteracoes sutis
3. priorizar mudancas pequenas e seguras
4. validar sempre com `lint`, `build` e testes manuais objetivos

---

## Ordem Recomendada de Execucao

1. revisar `manifest.ts`
2. revisar metadata em `layout.tsx`
3. adicionar icones do app
4. validar instalacao PWA
5. revisar acessibilidade das telas principais
6. aplicar refinamentos de microinteracao
7. revisar performance percebida
8. consolidar checklist de deploy
9. rodar `lint` e `build`
10. atualizar documentacao final

---

## Definicao de Pronto

A Sprint 6 estara pronta quando o `app_financas` deixar de ser apenas um MVP funcional e passar a ser um MVP finalizado para entrega, com experiencia instalavel no celular, acabamento consistente, acessibilidade revisada, performance validada e deploy preparado.
