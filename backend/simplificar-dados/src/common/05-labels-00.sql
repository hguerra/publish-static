alter table "brazil" drop column if exists lgeom;
alter table "brazil" add column if not exists lgeom geometry(point, 4326);
update "brazil" set lgeom = st_setsrid(st_centroid(geom), 4326);

alter table "biomes" drop column if exists lgeom;
alter table "biomes" add column if not exists lgeom geometry(point, 4326);
update "biomes" set lgeom = st_setsrid(st_centroid(geom), 4326);

alter table "regions" drop column if exists lgeom;
alter table "regions" add column if not exists lgeom geometry(point, 4326);
update "regions" set lgeom = st_setsrid(st_centroid(geom), 4326);

alter table "states" drop column if exists lgeom;
alter table "states" add column if not exists lgeom geometry(point, 4326);
update "states" set lgeom = st_setsrid(st_centroid(geom), 4326);

alter table "output_brazilsforestcode_brazil" add column if not exists lgeom geometry(point, 4326);
update "output_brazilsforestcode_brazil"
set lgeom = "brazil".lgeom
from "brazil"
where "output_brazilsforestcode_brazil".id = "brazil".id;

alter table "output_brazilsforestcode_biomes" add column if not exists lgeom geometry(point, 4326);
update "output_brazilsforestcode_biomes"
set lgeom = "biomes".lgeom
from "biomes"
where "output_brazilsforestcode_biomes".id = "biomes".id;

alter table "output_brazilsforestcode_regions" add column if not exists lgeom geometry(point, 4326);
update "output_brazilsforestcode_regions"
set lgeom = "regions".lgeom
from "regions"
where "output_brazilsforestcode_regions".id = "regions".id;

alter table "output_brazilsforestcode_states" add column if not exists lgeom geometry(point, 4326);
update "output_brazilsforestcode_states"
set lgeom = "states".lgeom
from "states"
where "output_brazilsforestcode_states".id = "states".id;
