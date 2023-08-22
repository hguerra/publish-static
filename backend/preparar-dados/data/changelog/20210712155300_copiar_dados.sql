-- https://gis.stackexchange.com/questions/329247/finding-overlay-intersect-shape-percentages-using-qgis
select e.nm_uf, e.cd_uf, b.name, st_area(e.geom_calc) e_area_m2, st_area(b.geom_calc) b_area_m2, st_area(st_intersection(e.geom_calc, b.geom_calc))/st_area(b.geom_calc) porcentagem_area 
from estados e, biomas b
where b.id = 4 and e.cd_uf = '24' and st_intersects(e.geom, b.geom)
limit 1;

-- https://dataedo.com/kb/query/postgresql/find-all-numeric-columns
with numeric_cols as (
    select col.table_schema,
       col.table_name,
       col.ordinal_position as col_id,
       col.column_name,
       col.data_type,
       col.numeric_precision,
       col.numeric_scale
    from information_schema.columns col
    join information_schema.tables tab on tab.table_schema = col.table_schema
                                       and tab.table_name = col.table_name
                                       and tab.table_type = 'BASE TABLE'
    where col.data_type in ('smallint', 'integer', 'bigint', 
                            'decimal', 'numeric', 'real', 'double precision',
                            'smallserial', 'serial', 'bigserial', 'money')
          and col.table_schema not in ('information_schema', 'pg_catalog') and col.table_name = 'biomas' and col.column_name <> 'id'
    order by col.table_schema,
             col.table_name,
             col.ordinal_position
)
select *
from numeric_cols;

    
drop view numeric_cols;
create view numeric_cols as
    select
       col.column_name,
       col.data_type
    from information_schema.columns col
    join information_schema.tables tab on tab.table_schema = col.table_schema
                                       and tab.table_name = col.table_name
                                       and tab.table_type = 'BASE TABLE'
    where col.data_type in ('smallint', 'integer', 'bigint', 
                            'decimal', 'numeric', 'real', 'double precision',
                            'smallserial', 'serial', 'bigserial', 'money')
          and col.table_schema not in ('information_schema', 'pg_catalog') and col.table_name = 'biomas' and col.column_name <> 'id'
    order by col.table_schema,
             col.table_name,
             col.ordinal_position


-- ncrp2000
alter table "estados" drop column if exists ncrp2000;
alter table "estados" add column if not exists ncrp2000 numeric;
update "estados" set ncrp2000 = ? where a = b;

update estados
set ncrp2000 = (biomas.ncrp2000 * (st_area(st_intersection(estados.geom_calc, biomas.geom_calc))/st_area(biomas.geom_calc)))
from biomas
where st_intersects(estados.geom, biomas.geom);

select nm_uf, ncrp2000 from estados;

select
    concat('alter table "estados" drop column if exists ', cols.column_name, ';'),
    concat('alter table "estados" add column if not exists ', cols.column_name, ' ', cols.data_type, ';'),
    concat('update "estados" set ', cols.column_name, ' = ', '(', 'biomas.', cols.column_name, ' * (st_area(st_intersection(estados.geom_calc, biomas.geom_calc))/st_area(biomas.geom_calc)))', ' from biomas where st_intersects(estados.geom, biomas.geom);')
from numeric_cols cols;


select concat('"', name, '",') from estados order by name;

select
    cols.column_name,
    regexp_replace(cols.column_name, '[0-9][0-9][0-9][0-9]$', ''),
    concat('alter table "estados" drop column if exists d', cols.column_name, ';'),
    concat('alter table "estados" drop column if exists r', cols.column_name, ';'),
    concat('alter table "estados" add column if not exists d', cols.column_name, ' ', cols.data_type, ';'),
    concat('alter table "estados" add column if not exists r', cols.column_name, ' ', 'varchar;'),
    concat('update "estados" set d', cols.column_name, ' = (', cols.column_name,' - ', regexp_replace(cols.column_name, '[0-9][0-9][0-9][0-9]$', ''), '2000', ');')
from numeric_cols cols;


select
    concat('update "estados" set r', cols.column_name, ' = ''equals''' ,' where d', cols.column_name,' = 0', ';'),
    concat('update "estados" set r', cols.column_name, ' = ''positive''' ,' where d', cols.column_name,' > 0', ';'),
    concat('update "estados" set r', cols.column_name, ' = ''negative''' ,' where d', cols.column_name,' < 0', ';')
from numeric_cols cols;

