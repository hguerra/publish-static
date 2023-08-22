
-- 01. Rodar script load_shapefile.sh
begin;

delete
from public.spatial_ref_sys
where srid = 900914;

commit;

begin;

insert into public.spatial_ref_sys(srid, auth_name, auth_srid, srtext, proj4text)
values(900914, 'albers_like_ibge', 900914, 'projcs["albers_like_ibge",geogcs["gcs_sirgas_2000",datum["sistema_de_referencia_geocentrico_para_las_americas_2000",spheroid["grs_1980",6378137.0,298.257222101]],primem["greenwich",0.0],unit["degree",0.0174532925199433]],projection["albers_conic_equal_area"],parameter["false_easting",0.0],parameter["false_northing",0.0],parameter["longitude_of_center",-54.0],parameter["standard_parallel_1",-2.0],parameter["standard_parallel_2",-22.0],parameter["latitude_of_center",-12.0],unit["meter",1.0]]', '+proj=aea +lat_1=-2 +lat_2=-22 +lat_0=-12 +lon_0=-54 +x_0=0 +y_0=0 +ellps=grs80 +units=m +no_defs');

commit;

drop function if exists geomb_taxicab;

create or replace function geomb_taxicab(p1 geometry, p2 geometry) returns real as $$
declare
  p1t geometry;

p2t geometry;

begin
  p1t := st_transform(p1, 900914);

p2t := st_transform(p2, 900914);

return abs(st_x(p1t) - st_x(p2t)) + abs(st_y(p1t) - st_y(p2t));

end;

$$ language plpgsql;
---------------------------------------------------------------------------------------------------
-- 02. Criar tabela para juntar todos os dados
-- public.luccme definition
drop table if exists public.luccme;

create table public.luccme (
  "id" serial not null,
  "name" varchar null,
  "year" int4 null,
  "description" varchar null,
  "scenario_name" varchar null,
  "scenario_description" varchar null,
  "external_id" varchar null,
  "col" float8 null,
  "row" float8 null,
  "veg" float8 null,
  "pastp" float8 null,
  "agric" float8 null,
  "mosc" float8 null,
  "fores" float8 null,
  "others" float8 null,
  "geom_type" varchar null,
  "pgeom" geometry(polygon, 5880) null,
  "cgeom" geometry(polygon, 900914) null,
  "geom" geometry(polygon, 4326) null,
  constraint luccme_pkey primary key (id)
);

insert into luccme("name", "year", "description", "scenario_name", "scenario_description", "col", "veg", "pastp", "mosc", "fores", "others", "row", "agric", "external_id", geom_type, pgeom, cgeom, geom)
select "name", "year", "description", "scenario_name", "scenario_description", "col", "veg", "pastp", "mosc", "fores", "others", "row", "agric", "external_id", geom_type, st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), 5880), 5880), st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), 5880), 900914), st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), 5880), 4326)
from luccme_2010;
---------------------------------------------------------------------------------------------------
-- 03. Rodar sql gerado (each_shapefile)
create index luccme_pgeom_geom_idx on
public.luccme
  using gist (pgeom);

create index luccme_cgeom_geom_idx on
public.luccme
  using gist (cgeom);

create index luccme_geom_geom_idx on
public.luccme
  using gist (geom);

create index luccme_external_id_idx on
public.luccme (external_id);

create index luccme_year_idx on
public.luccme ("year");

create index luccme_scenario_name_idx on
public.luccme ("scenario_name");
---------------------------------------------------------------------------------------------------
-- 04. Criar tabela abaixo e rodar service python para agregar valores

select count(*) from luccme_merged;

create index luccme_merged_pgeom_geom_idx on
public.luccme_merged
  using gist (pgeom);

create index luccme_merged_cgeom_geom_idx on
public.luccme_merged
  using gist (cgeom);

create index luccme_merged_geom_geom_idx on
public.luccme_merged
  using gist (geom);
