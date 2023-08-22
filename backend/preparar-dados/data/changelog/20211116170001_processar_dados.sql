
---------------------------------------------------------------------------------------------------
-- 05. Criar colunas em background

alter table "biomes" add column if not exists "ssp3_fores_2040" float;




---------------------------------------------------------------------------------------------------
-- 06. Calcular intersecção com backgroud
select *, st_transform(st_setsrid(st_geometryn(geom, generate_series(1, st_numgeometries(geom))), 4326), 4326) teste_geom
from biomes
where id=4;

alter table "biomes" drop column if exists cgeom;
alter table "biomes" add column if not exists cgeom geometry(multipolygon, 900914);
update "biomes" set cgeom = st_transform(st_setsrid(geom, 4326), 900914);
create index if not exists "biomes_geom_gix" on "biomes" using gist (geom);
create index if not exists "biomes_cgeom_gix" on "biomes" using gist (cgeom);

-- intersecacao 12460
select count(*)
from luccme_merged, biomes
where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom);


-- contido 10179
select count(*)
from luccme_merged, biomes
where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and st_within(luccme_merged.cgeom, biomes.cgeom);

select sum(ssp3_fores_2040)
from luccme_merged, biomes
where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and st_within(luccme_merged.cgeom, biomes.cgeom);

update biomes
set ssp3_fores_2040 = (
  select sum(luccme_merged.ssp3_fores_2040)
  from luccme_merged, biomes
  where st_intersects(luccme_merged.cgeom, biomes.cgeom) and st_within(luccme_merged.cgeom, biomes.cgeom)
)
from luccme_merged
where st_intersects(luccme_merged.cgeom, biomes.cgeom) and st_within(luccme_merged.cgeom, biomes.cgeom);


-- borda 2281
select count(*)
from luccme_merged, biomes
where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and not st_within(luccme_merged.cgeom, biomes.cgeom);

select st_area(st_intersection(luccme_merged.cgeom, biomes.cgeom)) area_atual, st_area(luccme_merged.cgeom) area_total, (st_area(st_intersection(luccme_merged.cgeom, biomes.cgeom))/st_area(luccme_merged.cgeom)) porcentagem
from luccme_merged, biomes
where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and not st_within(luccme_merged.cgeom, biomes.cgeom);


-- borda com area proporcional
select sum(ssp3_fores_2040 * (st_area(st_intersection(luccme_merged.cgeom, biomes.cgeom))/st_area(luccme_merged.cgeom)))
from luccme_merged, biomes
where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and not st_within(luccme_merged.cgeom, biomes.cgeom);

update biomes
set ssp3_fores_2040 = (
  select sum(luccme_merged.ssp3_fores_2040 * (st_area(st_intersection(luccme_merged.cgeom, biomes.cgeom))/st_area(luccme_merged.cgeom)))
  from luccme_merged, biomes
  where st_intersects(luccme_merged.cgeom, biomes.cgeom) and not st_within(luccme_merged.cgeom, biomes.cgeom)
)
from luccme_merged
where st_intersects(luccme_merged.cgeom, biomes.cgeom) and not st_within(luccme_merged.cgeom, biomes.cgeom);


-- update final area + area_proporcional

update biomes
set ssp3_fores_2040 = (
  (
    select coalesce(sum(luccme_merged.ssp3_fores_2040), 0)
    from luccme_merged, biomes
    where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and st_within(luccme_merged.cgeom, biomes.cgeom)
  ) + (
    select coalesce(sum(luccme_merged.ssp3_fores_2040 * (st_area(st_intersection(luccme_merged.cgeom, biomes.cgeom))/st_area(luccme_merged.cgeom))), 0)
    from luccme_merged, biomes
    where biomes.id = 4 and st_intersects(luccme_merged.cgeom, biomes.cgeom) and st_isvalid(luccme_merged.cgeom) and st_isvalid(biomes.cgeom) and not st_within(luccme_merged.cgeom, biomes.cgeom) and st_isvalid(st_intersection(luccme_merged.cgeom, biomes.cgeom))
  )
)
from luccme_merged
where biomes.id = 4;
