# Frontend - BrazilsForestCode SPA

[English](#english) | [Português](#português)

## English

### Overview
This folder contains the legacy geospatial SPA used by INPE/CCST projects.

Current stack:
1. React 16 + TypeScript
2. Material UI v4
3. Leaflet
4. i18next
5. geobuf/protobuf (`*.pbf`)

### Prerequisites
1. Node.js `14.19.1` (see `engines` in `package.json`).
2. npm.

### Install
```bash
cd frontend
npm install
```

Optional setup script:
```bash
npm run dev:install
```

### Available Commands
1. `npm start`: runs the app in development mode (`http://localhost:3000`).
2. `npm test`: runs tests in watch mode.
3. `npm run build`: creates production build artifacts.
4. `npm run prettier:check`: checks formatting.
5. `npm run prettier:format`: formats project files.

### Data and Localization Inputs
1. Vector data (protobuf): `frontend/public/data/*.pbf`
2. Translations:
   - `frontend/public/locales/en/translation.json`
   - `frontend/public/locales/pt/translation.json`

When updating data attributes or layers, review:
1. `frontend/src/components/Leaflet/feature.service.ts`
2. `frontend/src/store`

### Publishing Notes
Build artifacts are published as static files under `docs/` at repository root, including:
1. `docs/brazilsforestcode`
2. `docs/luccme`

For full data pipeline documentation (backend -> frontend -> docs), see `README.md` at repository root.

---

## Português

### Visão Geral
Esta pasta contém a SPA geoespacial legada usada nos projetos do INPE/CCST.

Stack atual:
1. React 16 + TypeScript
2. Material UI v4
3. Leaflet
4. i18next
5. geobuf/protobuf (`*.pbf`)

### Pré-requisitos
1. Node.js `14.19.1` (veja `engines` no `package.json`).
2. npm.

### Instalação
```bash
cd frontend
npm install
```

Script opcional de setup:
```bash
npm run dev:install
```

### Comandos Disponíveis
1. `npm start`: executa a aplicação em modo de desenvolvimento (`http://localhost:3000`).
2. `npm test`: executa testes em modo watch.
3. `npm run build`: gera artefatos de build para produção.
4. `npm run prettier:check`: valida formatação.
5. `npm run prettier:format`: formata arquivos do projeto.

### Entradas de Dados e Localização
1. Dados vetoriais (protobuf): `frontend/public/data/*.pbf`
2. Traduções:
   - `frontend/public/locales/en/translation.json`
   - `frontend/public/locales/pt/translation.json`

Ao alterar atributos de dados ou camadas, revise:
1. `frontend/src/components/Leaflet/feature.service.ts`
2. `frontend/src/store`

### Notas de Publicação
Os artefatos de build são publicados como arquivos estáticos em `docs/` na raiz do repositório, incluindo:
1. `docs/brazilsforestcode`
2. `docs/luccme`

Para a documentação completa do pipeline (backend -> frontend -> docs), consulte o `README.md` da raiz.
