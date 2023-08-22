-- criar campos de classificacao
alter table "brazilsforestcode_fcnocranosfa"
    drop column if exists "region_id";
alter table "brazilsforestcode_fcnocranosfa"
    drop column if exists "region_nm";
alter table "brazilsforestcode_fcnocranosfa"
    drop column if exists "region_intersection_percentage";

alter table "brazilsforestcode_fcnocranosfa"
    add column "region_id" INTEGER;
alter table "brazilsforestcode_fcnocranosfa"
    add column "region_nm" VARCHAR;
alter table "brazilsforestcode_fcnocranosfa"
    add column "region_intersection_percentage" NUMERIC;


-- popular atributos internos
update "brazilsforestcode_fcnocranosfa"
set "region_id"                      = s_intersets.b_id,
    "region_nm"                      = s_intersets.b_nm,
    "region_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id b_id,
             b.nm b_nm,
             1    b_intersection_percentage
      from "brazilsforestcode_fcnocranosfa" s,
           "regions" b
      where st_intersects(s.geom, b.geom)
        and st_within(s.geom, b.geom)) s_intersets
where "brazilsforestcode_fcnocranosfa".id = s_intersets.id
  and "brazilsforestcode_fcnocranosfa"."region_id" is null;


-- popular atributos de borda
update "brazilsforestcode_fcnocranosfa"
set "region_id"                      = s_intersets.b_id,
    "region_nm"                      = s_intersets.b_nm,
    "region_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id                                                       b_id,
             b.nm                                                       b_nm,
             st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
      from "brazilsforestcode_fcnocranosfa" s,
           "regions" b
      where st_intersects(s.geom, b.geom)
        and not st_within(s.geom, b.geom)) s_intersets
where "brazilsforestcode_fcnocranosfa".id = s_intersets.id
  and "brazilsforestcode_fcnocranosfa"."region_id" is null
  and s_intersets.b_intersection_percentage > 0.7;


-- ajustar atributos de borda
update "brazilsforestcode_fcnocranosfa"
set "region_id"                      = s_intersets.b_id,
    "region_nm"                      = s_intersets.b_nm,
    "region_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id                                                       b_id,
             b.nm                                                       b_nm,
             st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
      from "brazilsforestcode_fcnocranosfa" s,
           "regions" b
      where st_intersects(s.geom, b.geom)) s_intersets
where "brazilsforestcode_fcnocranosfa".id = s_intersets.id
  and "brazilsforestcode_fcnocranosfa"."region_id" is null;

create index "brazilsforestcode_fcnocranosfa_region_id_idx" on "brazilsforestcode_fcnocranosfa" ("region_id");
