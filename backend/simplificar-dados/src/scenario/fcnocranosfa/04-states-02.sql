-- criar campos de classificacao
alter table "brazilsforestcode_fcnocranosfa"
    drop column if exists "state_id";
alter table "brazilsforestcode_fcnocranosfa"
    drop column if exists "state_nm";
alter table "brazilsforestcode_fcnocranosfa"
    drop column if exists "state_intersection_percentage";

alter table "brazilsforestcode_fcnocranosfa"
    add column "state_id" INTEGER;
alter table "brazilsforestcode_fcnocranosfa"
    add column "state_nm" VARCHAR;
alter table "brazilsforestcode_fcnocranosfa"
    add column "state_intersection_percentage" NUMERIC;


-- popular atributos internos
update "brazilsforestcode_fcnocranosfa"
set "state_id"                      = s_intersets.b_id,
    "state_nm"                      = s_intersets.b_nm,
    "state_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id b_id,
             b.nm b_nm,
             1    b_intersection_percentage
      from "brazilsforestcode_fcnocranosfa" s,
           "states" b
      where st_intersects(s.geom, b.geom)
        and st_within(s.geom, b.geom)) s_intersets
where "brazilsforestcode_fcnocranosfa".id = s_intersets.id
  and "brazilsforestcode_fcnocranosfa"."state_id" is null;


-- popular atributos de borda
update "brazilsforestcode_fcnocranosfa"
set "state_id"                      = s_intersets.b_id,
    "state_nm"                      = s_intersets.b_nm,
    "state_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id                                                       b_id,
             b.nm                                                       b_nm,
             st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
      from "brazilsforestcode_fcnocranosfa" s,
           "states" b
      where st_intersects(s.geom, b.geom)
        and not st_within(s.geom, b.geom)) s_intersets
where "brazilsforestcode_fcnocranosfa".id = s_intersets.id
  and "brazilsforestcode_fcnocranosfa"."state_id" is null
  and s_intersets.b_intersection_percentage > 0.7;


-- ajustar atributos de borda
update "brazilsforestcode_fcnocranosfa"
set "state_id"                      = s_intersets.b_id,
    "state_nm"                      = s_intersets.b_nm,
    "state_intersection_percentage" = s_intersets.b_intersection_percentage
from (select s.id,
             b.id                                                       b_id,
             b.nm                                                       b_nm,
             st_area(st_intersection(s.geom, b.geom)) / st_area(s.geom) b_intersection_percentage
      from "brazilsforestcode_fcnocranosfa" s,
           "states" b
      where st_intersects(s.geom, b.geom)) s_intersets
where "brazilsforestcode_fcnocranosfa".id = s_intersets.id
  and "brazilsforestcode_fcnocranosfa"."state_id" is null;

create index "brazilsforestcode_fcnocranosfa_state_id_idx" on "brazilsforestcode_fcnocranosfa" ("state_id");
