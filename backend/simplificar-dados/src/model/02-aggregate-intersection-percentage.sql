drop table if exists "output_brazilsforestcode_biomes_idc2_dd";
create table "output_brazilsforestcode_biomes_idc2_dd"
(
    id   serial4      not null,
    geom public.geometry(multipolygon,
             4326)    null,
    nm   varchar(254) not null,
    constraint "output_brazilsforestcode_biomes_idc2_dd_pkey" primary key (id)
);

insert into "output_brazilsforestcode_biomes_idc2_dd"(id, nm, geom)
select id, nm, geom
from "biomes";

create index "output_brazilsforestcode_biomes_idc2_dd_geom_idx" on
    "output_brazilsforestcode_biomes_idc2_dd"
        using gist (geom);

select concat('alter table "output_brazilsforestcode_biomes_idc2_dd" add column if not exists ', cols.column_name, ' ',
              cols.data_type, ';')
from numeric_cols cols
order by cols.column_name;


-- popular atributos na borda
drop table if exists "grid_brazilsforestcode_idc2_dd";
create table "grid_brazilsforestcode_idc2_dd" as
select f.id, f.geom, f.b_id, f.b_nm, f.b_intersection_percentage * coalesce(f."natveg00", 0) "natveg00"
from (select s.*,
             b.id                                                                    b_id,
             b.nm                                                                    b_nm,
             coalesce(st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom), 0) b_intersection_percentage
      from "brazilsforestcode_idc2_dd" s,
           "biomes" b
      where st_intersects(s.geom, b.geom)
        and not st_within(s.geom, b.geom)) f;


-- popular atributos internos
insert into "grid_brazilsforestcode_idc2_dd"
select f.id, f.geom, f.b_id, f.b_nm, coalesce(f."natveg00", 0) "natveg00"
from (select s.*, b.id b_id, b.nm b_nm
      from "brazilsforestcode_idc2_dd" s,
           "biomes" b
      where st_intersects(s.geom, b.geom)
        and st_within(s.geom, b.geom)) f;


create index "grid_brazilsforestcode_idc2_dd_id_idx" on "grid_brazilsforestcode_idc2_dd" ("id");
create index "grid_brazilsforestcode_idc2_dd_b_id_idx" on "grid_brazilsforestcode_idc2_dd" ("b_id");
create index "grid_brazilsforestcode_idc2_dd_geom_idx" on "grid_brazilsforestcode_idc2_dd" using gist (geom);

-- original 3001
select count(*)
from "brazilsforestcode_idc2_dd";

-- grid 3469
select count(*)
from "grid_brazilsforestcode_idc2_dd";

-- valor original 595576.572
select trunc(sum("natveg00"), 3)
from "brazilsforestcode_idc2_dd";

-- valor apos operacao de porcentagem 594094.682
-- diferança: -1481.89
select trunc(sum("natveg00")::numeric, 3)
from "grid_brazilsforestcode_idc2_dd";


-- popular dado border
update "output_brazilsforestcode_biomes_idc2_dd"
set "natveg00" = b."natveg00"
from (select g.b_id, sum(g."natveg00") "natveg00"
      from "grid_brazilsforestcode_idc2_dd" g
      group by g.b_id) b
where "output_brazilsforestcode_biomes_idc2_dd".id = b.b_id;

-- validando dado border
-- original 595576.572
select trunc(sum("natveg00"), 3)
from "brazilsforestcode_idc2_dd";
-- processado 594094.682 (n bateu)
select trunc(sum("natveg00"), 3)
from "output_brazilsforestcode_biomes_idc2_dd";


-- confirmando valor pampa
-- 121302.609
select trunc("natveg00", 3)
from "output_brazilsforestcode_biomes_idc2_dd"
where id = 3;

-- 121302.609
select trunc(sum("natveg00")::numeric, 3)
from "grid_brazilsforestcode_idc2_dd"
where b_id = 3;

-- 149587.500 (n bateu)
select trunc(sum("natveg00"), 3)
from "brazilsforestcode_idc2_dd"
where id in (select id from "grid_brazilsforestcode_idc2_dd" where b_id = 3);
