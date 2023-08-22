begin;alter table "brazilsforestcode_fcnosfa" add column if not exists "cr_carbon00" numeric;commit;
begin;alter table "brazilsforestcode_fcnosfa" add column if not exists "cr_carbon10" numeric;commit;
begin;alter table "brazilsforestcode_fcnosfa" add column if not exists "cr_carbon20" numeric;commit;
begin;alter table "brazilsforestcode_fcnosfa" add column if not exists "cr_carbon30" numeric;commit;
begin;alter table "brazilsforestcode_fcnosfa" add column if not exists "cr_carbon40" numeric;commit;
begin;alter table "brazilsforestcode_fcnosfa" add column if not exists "cr_carbon50" numeric;commit;

update "brazilsforestcode_fcnosfa"
set
    "cr_carbon00" = "brazilsforestcode_cr_carbon".fcns2000,
    "cr_carbon10" = "brazilsforestcode_cr_carbon".fcns2010,
    "cr_carbon20" = "brazilsforestcode_cr_carbon".fcns2020,
    "cr_carbon30" = "brazilsforestcode_cr_carbon".fcns2030,
    "cr_carbon40" = "brazilsforestcode_cr_carbon".fcns2040,
    "cr_carbon50" = "brazilsforestcode_cr_carbon".fcns2050
from "brazilsforestcode_cr_carbon"
where "brazilsforestcode_fcnosfa".id = "brazilsforestcode_cr_carbon".id;
