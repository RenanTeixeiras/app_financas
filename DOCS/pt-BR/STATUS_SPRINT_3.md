# Status da Sprint 3

## Visao Geral

A Sprint 3 teve como foco transformar o modulo de lancamentos no primeiro fluxo realmente utilizavel do app no dia a dia.

A base de backend para `entries` ja existia desde a Sprint 2, com schema, validacoes, queries e server actions prontas. Nesta sprint, o trabalho principal foi conectar essa base a uma interface funcional, mobile-first e consistente com o visual do produto.

Ao fim do que foi implementado ate agora, o usuario ja consegue registrar, visualizar, filtrar, editar e excluir lancamentos pela interface.

---

## Objetivo da Sprint 3

Implementar o nucleo funcional de lancamentos financeiros do app, permitindo:

- criar receitas
- criar despesas
- listar lancamentos reais do banco
- editar lancamentos existentes
- excluir lancamentos
- filtrar por mes
- filtrar por tipo
- filtrar por categoria
- buscar por descricao

O objetivo pratico desta sprint e tirar o modulo de `entries` do estado de placeholder e colocar o app no estado de uso real basico para registrar movimentacoes financeiras.

---

## Base Ja Existente Antes da Implementacao

Antes desta etapa, o projeto ja contava com:

- autenticacao com Supabase
- protecao server-side das rotas privadas
- schema de banco com `entries`
- validacoes Zod para lancamentos
- queries reais de lancamentos
- server actions para criar, editar e excluir
- validacao de categoria compativel com o tipo do lancamento
- RLS e policies ativas no banco

Ou seja, a infraestrutura funcional do backend de lancamentos ja estava pronta. O que faltava era a camada de interface e integracao ponta a ponta no app.

---

## O Que Foi Implementado

## 1. Pagina real de lancamentos em `/entries`

A rota `/entries`, que antes era apenas um placeholder visual, passou a funcionar como tela real de historico de movimentacoes.

Foi implementado:

- cabecalho da pagina
- botao de `Novo lancamento`
- leitura de filtros via query string
- integracao com `listEntries(...)`
- carregamento das categorias visiveis
- exibicao de feedback visual para sucesso e erro
- estado vazio sem lancamentos
- estado vazio com filtros aplicados

A tela agora usa dados reais do banco e se tornou o ponto principal de consulta do historico.

---

## 2. Filtros funcionais de lancamentos

Foi criada a estrutura de filtros da tela de `entries`, com suporte a:

- mes
- tipo
- categoria
- busca por descricao

Os filtros usam query string, permitindo URLs como:

- `?month=2026-04`
- `?type=expense`
- `?categoryId=...`
- `?query=mercado`

Tambem foi implementada a conversao de `month` para intervalo real de datas:

- inicio do mes
- ultimo dia do mes

Com isso, a listagem consegue consultar o banco corretamente usando `start` e `end`, sem mudar a API ja existente da query.

---

## 3. Componentes reutilizaveis de `entries`

Foram criados os componentes base do modulo:

### `entry-form.tsx`

Responsavel por:

- criar e editar lancamentos
- trocar tipo entre `income` e `expense`
- exibir categorias compativeis com o tipo selecionado
- receber valor, descricao, data e notas
- validar valor e categoria antes do submit
- reaproveitar a mesma estrutura para criacao e edicao

### `entry-filters.tsx`

Responsavel por:

- renderizar os filtros da listagem
- manter a interface de filtro simples
- limitar categorias conforme o tipo quando aplicavel

### `entry-list.tsx`

Responsavel por:

- receber a lista pronta de lancamentos
- renderizar estado vazio
- delegar a renderizacao de cada item para `entry-card.tsx`

### `entry-card.tsx`

Responsavel por:

- exibir cada lancamento de forma resumida
- mostrar descricao, categoria, data e valor
- diferenciar visualmente receita e despesa
- permitir navegacao para a tela de edicao

Esses componentes organizam o modulo e deixam a Sprint 3 pronta para refinamentos visuais futuros sem reescrever a base.

