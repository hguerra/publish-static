---------------------------------------------------------------------------------------------------
-- 05. Criar colunas em background

select *, st_transform(st_setsrid(st_geometryn(geom, generate_series(1, st_numgeometries(geom))), 4326), 4326) polygon_geom
from brazil
where id=1;

alter table "brazil" drop column if exists cgeom;
alter table "brazil" add column if not exists cgeom geometry(multipolygon, 900914);
update "brazil" set cgeom = st_transform(st_setsrid(geom, 4326), 900914);
create index if not exists "brazil_geom_gix" on "brazil" using gist (geom);
create index if not exists "brazil_cgeom_gix" on "brazil" using gist (cgeom);



alter table "brazil" add column if not exists "ssp3_fores_2040" float;
---------------------------------------------------------------------------------------------------
-- 06. Calcular intersecção com backgroud


-- contido 10179
select count(*)
from luccme_merged, brazil
where brazil.id = 1 and st_intersects(luccme_merged.cgeom, brazil.cgeom);

select sum(ssp3_fores_2040)
from luccme_merged, brazil
where brazil.id = 1 and st_intersects(luccme_merged.cgeom, brazil.cgeom);


-- update final area + area_proporcional

update brazil
set ssp3_fores_2040 = (
  select coalesce(sum(luccme_merged.ssp3_fores_2040), 0)
  from luccme_merged, brazil
  where brazil.id = 1 and st_intersects(luccme_merged.cgeom, brazil.cgeom)
)
from luccme_merged
where brazil.id = 1;



