drop table if exists public.luccme;

create table public.luccme (
  "id" serial not null,
  "name" varchar null,
  "year" int4 null,
  "description" varchar null,
  "scenario_name" varchar null,
  "scenario_description" varchar null,
  "external_id" varchar null,
  "col" float8 null,
  "row" float8 null,
  "veg" float8 null,
  "pastp" float8 null,
  "agric" float8 null,
  "mosc" float8 null,
  "fores" float8 null,
  "others" float8 null,
  "geom_type" varchar null,
  "pgeom" geometry(polygon, 5880) null,
  "cgeom" geometry(polygon, 900914) null,
  "geom" geometry(polygon, 4326) null,
  constraint luccme_pkey primary key (id)
);
