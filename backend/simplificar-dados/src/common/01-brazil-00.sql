drop table if exists "output_brazilsforestcode_brazil";
create table "output_brazilsforestcode_brazil"
(
    id   serial4      not null,
    geom public.geometry(multipolygon,
             4326)    null,
    nm   varchar(254) not null,
    constraint "output_brazilsforestcode_brazil_pkey" primary key (id)
);

insert into "output_brazilsforestcode_brazil"(id, nm, geom)
select id, nm, geom
from "brazil";

create index "output_brazilsforestcode_brazil_geom_idx" on
    "output_brazilsforestcode_brazil"
        using gist (geom);
