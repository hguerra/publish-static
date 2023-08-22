-- https://gis.stackexchange.com/questions/404386/converting-from-multipolygon-to-polygon-in-postgis
-- Retorna apenas o primeiro poligono
select
	*,
	ST_GeometryN(pgeom,
	1)
from
	luccme_2000
where
	id = 1;

-- http://www.codedirection.com/convert-multipolygon-geometry/
-- https://www.ti-enxame.com/pt/postgresql/postgis-converte-multipoligono-em-poligono-unico/1045438121/
select
	*,
	ST_GeometryN(pgeom, generate_series(1, ST_NumGeometries(pgeom))) as geom
from
	luccme_2000
where id = 1;

-- Computar valores
select *, st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), 5880), 4326) as geom from luccme_2000;

-- public.luccme definition
DROP TABLE public.luccme;
CREATE TABLE public.luccme (
  id serial NOT NULL,
  "name" varchar NULL,
  "year" int4 NULL,
  description varchar NULL,
  scenario_name varchar NULL,
  scenario_description varchar NULL,
  external_id varchar NULL,
  col float8 NULL,
  "row" float8 NULL,
  veg float8 NULL,
  pastp float8 NULL,
  agric float8 NULL,
  mosc float8 NULL,
  fores float8 NULL,
  "others" float8 NULL,
  geom_type varchar NULL,
  pgeom geometry(multipolygon, 5880) NULL,
  geom geometry(polygon, 4326) NULL,
  CONSTRAINT luccme_pkey PRIMARY KEY (id)
);

-- Inserir valores
insert into luccme("name", "year", "description", "scenario_name", "scenario_description", "col", "veg", "pastp", "mosc", "fores", "others", "row", "agric", "external_id", geom_type, pgeom, geom)
select "name", "year", "description", "scenario_name", "scenario_description", "col", "veg", "pastp", "mosc", "fores", "others", "row", "agric", "external_id", geom_type, pgeom, st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), 5880), 4326) from luccme_2010;


-- Index
CREATE INDEX luccme_pgeom_geom_idx ON public.luccme USING gist (pgeom);
CREATE INDEX luccme_geom_geom_idx ON public.luccme USING gist (geom);
CREATE INDEX luccme_external_id_idx ON public.luccme (external_id);
CREATE INDEX luccme_year_idx ON public.luccme ("year");
CREATE INDEX luccme_scenario_name_idx ON public.luccme ("scenario_name");

-- Junção
select distinct "scenario_name" from "luccme";
select distinct "year" from "luccme" order by "year";

