begin;alter table "brazilsforestcode_idc2_dd" add column if not exists "cr_carbon00" numeric;commit;
begin;alter table "brazilsforestcode_idc2_dd" add column if not exists "cr_carbon10" numeric;commit;
begin;alter table "brazilsforestcode_idc2_dd" add column if not exists "cr_carbon20" numeric;commit;
begin;alter table "brazilsforestcode_idc2_dd" add column if not exists "cr_carbon30" numeric;commit;
begin;alter table "brazilsforestcode_idc2_dd" add column if not exists "cr_carbon40" numeric;commit;
begin;alter table "brazilsforestcode_idc2_dd" add column if not exists "cr_carbon50" numeric;commit;

update "brazilsforestcode_idc2_dd"
set
    "cr_carbon00" = "brazilsforestcode_cr_carbon".idc22000,
    "cr_carbon10" = "brazilsforestcode_cr_carbon".idc22010,
    "cr_carbon20" = "brazilsforestcode_cr_carbon".idc22020,
    "cr_carbon30" = "brazilsforestcode_cr_carbon".idc22030,
    "cr_carbon40" = "brazilsforestcode_cr_carbon".idc22040,
    "cr_carbon50" = "brazilsforestcode_cr_carbon".idc22050
from "brazilsforestcode_cr_carbon"
where "brazilsforestcode_idc2_dd".id = "brazilsforestcode_cr_carbon".id;
