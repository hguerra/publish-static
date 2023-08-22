-- criar tabela de borda
drop table if exists "output_brazilsforestcode_biomes";
create table "output_brazilsforestcode_biomes"
(
    id   serial4      not null,
    geom public.geometry(multipolygon,
             4326)    null,
    nm   varchar(254) not null,
    constraint "output_brazilsforestcode_biomes_pkey" primary key (id)
);

insert into "output_brazilsforestcode_biomes"(id, nm, geom)
select id, nm, geom
from "biomes";

create index "output_brazilsforestcode_biomes_geom_idx" on
    "output_brazilsforestcode_biomes"
        using gist (geom);
