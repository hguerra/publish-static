-- criar tabela de borda
drop table if exists "output_brazilsforestcode_states";
create table "output_brazilsforestcode_states"
(
    id   serial4      not null,
    geom public.geometry(multipolygon,
             4326)    null,
    nm   varchar(254) not null,
    constraint "output_brazilsforestcode_states_pkey" primary key (id)
);

insert into "output_brazilsforestcode_states"(id, nm, geom)
select id, nm, geom
from "states";

create index "output_brazilsforestcode_states_geom_idx" on
    "output_brazilsforestcode_states"
        using gist (geom);
