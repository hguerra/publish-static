--liquibase formatted sql

-- changeset heitor.carneiro:20210712095300
begin;
delete from public.spatial_ref_sys where srid = 900914;
commit;

-- changeset heitor:20210712095301
begin;
insert into public.spatial_ref_sys(srid, auth_name, auth_srid, srtext, proj4text)
values(900914, 'albers_like_ibge', 900914, 'projcs["albers_like_ibge",geogcs["gcs_sirgas_2000",datum["sistema_de_referencia_geocentrico_para_las_americas_2000",spheroid["grs_1980",6378137.0,298.257222101]],primem["greenwich",0.0],unit["degree",0.0174532925199433]],projection["albers_conic_equal_area"],parameter["false_easting",0.0],parameter["false_northing",0.0],parameter["longitude_of_center",-54.0],parameter["standard_parallel_1",-2.0],parameter["standard_parallel_2",-22.0],parameter["latitude_of_center",-12.0],unit["meter",1.0]]', '+proj=aea +lat_1=-2 +lat_2=-22 +lat_0=-12 +lon_0=-54 +x_0=0 +y_0=0 +ellps=grs80 +units=m +no_defs');
commit;

-- changeset heitor:20210712095302
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

-- changeset heitor:20210712095303
alter table "biomas" drop column if exists geom_calc;
alter table "estados" drop column if exists geom_calc;
alter table "regioes" drop column if exists geom_calc;
alter table "biomas" drop column if exists geom_lbl;
alter table "estados" drop column if exists geom_lbl;
alter table "regioes" drop column if exists geom_lbl;
alter table "biomas" drop column if exists name;
alter table "estados" drop column if exists name;
alter table "regioes" drop column if exists name;

-- changeset heitor:20210712095304
alter table "biomas" add column if not exists geom_calc geometry(multipolygon, 900914);
--rollback alter table "biomas" drop column if exists geom_calc;

alter table "estados" add column if not exists geom_calc geometry(multipolygon, 900914);
--rollback alter table "estados" drop column if exists geom_calc;

alter table "regioes" add column if not exists geom_calc geometry(multipolygon, 900914);
--rollback alter table "regioes" drop column if exists geom_calc;

alter table "biomas" add column if not exists geom_lbl geometry(point, 4326);
--rollback alter table "biomas" drop column if exists geom_calc;

alter table "estados" add column if not exists geom_lbl geometry(point, 4326);
--rollback alter table "estados" drop column if exists geom_calc;

alter table "regioes" add column if not exists geom_lbl geometry(point, 4326);
--rollback alter table "regioes" drop column if exists geom_calc;

alter table "biomas" add column if not exists name varchar;
--rollback alter table "biomas" drop column if exists name;

alter table "estados" add column if not exists name varchar;
--rollback alter table "estados" drop column if exists name;

alter table "regioes" add column if not exists name varchar;
--rollback alter table "regioes" drop column if exists name;


---- changeset heitor:20210712095305
update "biomas" set geom_calc = st_transform(st_setsrid(geom, 4326), 900914);
update "estados" set geom_calc = st_transform(st_setsrid(geom, 4326), 900914);
update "regioes" set geom_calc = st_transform(st_setsrid(geom, 4326), 900914);

update "biomas" set geom_lbl = st_setsrid(st_centroid(geom), 4326);
update "estados" set geom_lbl = st_setsrid(st_centroid(geom), 4326);
update "regioes" set geom_lbl = st_setsrid(st_centroid(geom), 4326);

update "estados" set name = nm_uf;
update "regioes" set name = nome;

-- changeset heitor:id
create index if not exists "biomas_gix" on "aluno" using gist (geom);
--rollback drop index if exists "biomas_gix";

create index if not exists "estados_gix" on "barreira" using gist (geom);
--rollback drop index if exists "estados_gix";

create index if not exists "cluster_gix" on "cluster" using gist (geom);
--rollback drop index if exists "cluster_gix";

