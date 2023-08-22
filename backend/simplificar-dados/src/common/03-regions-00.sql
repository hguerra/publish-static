-- criar tabela de borda
drop table if exists "output_brazilsforestcode_regions";
create table "output_brazilsforestcode_regions"
(
    id   serial4      not null,
    geom public.geometry(multipolygon,
             4326)    null,
    nm   varchar(254) not null,
    constraint "output_brazilsforestcode_regions_pkey" primary key (id)
);

insert into "output_brazilsforestcode_regions"(id, nm, geom)
select id, nm, geom
from "regions";

create index "output_brazilsforestcode_regions_geom_idx" on
    "output_brazilsforestcode_regions"
        using gist (geom);
