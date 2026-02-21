# INPE Geospatial Web Apps - Publish Static

[English](#english) | [Português](#português)

## English

### Overview
This repository supports INPE/CCST activities focused on geospatial web visualization for scientific research.

Main goal:
1. Process geospatial data in `backend/`.
2. Serve and evolve frontend SPAs in `frontend/`.
3. Publish static artifacts to GitHub Pages in `docs/`.

### Repository Map
1. `backend/`: geospatial data pipelines (SQL, Python, Node.js, GeoJSON, PBF, tiles).
2. `frontend/`: legacy SPA (React + TypeScript + Material UI + Leaflet).
3. `docs/`: static output for publication (for example, `docs/brazilsforestcode` and `docs/luccme`).

### End-to-End Flow
1. Raw geospatial datasets are ingested in `backend/`.
2. SQL/Python scripts normalize and aggregate the data.
3. Vector data is converted to `*.pbf` (geobuf/protobuf).
4. SPAs consume `public/data/*.pbf` and translations from `public/locales/*/translation.json`.
5. Build output is published to `docs/<app>`.

### Prerequisites
1. Docker and Docker Compose.
2. Python/Conda environment for `backend/preparar-dados`.
3. Node.js for frontend and simplification scripts.

### Backend Data Preparation (`backend/preparar-dados`)
Run:

```bash
cd backend/preparar-dados
make install_dependecies
make conda_info
make conda_env_create
make conda_env_list
make conda_init
```

Load shapefile data into PostgreSQL and execute the pipeline:

```bash
cd backend/preparar-dados
make docker_up
./data/psql/linux/backup2pgrestore.sh
make run
```

If you need to run the main script directly:

```bash
cd backend/preparar-dados
docker compose up -d
python main.py
```

### Data Simplification and PBF Generation (`backend/simplificar-dados`)
The script `backend/simplificar-dados/src/index.js` currently uses hardcoded input directories. Update them to your local data path before execution.

Current simplification flow:
1. Geometry simplification (external GIS step, documented in code comments).
2. Decimal precision reduction via `removeDecimaisGeoJsonProperties`.
3. Protobuf generation via `geoJsonToProtobuf`.

Run:

```bash
cd backend/simplificar-dados
npm install
npm start
```

After generation:
1. Copy resulting `.pbf` files to `frontend/public/data`.
2. If needed, adjust data imports in `frontend/src/components/Leaflet/feature.service.ts`.
3. If needed, adapt attribute names and mapping logic in `frontend/src/store`.

### Publishing Structure (`docs/`)
Expected static outputs include:
1. `docs/brazilsforestcode`
2. `docs/luccme`

### Compatibility Checklist
1. `public/data/*.pbf` remains compatible with map components.
2. Localization files stay consistent in `public/locales`.
3. GitHub Pages output structure under `docs/` remains valid.

---

## Português

### Visão Geral
Este repositório apoia atividades do INPE/CCST voltadas à visualização geoespacial de pesquisas científicas.

Objetivo principal:
1. Processar dados geoespaciais em `backend/`.
2. Manter e evoluir SPAs em `frontend/`.
3. Publicar artefatos estáticos para GitHub Pages em `docs/`.

### Mapa do Repositório
1. `backend/`: pipelines de dados geoespaciais (SQL, Python, Node.js, GeoJSON, PBF, tiles).
2. `frontend/`: SPA legada (React + TypeScript + Material UI + Leaflet).
3. `docs/`: saída estática para publicação (por exemplo, `docs/brazilsforestcode` e `docs/luccme`).

### Fluxo Ponta a Ponta
1. Dados geoespaciais brutos entram no `backend/`.
2. Scripts SQL/Python normalizam e agregam os dados.
3. Dados vetoriais são convertidos para `*.pbf` (geobuf/protobuf).
4. As SPAs consomem `public/data/*.pbf` e traduções de `public/locales/*/translation.json`.
5. O resultado de build é publicado em `docs/<app>`.

### Pré-requisitos
1. Docker e Docker Compose.
2. Ambiente Python/Conda para `backend/preparar-dados`.
3. Node.js para frontend e scripts de simplificação.

### Preparação de Dados no Backend (`backend/preparar-dados`)
Execute:

```bash
cd backend/preparar-dados
make install_dependecies
make conda_info
make conda_env_create
make conda_env_list
make conda_init
```

Carregue os dados de shapefile no PostgreSQL e execute o pipeline:

```bash
cd backend/preparar-dados
make docker_up
./data/psql/linux/backup2pgrestore.sh
make run
```

Se precisar executar o script principal diretamente:

```bash
cd backend/preparar-dados
docker compose up -d
python main.py
```

### Simplificação de Dados e Geração de PBF (`backend/simplificar-dados`)
O script `backend/simplificar-dados/src/index.js` usa diretórios de entrada fixos no código. Ajuste esses caminhos para o seu ambiente antes de executar.

Fluxo atual de simplificação:
1. Simplificação de geometria (etapa externa em GIS, documentada nos comentários do código).
2. Redução de casas decimais com `removeDecimaisGeoJsonProperties`.
3. Geração de protobuf com `geoJsonToProtobuf`.

Execute:

```bash
cd backend/simplificar-dados
npm install
npm start
```

Após gerar os arquivos:
1. Copie os `.pbf` para `frontend/public/data`.
2. Se necessário, ajuste importações em `frontend/src/components/Leaflet/feature.service.ts`.
3. Se necessário, adapte nomes de atributos e regras de mapeamento em `frontend/src/store`.

### Estrutura de Publicação (`docs/`)
As saídas estáticas esperadas incluem:
1. `docs/brazilsforestcode`
2. `docs/luccme`

### Checklist de Compatibilidade
1. `public/data/*.pbf` continua compatível com os componentes de mapa.
2. Arquivos de localização permanecem consistentes em `public/locales`.
3. Estrutura de saída em `docs/` permanece válida para GitHub Pages.
