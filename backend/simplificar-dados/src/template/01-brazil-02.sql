begin;alter table "output_brazilsforestcode_brazil" add column if not exists "idc2_dd_cr_carbon00" numeric;commit;
begin;alter table "output_brazilsforestcode_brazil" add column if not exists "idc2_dd_cr_carbon10" numeric;commit;
begin;alter table "output_brazilsforestcode_brazil" add column if not exists "idc2_dd_cr_carbon20" numeric;commit;
begin;alter table "output_brazilsforestcode_brazil" add column if not exists "idc2_dd_cr_carbon30" numeric;commit;
begin;alter table "output_brazilsforestcode_brazil" add column if not exists "idc2_dd_cr_carbon40" numeric;commit;
begin;alter table "output_brazilsforestcode_brazil" add column if not exists "idc2_dd_cr_carbon50" numeric;commit;

begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon00" = 0.0;commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon10" = 0.0;commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon20" = 0.0;commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon30" = 0.0;commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon40" = 0.0;commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon50" = 0.0;commit;

begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon00" = (select trunc(sum("cr_carbon00" ), 3) from "brazilsforestcode_idc2_dd");commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon10" = (select trunc(sum("cr_carbon10" ), 3) from "brazilsforestcode_idc2_dd");commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon20" = (select trunc(sum("cr_carbon20" ), 3) from "brazilsforestcode_idc2_dd");commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon30" = (select trunc(sum("cr_carbon30" ), 3) from "brazilsforestcode_idc2_dd");commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon40" = (select trunc(sum("cr_carbon40" ), 3) from "brazilsforestcode_idc2_dd");commit;
begin;update "output_brazilsforestcode_brazil" set "idc2_dd_cr_carbon50" = (select trunc(sum("cr_carbon50" ), 3) from "brazilsforestcode_idc2_dd");commit;