-- public.luccme_shared_geom definition
DROP TABLE public.luccme_shared_geom;
CREATE TABLE public.luccme_shared_geom (
  "id" serial NOT NULL,
  "external_id" varchar NOT NULL,
  "geom" geometry(polygon, 4326) NULL,

  -- ssp1
  "ssp1_description_2000" varchar NULL,
  "ssp1_scenario_name_2000" varchar NULL,
  "ssp1_scenario_description_2000" varchar NULL,
  "ssp1_veg_2000" float8 NULL,
  "ssp1_pastp_2000" float8 NULL,
  "ssp1_agric_2000" float8 NULL,
  "ssp1_mosc_2000" float8 NULL,
  "ssp1_fores_2000" float8 NULL,
  "ssp1_others_2000" float8 NULL,

  "ssp1_description_2010" varchar NULL,
  "ssp1_scenario_name_2010" varchar NULL,
  "ssp1_scenario_description_2010" varchar NULL,
  "ssp1_veg_2010" float8 NULL,
  "ssp1_pastp_2010" float8 NULL,
  "ssp1_agric_2010" float8 NULL,
  "ssp1_mosc_2010" float8 NULL,
  "ssp1_fores_2010" float8 NULL,
  "ssp1_others_2010" float8 NULL,

  "ssp1_description_2012" varchar NULL,
  "ssp1_scenario_name_2012" varchar NULL,
  "ssp1_scenario_description_2012" varchar NULL,
  "ssp1_veg_2012" float8 NULL,
  "ssp1_pastp_2012" float8 NULL,
  "ssp1_agric_2012" float8 NULL,
  "ssp1_mosc_2012" float8 NULL,
  "ssp1_fores_2012" float8 NULL,
  "ssp1_others_2012" float8 NULL,

  "ssp1_description_2014" varchar NULL,
  "ssp1_scenario_name_2014" varchar NULL,
  "ssp1_scenario_description_2014" varchar NULL,
  "ssp1_veg_2014" float8 NULL,
  "ssp1_pastp_2014" float8 NULL,
  "ssp1_agric_2014" float8 NULL,
  "ssp1_mosc_2014" float8 NULL,
  "ssp1_fores_2014" float8 NULL,
  "ssp1_others_2014" float8 NULL,

  "ssp1_description_2015" varchar NULL,
  "ssp1_scenario_name_2015" varchar NULL,
  "ssp1_scenario_description_2015" varchar NULL,
  "ssp1_veg_2015" float8 NULL,
  "ssp1_pastp_2015" float8 NULL,
  "ssp1_agric_2015" float8 NULL,
  "ssp1_mosc_2015" float8 NULL,
  "ssp1_fores_2015" float8 NULL,
  "ssp1_others_2015" float8 NULL,

  "ssp1_description_2020" varchar NULL,
  "ssp1_scenario_name_2020" varchar NULL,
  "ssp1_scenario_description_2020" varchar NULL,
  "ssp1_veg_2020" float8 NULL,
  "ssp1_pastp_2020" float8 NULL,
  "ssp1_agric_2020" float8 NULL,
  "ssp1_mosc_2020" float8 NULL,
  "ssp1_fores_2020" float8 NULL,
  "ssp1_others_2020" float8 NULL,

  "ssp1_description_2025" varchar NULL,
  "ssp1_scenario_name_2025" varchar NULL,
  "ssp1_scenario_description_2025" varchar NULL,
  "ssp1_veg_2025" float8 NULL,
  "ssp1_pastp_2025" float8 NULL,
  "ssp1_agric_2025" float8 NULL,
  "ssp1_mosc_2025" float8 NULL,
  "ssp1_fores_2025" float8 NULL,
  "ssp1_others_2025" float8 NULL,

  "ssp1_description_2030" varchar NULL,
  "ssp1_scenario_name_2030" varchar NULL,
  "ssp1_scenario_description_2030" varchar NULL,
  "ssp1_veg_2030" float8 NULL,
  "ssp1_pastp_2030" float8 NULL,
  "ssp1_agric_2030" float8 NULL,
  "ssp1_mosc_2030" float8 NULL,
  "ssp1_fores_2030" float8 NULL,
  "ssp1_others_2030" float8 NULL,

  "ssp1_description_2035" varchar NULL,
  "ssp1_scenario_name_2035" varchar NULL,
  "ssp1_scenario_description_2035" varchar NULL,
  "ssp1_veg_2035" float8 NULL,
  "ssp1_pastp_2035" float8 NULL,
  "ssp1_agric_2035" float8 NULL,
  "ssp1_mosc_2035" float8 NULL,
  "ssp1_fores_2035" float8 NULL,
  "ssp1_others_2035" float8 NULL,

  "ssp1_description_2040" varchar NULL,
  "ssp1_scenario_name_2040" varchar NULL,
  "ssp1_scenario_description_2040" varchar NULL,
  "ssp1_veg_2040" float8 NULL,
  "ssp1_pastp_2040" float8 NULL,
  "ssp1_agric_2040" float8 NULL,
  "ssp1_mosc_2040" float8 NULL,
  "ssp1_fores_2040" float8 NULL,
  "ssp1_others_2040" float8 NULL,

  "ssp1_description_2045" varchar NULL,
  "ssp1_scenario_name_2045" varchar NULL,
  "ssp1_scenario_description_2045" varchar NULL,
  "ssp1_veg_2045" float8 NULL,
  "ssp1_pastp_2045" float8 NULL,
  "ssp1_agric_2045" float8 NULL,
  "ssp1_mosc_2045" float8 NULL,
  "ssp1_fores_2045" float8 NULL,
  "ssp1_others_2045" float8 NULL,

  "ssp1_description_2050" varchar NULL,
  "ssp1_scenario_name_2050" varchar NULL,
  "ssp1_scenario_description_2050" varchar NULL,
  "ssp1_veg_2050" float8 NULL,
  "ssp1_pastp_2050" float8 NULL,
  "ssp1_agric_2050" float8 NULL,
  "ssp1_mosc_2050" float8 NULL,
  "ssp1_fores_2050" float8 NULL,
  "ssp1_others_2050" float8 NULL,


  -- ssp2
  "ssp2_description_2000" varchar NULL,
  "ssp2_scenario_name_2000" varchar NULL,
  "ssp2_scenario_description_2000" varchar NULL,
  "ssp2_veg_2000" float8 NULL,
  "ssp2_pastp_2000" float8 NULL,
  "ssp2_agric_2000" float8 NULL,
  "ssp2_mosc_2000" float8 NULL,
  "ssp2_fores_2000" float8 NULL,
  "ssp2_others_2000" float8 NULL,

  "ssp2_description_2010" varchar NULL,
  "ssp2_scenario_name_2010" varchar NULL,
  "ssp2_scenario_description_2010" varchar NULL,
  "ssp2_veg_2010" float8 NULL,
  "ssp2_pastp_2010" float8 NULL,
  "ssp2_agric_2010" float8 NULL,
  "ssp2_mosc_2010" float8 NULL,
  "ssp2_fores_2010" float8 NULL,
  "ssp2_others_2010" float8 NULL,

  "ssp2_description_2012" varchar NULL,
  "ssp2_scenario_name_2012" varchar NULL,
  "ssp2_scenario_description_2012" varchar NULL,
  "ssp2_veg_2012" float8 NULL,
  "ssp2_pastp_2012" float8 NULL,
  "ssp2_agric_2012" float8 NULL,
  "ssp2_mosc_2012" float8 NULL,
  "ssp2_fores_2012" float8 NULL,
  "ssp2_others_2012" float8 NULL,

  "ssp2_description_2014" varchar NULL,
  "ssp2_scenario_name_2014" varchar NULL,
  "ssp2_scenario_description_2014" varchar NULL,
  "ssp2_veg_2014" float8 NULL,
  "ssp2_pastp_2014" float8 NULL,
  "ssp2_agric_2014" float8 NULL,
  "ssp2_mosc_2014" float8 NULL,
  "ssp2_fores_2014" float8 NULL,
  "ssp2_others_2014" float8 NULL,

  "ssp2_description_2015" varchar NULL,
  "ssp2_scenario_name_2015" varchar NULL,
  "ssp2_scenario_description_2015" varchar NULL,
  "ssp2_veg_2015" float8 NULL,
  "ssp2_pastp_2015" float8 NULL,
  "ssp2_agric_2015" float8 NULL,
  "ssp2_mosc_2015" float8 NULL,
  "ssp2_fores_2015" float8 NULL,
  "ssp2_others_2015" float8 NULL,

  "ssp2_description_2020" varchar NULL,
  "ssp2_scenario_name_2020" varchar NULL,
  "ssp2_scenario_description_2020" varchar NULL,
  "ssp2_veg_2020" float8 NULL,
  "ssp2_pastp_2020" float8 NULL,
  "ssp2_agric_2020" float8 NULL,
  "ssp2_mosc_2020" float8 NULL,
  "ssp2_fores_2020" float8 NULL,
  "ssp2_others_2020" float8 NULL,

  "ssp2_description_2025" varchar NULL,
  "ssp2_scenario_name_2025" varchar NULL,
  "ssp2_scenario_description_2025" varchar NULL,
  "ssp2_veg_2025" float8 NULL,
  "ssp2_pastp_2025" float8 NULL,
  "ssp2_agric_2025" float8 NULL,
  "ssp2_mosc_2025" float8 NULL,
  "ssp2_fores_2025" float8 NULL,
  "ssp2_others_2025" float8 NULL,

  "ssp2_description_2030" varchar NULL,
  "ssp2_scenario_name_2030" varchar NULL,
  "ssp2_scenario_description_2030" varchar NULL,
  "ssp2_veg_2030" float8 NULL,
  "ssp2_pastp_2030" float8 NULL,
  "ssp2_agric_2030" float8 NULL,
  "ssp2_mosc_2030" float8 NULL,
  "ssp2_fores_2030" float8 NULL,
  "ssp2_others_2030" float8 NULL,

  "ssp2_description_2035" varchar NULL,
  "ssp2_scenario_name_2035" varchar NULL,
  "ssp2_scenario_description_2035" varchar NULL,
  "ssp2_veg_2035" float8 NULL,
  "ssp2_pastp_2035" float8 NULL,
  "ssp2_agric_2035" float8 NULL,
  "ssp2_mosc_2035" float8 NULL,
  "ssp2_fores_2035" float8 NULL,
  "ssp2_others_2035" float8 NULL,

  "ssp2_description_2040" varchar NULL,
  "ssp2_scenario_name_2040" varchar NULL,
  "ssp2_scenario_description_2040" varchar NULL,
  "ssp2_veg_2040" float8 NULL,
  "ssp2_pastp_2040" float8 NULL,
  "ssp2_agric_2040" float8 NULL,
  "ssp2_mosc_2040" float8 NULL,
  "ssp2_fores_2040" float8 NULL,
  "ssp2_others_2040" float8 NULL,

  "ssp2_description_2045" varchar NULL,
  "ssp2_scenario_name_2045" varchar NULL,
  "ssp2_scenario_description_2045" varchar NULL,
  "ssp2_veg_2045" float8 NULL,
  "ssp2_pastp_2045" float8 NULL,
  "ssp2_agric_2045" float8 NULL,
  "ssp2_mosc_2045" float8 NULL,
  "ssp2_fores_2045" float8 NULL,
  "ssp2_others_2045" float8 NULL,

  "ssp2_description_2050" varchar NULL,
  "ssp2_scenario_name_2050" varchar NULL,
  "ssp2_scenario_description_2050" varchar NULL,
  "ssp2_veg_2050" float8 NULL,
  "ssp2_pastp_2050" float8 NULL,
  "ssp2_agric_2050" float8 NULL,
  "ssp2_mosc_2050" float8 NULL,
  "ssp2_fores_2050" float8 NULL,
  "ssp2_others_2050" float8 NULL,


  -- ssp3
  "ssp3_description_2000" varchar NULL,
  "ssp3_scenario_name_2000" varchar NULL,
  "ssp3_scenario_description_2000" varchar NULL,
  "ssp3_veg_2000" float8 NULL,
  "ssp3_pastp_2000" float8 NULL,
  "ssp3_agric_2000" float8 NULL,
  "ssp3_mosc_2000" float8 NULL,
  "ssp3_fores_2000" float8 NULL,
  "ssp3_others_2000" float8 NULL,

  "ssp3_description_2010" varchar NULL,
  "ssp3_scenario_name_2010" varchar NULL,
  "ssp3_scenario_description_2010" varchar NULL,
  "ssp3_veg_2010" float8 NULL,
  "ssp3_pastp_2010" float8 NULL,
  "ssp3_agric_2010" float8 NULL,
  "ssp3_mosc_2010" float8 NULL,
  "ssp3_fores_2010" float8 NULL,
  "ssp3_others_2010" float8 NULL,

  "ssp3_description_2012" varchar NULL,
  "ssp3_scenario_name_2012" varchar NULL,
  "ssp3_scenario_description_2012" varchar NULL,
  "ssp3_veg_2012" float8 NULL,
  "ssp3_pastp_2012" float8 NULL,
  "ssp3_agric_2012" float8 NULL,
  "ssp3_mosc_2012" float8 NULL,
  "ssp3_fores_2012" float8 NULL,
  "ssp3_others_2012" float8 NULL,

  "ssp3_description_2014" varchar NULL,
  "ssp3_scenario_name_2014" varchar NULL,
  "ssp3_scenario_description_2014" varchar NULL,
  "ssp3_veg_2014" float8 NULL,
  "ssp3_pastp_2014" float8 NULL,
  "ssp3_agric_2014" float8 NULL,
  "ssp3_mosc_2014" float8 NULL,
  "ssp3_fores_2014" float8 NULL,
  "ssp3_others_2014" float8 NULL,

  "ssp3_description_2015" varchar NULL,
  "ssp3_scenario_name_2015" varchar NULL,
  "ssp3_scenario_description_2015" varchar NULL,
  "ssp3_veg_2015" float8 NULL,
  "ssp3_pastp_2015" float8 NULL,
  "ssp3_agric_2015" float8 NULL,
  "ssp3_mosc_2015" float8 NULL,
  "ssp3_fores_2015" float8 NULL,
  "ssp3_others_2015" float8 NULL,

  "ssp3_description_2020" varchar NULL,
  "ssp3_scenario_name_2020" varchar NULL,
  "ssp3_scenario_description_2020" varchar NULL,
  "ssp3_veg_2020" float8 NULL,
  "ssp3_pastp_2020" float8 NULL,
  "ssp3_agric_2020" float8 NULL,
  "ssp3_mosc_2020" float8 NULL,
  "ssp3_fores_2020" float8 NULL,
  "ssp3_others_2020" float8 NULL,

  "ssp3_description_2025" varchar NULL,
  "ssp3_scenario_name_2025" varchar NULL,
  "ssp3_scenario_description_2025" varchar NULL,
  "ssp3_veg_2025" float8 NULL,
  "ssp3_pastp_2025" float8 NULL,
  "ssp3_agric_2025" float8 NULL,
  "ssp3_mosc_2025" float8 NULL,
  "ssp3_fores_2025" float8 NULL,
  "ssp3_others_2025" float8 NULL,

  "ssp3_description_2030" varchar NULL,
  "ssp3_scenario_name_2030" varchar NULL,
  "ssp3_scenario_description_2030" varchar NULL,
  "ssp3_veg_2030" float8 NULL,
  "ssp3_pastp_2030" float8 NULL,
  "ssp3_agric_2030" float8 NULL,
  "ssp3_mosc_2030" float8 NULL,
  "ssp3_fores_2030" float8 NULL,
  "ssp3_others_2030" float8 NULL,

  "ssp3_description_2035" varchar NULL,
  "ssp3_scenario_name_2035" varchar NULL,
  "ssp3_scenario_description_2035" varchar NULL,
  "ssp3_veg_2035" float8 NULL,
  "ssp3_pastp_2035" float8 NULL,
  "ssp3_agric_2035" float8 NULL,
  "ssp3_mosc_2035" float8 NULL,
  "ssp3_fores_2035" float8 NULL,
  "ssp3_others_2035" float8 NULL,

  "ssp3_description_2040" varchar NULL,
  "ssp3_scenario_name_2040" varchar NULL,
  "ssp3_scenario_description_2040" varchar NULL,
  "ssp3_veg_2040" float8 NULL,
  "ssp3_pastp_2040" float8 NULL,
  "ssp3_agric_2040" float8 NULL,
  "ssp3_mosc_2040" float8 NULL,
  "ssp3_fores_2040" float8 NULL,
  "ssp3_others_2040" float8 NULL,

  "ssp3_description_2045" varchar NULL,
  "ssp3_scenario_name_2045" varchar NULL,
  "ssp3_scenario_description_2045" varchar NULL,
  "ssp3_veg_2045" float8 NULL,
  "ssp3_pastp_2045" float8 NULL,
  "ssp3_agric_2045" float8 NULL,
  "ssp3_mosc_2045" float8 NULL,
  "ssp3_fores_2045" float8 NULL,
  "ssp3_others_2045" float8 NULL,

  "ssp3_description_2050" varchar NULL,
  "ssp3_scenario_name_2050" varchar NULL,
  "ssp3_scenario_description_2050" varchar NULL,
  "ssp3_veg_2050" float8 NULL,
  "ssp3_pastp_2050" float8 NULL,
  "ssp3_agric_2050" float8 NULL,
  "ssp3_mosc_2050" float8 NULL,
  "ssp3_fores_2050" float8 NULL,
  "ssp3_others_2050" float8 NULL,


  CONSTRAINT luccme_shared_geom_pkey PRIMARY KEY (id)
);

CREATE INDEX luccme_shared_geom_geom_idx ON public.luccme_shared_geom USING gist (geom);
CREATE INDEX luccme_shared_geom_external_id_idx ON public.luccme_shared_geom (external_id);

--
select distinct "external_id" from "luccme";

select "external_id", "name", "year", "description", "scenario_name", "scenario_description", "veg", "pastp", "mosc", "fores", "others", "agric"
from "luccme"
where "external_id" = 'C318L254';

select count(*) from luccme where external_id = 'C318L254';

select "external_id", "name", "year", "description", "scenario_name", "scenario_description", "veg", "pastp", "mosc", "fores", "others", "agric"
from "luccme"
where "external_id" = 'C318L254';

select "external_id", ST_AsText(geom) "geom"
from "luccme"
where "external_id" = 'C318L254'
limit 1;
