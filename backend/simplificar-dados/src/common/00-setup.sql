-- changeset heitor.carneiro:20210712095300
begin;
delete
from public.spatial_ref_sys
where srid = 900914;
commit;

-- changeset heitor:20210712095301
begin;
insert into public.spatial_ref_sys(srid, auth_name, auth_srid, srtext, proj4text)
values (900914, 'albers_like_ibge', 900914,
        'projcs["albers_like_ibge",geogcs["gcs_sirgas_2000",datum["sistema_de_referencia_geocentrico_para_las_americas_2000",spheroid["grs_1980",6378137.0,298.257222101]],primem["greenwich",0.0],unit["degree",0.0174532925199433]],projection["albers_conic_equal_area"],parameter["false_easting",0.0],parameter["false_northing",0.0],parameter["longitude_of_center",-54.0],parameter["standard_parallel_1",-2.0],parameter["standard_parallel_2",-22.0],parameter["latitude_of_center",-12.0],unit["meter",1.0]]',
        '+proj=aea +lat_1=-2 +lat_2=-22 +lat_0=-12 +lon_0=-54 +x_0=0 +y_0=0 +ellps=grs80 +units=m +no_defs');
commit;

-- colunas
drop view numeric_cols;
create view numeric_cols as
select col.column_name,
       col.data_type
from information_schema.columns col
         join information_schema.tables tab on tab.table_schema = col.table_schema
    and tab.table_name = col.table_name
    and tab.table_type = 'BASE TABLE'
where col.data_type in ('smallint', 'integer', 'bigint',
                        'decimal', 'numeric', 'real', 'double precision',
                        'smallserial', 'serial', 'bigserial', 'money')
  and col.table_schema not in ('information_schema', 'pg_catalog')
  and col.table_name like 'brazilsforestcode_%'
  and col.column_name <> 'id'
order by col.table_schema,
         col.table_name,
         col.ordinal_position;

with sqls as (select concat(
                             'begin;alter table "output_brazilsforestcode_brazil" add column if not exists ', '"',
                             'idc2_dd',
                             '_',
                             cols.column_name,
                             '" ',
                             cols.data_type, ';commit;') sql_add
              from numeric_cols cols
              order by cols.column_name)
select distinct sqls.sql_add
from sqls
order by sqls.sql_add;

with sqls as (select concat(
                             'begin;update "output_brazilsforestcode_brazil" set ', '"',
                             'idc2_dd',
                             '_',
                             cols.column_name,
                             '" = 0.0;commit;') sql_add
              from numeric_cols cols
              order by cols.column_name)
select distinct sqls.sql_add
from sqls
order by sqls.sql_add;

with sqls as (select concat(
                             'begin;update "output_brazilsforestcode_brazil" set ', '"',
                             'idc2_dd',
                             '_',
                             cols.column_name,
                             '" = ',
                             '(select trunc(sum("',
                             cols.column_name,
                             '" ',
                             '), 3) from "brazilsforestcode_idc2_dd");commit;') sql_add
              from numeric_cols cols
              order by cols.column_name)
select distinct sqls.sql_add
from sqls
order by sqls.sql_add;

with sqls as (select concat(
                             'begin;update "output_brazilsforestcode_biomes" set ', '"',
                             'idc2_dd',
                             '_',
                             cols.column_name,
                             '" = ',
                             'trunc(s_sum.s_total, 3) from (select s.biome_id s_id, sum(s.',
                             '"',
                             cols.column_name,
                             '") s_total ',
                             'from "brazilsforestcode_idc2_dd" s group by s.biome_id order by s.biome_id) s_sum where "output_brazilsforestcode_biomes".id = s_sum.s_id;commit;') sql_add
              from numeric_cols cols
              order by cols.column_name)
select distinct sqls.sql_add
from sqls
order by sqls.sql_add;