---

## 4. Tela de criacao em `/entries/new`

Foi criada a rota dedicada de criacao de lancamentos.

Essa tela agora:

- carrega categorias visiveis do usuario
- usa o `entry-form.tsx`
- chama a action `createEntry`
- redireciona de volta para `/entries`
- mostra mensagem de erro quando necessario
- mostra sucesso apos criacao

Com isso, o fluxo principal de captura de despesa e receita passou a existir de ponta a ponta.

---

## 5. Tela de edicao em `/entries/[id]/edit`

Foi criada a rota de edicao de lancamentos existentes.

Essa tela agora:

- carrega o lancamento por ID
- preenche o formulario com os dados atuais
- reutiliza `entry-form.tsx`
- chama a action `updateEntry`
- redireciona para a lista apos salvar
- mostra mensagem de erro quando necessario

Tambem foi adicionada uma area dedicada para exclusao do lancamento nesta tela.

---

## 6. Exclusao pela tela de edicao

A exclusao foi implementada apenas em `/entries/[id]/edit`, conforme decisao da sprint.

O fluxo ficou assim:

- abrir o lancamento
- visualizar bloco separado de exclusao
- executar `deleteEntry`
- redirecionar para `/entries`
- exibir feedback de sucesso

Essa abordagem manteve a lista mais limpa e evitou excesso de acoes destrutivas diretamente na tela principal.

---

## 7. Campo monetario amigavel

Uma decisao importante da Sprint 3 foi adotar um campo amigavel para valor monetario.

Foi implementado:

- input pensado para uso em reais
- formatacao amigavel durante digitacao
- conversao para `amountCents` antes do envio
- preenchimento correto do valor ao editar um lancamento

Exemplo da logica:

- entrada amigavel: `12,50`
- valor persistido: `1250`

Com isso, a UI ficou mais natural para o usuario final, sem abrir mao da modelagem correta do banco em centavos inteiros.

---

## 8. Utilitarios de moeda e data

Para evitar logica duplicada, foram criados utilitarios em `lib/utils` para:

- formatar valor em moeda
- converter input amigavel para centavos
- preencher input de edicao a partir de `amountCents`
- calcular intervalo de datas do mes selecionado
- formatar datas da listagem

Isso centraliza regras de apresentacao importantes da Sprint 3 e reduz risco de inconsistencias.

---

## 9. Ajuste de conexao local com banco

Durante a implementacao, apareceu um problema de runtime local ao acessar queries reais de lancamentos.

Causa identificada:

- `DATABASE_URL` usava a conexao direta do Supabase
- no ambiente local, o host resolvia para IPv6
- isso gerava erro de rede `ENETUNREACH`

Para resolver isso, foi introduzida a variavel:

- `DATABASE_LOCAL_URL`

Regra aplicada:

- em desenvolvimento local, o app prioriza `DATABASE_LOCAL_URL`
- em producao, continua usando `DATABASE_URL`
- migrations continuam separadas em `DATABASE_MIGRATE_URL`

Na pratica, `DATABASE_LOCAL_URL` pode usar o mesmo valor do pooler configurado em `DATABASE_MIGRATE_URL`, mas com papel semantico diferente: runtime local, nao migration.

Esse ajuste estabilizou o acesso ao banco durante o desenvolvimento.

---

## 10. Correcao do erro `NEXT_REDIRECT`

Apos implementar create/update/delete, apareceu um comportamento em que:

- a action funcionava
- o redirecionamento acontecia
- mas tambem aparecia uma notificacao vermelha com `NEXT_REDIRECT`

Causa:

- `redirect()` estava dentro de blocos `try/catch`
- o Next usa `redirect()` internamente como excecao especial
- essa excecao estava sendo capturada como se fosse erro de negocio

Correcao aplicada:

- `redirect()` de sucesso foi movido para fora do `try/catch`
- o `catch` ficou responsavel apenas pelo redirecionamento de erro

Esse ajuste foi feito no fluxo de `entries` e tambem na tela de `categories`, para manter consistencia no app.

