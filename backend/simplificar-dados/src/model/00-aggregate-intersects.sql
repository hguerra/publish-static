-- criar colunas para registrar border
alter table "brazilsforestcode_idc2_dd"
    drop column if exists "biome_id";
alter table "brazilsforestcode_idc2_dd"
    drop column if exists "biome_nm";
alter table "brazilsforestcode_idc2_dd"
    drop column if exists "biome_intersection_percentage";

alter table "brazilsforestcode_idc2_dd"
    add column "biome_id" INTEGER;
alter table "brazilsforestcode_idc2_dd"
    add column "biome_nm" VARCHAR;
alter table "brazilsforestcode_idc2_dd"
    add column "biome_intersection_percentage" NUMERIC;


-- validar numero de poligonos com porcentagem de interseccao menor que x%
with s_intersets as (select s.id,
                            b.id                                                       b_id,
                            b.nm                                                       b_nm,
                            st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
                     from "brazilsforestcode_idc2_dd" s,
                          "biomes" b
                     where b.id = 3
                       and st_intersects(s.geom, b.geom))
select count(*)
from s_intersets
where s_intersets.b_intersection_percentage < 0.7;


-- atualizar border do poligono
update "brazilsforestcode_idc2_dd"
set "biome_id"                      = s_intersets.b_id,
    "biome_nm"                      = s_intersets.b_nm,
    "biome_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id                                                       b_id,
             b.nm                                                       b_nm,
             st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
      from "brazilsforestcode_idc2_dd" s,
           "biomes" b
      where st_intersects(s.geom, b.geom)) s_intersets
where "brazilsforestcode_idc2_dd".id = s_intersets.id
  and "brazilsforestcode_idc2_dd"."biome_id" is null
  and s_intersets.b_intersection_percentage > 0.7;

create index "brazilsforestcode_idc2_dd_biome_id_idx" on "brazilsforestcode_idc2_dd" ("biome_id");


-- ajustar dados de borda
update "brazilsforestcode_idc2_dd"
set "biome_id"                      = s_intersets.b_id,
    "biome_nm"                      = s_intersets.b_nm,
    "biome_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id                                                       b_id,
             b.nm                                                       b_nm,
             st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
      from "brazilsforestcode_idc2_dd" s,
           "biomes" b
      where st_intersects(s.geom, b.geom)) s_intersets
where "brazilsforestcode_idc2_dd".id = s_intersets.id
  and "brazilsforestcode_idc2_dd"."biome_id" is null;


-- validar dados gerados
select count(s.*)
from "brazilsforestcode_idc2_dd" s
where s."biome_id" is null;

-- 118124.892
select trunc(sum("natveg00"), 3)
from "brazilsforestcode_idc2_dd"
where "biome_id" = 3;

select trunc(sum("natveg00"), 3)
from "brazilsforestcode_idc2_dd";

-- 11603.049
select trunc(sum("wetlnd50"), 3)
from "brazilsforestcode_idc2_dd";

-- real: 203399.395
-- states: 203399.383
select trunc(sum("agro00"), 3)
from "brazilsforestcode_idc2_dd";
