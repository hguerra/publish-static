---------------------------------------------------------------------------------------------------
-- 05. Criar colunas em background

select *, st_transform(st_setsrid(st_geometryn(geom, generate_series(1, st_numgeometries(geom))), 4326), 4326) polygon_geom
from states
where id=1;

alter table "states" drop column if exists cgeom;
alter table "states" add column if not exists cgeom geometry(multipolygon, 900914);
update "states" set cgeom = st_transform(st_setsrid(geom, 4326), 900914);
create index if not exists "states_geom_gix" on "states" using gist (geom);
create index if not exists "states_cgeom_gix" on "states" using gist (cgeom);



alter table "states" add column if not exists "ssp3_fores_2040" float;
---------------------------------------------------------------------------------------------------
-- 06. Calcular intersecção com backgroud


select sum(states.ssp3_fores_2040)
from luccme_merged, states
where states.id = 1 and st_intersects(luccme_merged.cgeom, states.cgeom);


-- update final area + area_proporcional
update states
set ssp3_fores_2040 = (
  (
    select coalesce(sum(luccme_merged.ssp3_fores_2040), 0)
    from luccme_merged, states
    where states.id = 1 and st_intersects(luccme_merged.cgeom, states.cgeom) and st_within(luccme_merged.cgeom, states.cgeom)
  ) + (
    select coalesce(sum(luccme_merged.ssp3_fores_2040 * (st_area(st_intersection(luccme_merged.cgeom, states.cgeom))/st_area(luccme_merged.cgeom))), 0)
    from luccme_merged, states
    where states.id = 1 and st_intersects(luccme_merged.cgeom, states.cgeom) and st_isvalid(luccme_merged.cgeom) and st_isvalid(states.cgeom) and not st_within(luccme_merged.cgeom, states.cgeom) and st_isvalid(st_intersection(luccme_merged.cgeom, states.cgeom))
  )
)
from luccme_merged
where states.id = 1;

select max(id) from states;


---------------------------------------------------------------------------------------------------
-- 07. Criar tabelas de labels

alter table "brazil" drop column if exists lgeom;
alter table "brazil" add column if not exists lgeom geometry(point, 4326);
update "brazil" set lgeom = st_centroid(st_setsrid(geom, 4326));
create index if not exists "brazil_lgeom_gix" on "brazil" using gist (lgeom);

alter table "biomes" drop column if exists lgeom;
alter table "biomes" add column if not exists lgeom geometry(point, 4326);
update "biomes" set lgeom = st_centroid(st_setsrid(geom, 4326));
create index if not exists "biomes_lgeom_gix" on "biomes" using gist (lgeom);

alter table "states" drop column if exists lgeom;
alter table "states" add column if not exists lgeom geometry(point, 4326);
update "states" set lgeom = st_centroid(st_setsrid(geom, 4326));
create index if not exists "states_lgeom_gix" on "states" using gist (lgeom);