---

## Arquivos Criados na Sprint 3

### Componentes

- `app/src/components/entries/entry-form.tsx`
- `app/src/components/entries/entry-filters.tsx`
- `app/src/components/entries/entry-list.tsx`
- `app/src/components/entries/entry-card.tsx`

### Rotas

- `app/src/app/(app)/entries/new/page.tsx`
- `app/src/app/(app)/entries/[id]/edit/page.tsx`

### Utilitarios

- `app/src/lib/utils/currency.ts`
- `app/src/lib/utils/date.ts`

---

## Arquivos Alterados na Sprint 3

- `app/src/app/(app)/entries/page.tsx`
- `app/src/app/(app)/categories/page.tsx`
- `app/src/lib/db/client.ts`
- `app/.env.example`

Tambem houve ajuste no `.env` local para incluir:

- `DATABASE_LOCAL_URL`

---

## Fluxos Ja Funcionando

Com o que foi entregue ate agora, o usuario ja consegue:

1. abrir a tela de lancamentos
2. ver lancamentos reais do banco
3. filtrar por mes
4. filtrar por tipo
5. filtrar por categoria
6. buscar por descricao
7. criar uma receita
8. criar uma despesa
9. editar um lancamento
10. excluir um lancamento pela tela de edicao

Esse conjunto ja cobre o fluxo principal da Sprint 3.

---

## Validacoes e Garantias Mantidas

A interface foi implementada respeitando as regras de negocio existentes no backend:

- `amount_cents` precisa ser positivo
- descricao e obrigatoria
- categoria precisa existir
- categoria precisa estar visivel para o usuario
- categoria nao pode estar arquivada
- categoria precisa ter o mesmo tipo do lancamento
- o usuario so manipula dados proprios

Ou seja, a Sprint 3 conectou a UI sem quebrar as garantias ja construidas na Sprint 2.

---

## Verificacao Tecnica

Apos as implementacoes e correcoes, foi validado que:

- `npm run lint` passa
- `npm run build` passa

Isso confirma que a sprint esta consistente do ponto de vista de tipagem, rotas e compilacao.

---

## Estado Atual da Sprint 3

Neste momento, a Sprint 3 esta em estado funcional forte.

Ja existe:

- CRUD de lancamentos pela interface
- filtros principais
- integracao real com banco
- experiencia base mobile-first
- conversao monetaria amigavel
- feedback visual de sucesso e erro

O modulo de `entries` deixou de ser placeholder e passou a ser uma parte real do produto.

---

## O Que Ainda Vale Refinar Dentro da Sprint 3

Mesmo com o nucleo implementado, ainda existem refinamentos possiveis:

- testes manuais completos com mais cenarios reais
- polimento visual adicional em estados vazios e mensagens
- possivel refinamento de UX mobile em telas pequenas
- atualizacao de textos antigos do app que ainda mencionam Sprint 1 ou Sprint 2

Esses pontos nao bloqueiam o uso do fluxo principal, mas podem melhorar acabamento e consistencia.

---

## Conclusao

A Sprint 3 avancou o projeto da fase de infraestrutura pronta para a fase de uso funcional real no modulo mais importante do MVP: lancamentos.

O app agora ja permite registrar e revisar movimentacoes financeiras de forma pratica, usando banco real, regras reais e interface integrada ao restante da aplicacao.

Esse passo prepara o terreno para as proximas etapas do MVP, especialmente dashboard e relatorios com dados reais.

### Ajuste importante de robustez nos filtros

Foi corrigido um caso em que parametros vazios na query string, como
`type=`, `categoryId=` e `query=`, eram tratados como valores invalidos
em vez de ausentes.

Correcao aplicada:
- normalizacao de strings vazias para `undefined` antes do `safeParse`
- preservacao do `month` valido mesmo quando outros filtros vinham vazios
- eliminacao de falso aviso de filtros invalidos em URLs legitimas

Exemplo que passou a funcionar corretamente:
`/entries?month=2026-05&type=&categoryId=&query=`