# Preparação dos Dados Espaciais

### 1. Configurar o ambiente conforme o arquivo `Makefile`:

```bash
cd backend/preparar-dados

make install_dependecies

make conda_info

make conda_env_create

make conda_env_list

conda_init
```


### 2. Executar o script para extrair os dados do `Shapefile` para o `PostgreSQL`.

```bash
cd backend/preparar-dados

make docker_up

./data/psql/linux/backup2pgrestore.sh

make run
```


### 3. Calcular porcentagem dos valores por: Brasil, Biomas e Estados

Para agregar os dados é necessário manipular os scripts Python (os dados possuem atributos diferentes)

* backend/preparar-dados/main.py


```
cd backend/preparar-dados

docker compose up -d

python main.py
```


### 3. Simplificar dados

Para simplificar os dados é necessário editar o diretório de origem dos dados no script `index.js`

* backend/simplificar-dados/src/index.js


1. Simplificar geometrias `0,19` https://gis.stackexchange.com/questions/25914/smoothing-generalizing-polygon-in-qgis


2. Simplificar casas decimais `removeDecimaisGeoJsonProperties`

3. Gerar Protobuf `geoJsonToProtobuf`

4. Os dados em Protobuf devem ser salvos no diretório `public` do front-end.

`frontend/public/data`

5. Manipular importações dos dados no arquivo (se necessário):

`frontend/src/components/Leaflet/feature.service.ts`

6. Manipular nome dos atributos dos dados no arquivo+

`frontend/src/store`
