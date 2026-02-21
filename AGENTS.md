# AGENTS.md

## Contexto institucional
- Este repositorio apoia atividades do INPE/CCST (Divisao de Impactos, Adaptacao e Vulnerabilidades).
- Objetivo institucional: gerar conhecimento interdisciplinar para apoiar mitigacao/adaptacao e politicas publicas.

## Objetivo deste repositorio
- Manter e evoluir aplicacoes web de visualizacao geoespacial de pesquisas cientificas.
- Publicar artefatos estaticos em `docs/` para GitHub Pages.

## Regra critica (obrigatoria)
- PROIBIDO acessar `.ai/specs` em qualquer tarefa.
- Nao ler, nao listar, nao buscar, nao abrir, nao editar, nao mover, nao remover arquivos nesse diretorio.
- Comandos proibidos incluem (exemplos): `ls .ai/specs`, `find .ai/specs`, `rg .ai/specs`, `cat .ai/specs/...`.

## Mapa de diretorios
- `backend/`: pipeline de dados geoespaciais (SQL, GeoJSON, PBF, tiles, scripts Python/Node).
- `frontend/`: SPA principal legada (React + TypeScript + Material UI + Leaflet).
- `docs/`: saida de build para publicacao estica (ex.: `docs/frontend`).

## Fluxo tecnico ponta a ponta
1. Dados brutos geoespaciais entram no `backend`.
2. Scripts SQL/Python normalizam e agregam dados.
3. Dados vetoriais sao convertidos para `*.pbf` (geobuf/protobuf).
4. SPAs consomem `public/data/*.pbf` e textos de `public/locales/*/translation.json`.
5. Build das apps gera artefatos estaticos para `docs/<app>`.


## Stack atual por area
- Legado SPA: React 16, TypeScript, Material UI v4, Leaflet, i18next, geobuf.
- Backend dados: Node.js (scripts), Python (servicos/scripts), SQL/PostgreSQL/PostGIS.

## Guia de trabalho para agentes
- Antes de alterar codigo, identificar o modulo alvo e ler o `AGENTS.md` local correspondente.
- Em qualquer alteracao de dados/campos geoespaciais, validar impacto nas SPAs e na publicacao em `docs/`.

## Build/publicacao (diretriz)
- Estrutura esperada para GitHub Pages:
  - `docs/brazilsforestcode`
  - `docs/luccme` (quando aplicavel)

## Checklist minimo em mudancas relevantes
1. Regra de `.ai/specs` foi respeitada.
2. Modulo alterado esta coerente com sua responsabilidade.
3. Dados `public/data/*.pbf` continuam compativeis com os componentes de mapa.
4. Textos/localizacao permanecem consistentes em `public/locales`.
5. Estrutura de saida para `docs/` permanece valida para GitHub Pages.
