drop table if exists "luccme_merged";
create table if not exists "luccme_merged" (
"id" serial not null,
"ssp1_description_2000" text null,
"ssp1_veg_2000" FLOAT null,
"ssp1_pastp_2000" FLOAT null,
"ssp1_mosc_2000" FLOAT null,
"ssp1_fores_2000" FLOAT null,
"ssp1_others_2000" FLOAT null,
"ssp1_agric_2000" FLOAT null,
"ssp2_description_2000" text null,
"ssp2_veg_2000" FLOAT null,
"ssp2_pastp_2000" FLOAT null,
"ssp2_mosc_2000" FLOAT null,
"ssp2_fores_2000" FLOAT null,
"ssp2_others_2000" FLOAT null,
"ssp2_agric_2000" FLOAT null,
"ssp3_description_2000" text null,
"ssp3_veg_2000" FLOAT null,
"ssp3_pastp_2000" FLOAT null,
"ssp3_mosc_2000" FLOAT null,
"ssp3_fores_2000" FLOAT null,
"ssp3_others_2000" FLOAT null,
"ssp3_agric_2000" FLOAT null,
"ssp1_description_2010" text null,
"ssp1_veg_2010" FLOAT null,
"ssp1_pastp_2010" FLOAT null,
"ssp1_mosc_2010" FLOAT null,
"ssp1_fores_2010" FLOAT null,
"ssp1_others_2010" FLOAT null,
"ssp1_agric_2010" FLOAT null,
"ssp2_description_2010" text null,
"ssp2_veg_2010" FLOAT null,
"ssp2_pastp_2010" FLOAT null,
"ssp2_mosc_2010" FLOAT null,
"ssp2_fores_2010" FLOAT null,
"ssp2_others_2010" FLOAT null,
"ssp2_agric_2010" FLOAT null,
"ssp3_description_2010" text null,
"ssp3_veg_2010" FLOAT null,
"ssp3_pastp_2010" FLOAT null,
"ssp3_mosc_2010" FLOAT null,
"ssp3_fores_2010" FLOAT null,
"ssp3_others_2010" FLOAT null,
"ssp3_agric_2010" FLOAT null,
"ssp1_description_2012" text null,
"ssp1_veg_2012" FLOAT null,
"ssp1_pastp_2012" FLOAT null,
"ssp1_mosc_2012" FLOAT null,
"ssp1_fores_2012" FLOAT null,
"ssp1_others_2012" FLOAT null,
"ssp1_agric_2012" FLOAT null,
"ssp2_description_2012" text null,
"ssp2_veg_2012" FLOAT null,
"ssp2_pastp_2012" FLOAT null,
"ssp2_mosc_2012" FLOAT null,
"ssp2_fores_2012" FLOAT null,
"ssp2_others_2012" FLOAT null,
"ssp2_agric_2012" FLOAT null,
"ssp3_description_2012" text null,
"ssp3_veg_2012" FLOAT null,
"ssp3_pastp_2012" FLOAT null,
"ssp3_mosc_2012" FLOAT null,
"ssp3_fores_2012" FLOAT null,
"ssp3_others_2012" FLOAT null,
"ssp3_agric_2012" FLOAT null,
"ssp1_description_2014" text null,
"ssp1_veg_2014" FLOAT null,
"ssp1_pastp_2014" FLOAT null,
"ssp1_mosc_2014" FLOAT null,
"ssp1_fores_2014" FLOAT null,
"ssp1_others_2014" FLOAT null,
"ssp1_agric_2014" FLOAT null,
"ssp2_description_2014" text null,
"ssp2_veg_2014" FLOAT null,
"ssp2_pastp_2014" FLOAT null,
"ssp2_mosc_2014" FLOAT null,
"ssp2_fores_2014" FLOAT null,
"ssp2_others_2014" FLOAT null,
"ssp2_agric_2014" FLOAT null,
"ssp3_description_2014" text null,
"ssp3_veg_2014" FLOAT null,
"ssp3_pastp_2014" FLOAT null,
"ssp3_mosc_2014" FLOAT null,
"ssp3_fores_2014" FLOAT null,
"ssp3_others_2014" FLOAT null,
"ssp3_agric_2014" FLOAT null,
"ssp1_description_2015" text null,
"ssp1_veg_2015" FLOAT null,
"ssp1_pastp_2015" FLOAT null,
"ssp1_mosc_2015" FLOAT null,
"ssp1_fores_2015" FLOAT null,
"ssp1_others_2015" FLOAT null,
"ssp1_agric_2015" FLOAT null,
"ssp2_description_2015" text null,
"ssp2_veg_2015" FLOAT null,
"ssp2_pastp_2015" FLOAT null,
"ssp2_mosc_2015" FLOAT null,
"ssp2_fores_2015" FLOAT null,
"ssp2_others_2015" FLOAT null,
"ssp2_agric_2015" FLOAT null,
"ssp3_description_2015" text null,
"ssp3_veg_2015" FLOAT null,
"ssp3_pastp_2015" FLOAT null,
"ssp3_mosc_2015" FLOAT null,
"ssp3_fores_2015" FLOAT null,
"ssp3_others_2015" FLOAT null,
"ssp3_agric_2015" FLOAT null,
"ssp1_description_2020" text null,
"ssp1_veg_2020" FLOAT null,
"ssp1_pastp_2020" FLOAT null,
"ssp1_mosc_2020" FLOAT null,
"ssp1_fores_2020" FLOAT null,
"ssp1_others_2020" FLOAT null,
"ssp1_agric_2020" FLOAT null,
"ssp2_description_2020" text null,
"ssp2_veg_2020" FLOAT null,
"ssp2_pastp_2020" FLOAT null,
"ssp2_mosc_2020" FLOAT null,
"ssp2_fores_2020" FLOAT null,
"ssp2_others_2020" FLOAT null,
"ssp2_agric_2020" FLOAT null,
"ssp3_description_2020" text null,
"ssp3_veg_2020" FLOAT null,
"ssp3_pastp_2020" FLOAT null,
"ssp3_mosc_2020" FLOAT null,
"ssp3_fores_2020" FLOAT null,
"ssp3_others_2020" FLOAT null,
"ssp3_agric_2020" FLOAT null,
"ssp1_description_2025" text null,
"ssp1_veg_2025" FLOAT null,
"ssp1_pastp_2025" FLOAT null,
"ssp1_mosc_2025" FLOAT null,
"ssp1_fores_2025" FLOAT null,
"ssp1_others_2025" FLOAT null,
"ssp1_agric_2025" FLOAT null,
"ssp2_description_2025" text null,
"ssp2_veg_2025" FLOAT null,
"ssp2_pastp_2025" FLOAT null,
"ssp2_mosc_2025" FLOAT null,
"ssp2_fores_2025" FLOAT null,
"ssp2_others_2025" FLOAT null,
"ssp2_agric_2025" FLOAT null,
"ssp3_description_2025" text null,
"ssp3_veg_2025" FLOAT null,
"ssp3_pastp_2025" FLOAT null,
"ssp3_mosc_2025" FLOAT null,
"ssp3_fores_2025" FLOAT null,
"ssp3_others_2025" FLOAT null,
"ssp3_agric_2025" FLOAT null,
"ssp1_description_2030" text null,
"ssp1_veg_2030" FLOAT null,
"ssp1_pastp_2030" FLOAT null,
"ssp1_mosc_2030" FLOAT null,
"ssp1_fores_2030" FLOAT null,
"ssp1_others_2030" FLOAT null,
"ssp1_agric_2030" FLOAT null,
"ssp2_description_2030" text null,
"ssp2_veg_2030" FLOAT null,
"ssp2_pastp_2030" FLOAT null,
"ssp2_mosc_2030" FLOAT null,
"ssp2_fores_2030" FLOAT null,
"ssp2_others_2030" FLOAT null,
"ssp2_agric_2030" FLOAT null,
"ssp3_description_2030" text null,
"ssp3_veg_2030" FLOAT null,
"ssp3_pastp_2030" FLOAT null,
"ssp3_mosc_2030" FLOAT null,
"ssp3_fores_2030" FLOAT null,
"ssp3_others_2030" FLOAT null,
"ssp3_agric_2030" FLOAT null,
"ssp1_description_2035" text null,
"ssp1_veg_2035" FLOAT null,
"ssp1_pastp_2035" FLOAT null,
"ssp1_mosc_2035" FLOAT null,
"ssp1_fores_2035" FLOAT null,
"ssp1_others_2035" FLOAT null,
"ssp1_agric_2035" FLOAT null,
"ssp2_description_2035" text null,
"ssp2_veg_2035" FLOAT null,
"ssp2_pastp_2035" FLOAT null,
"ssp2_mosc_2035" FLOAT null,
"ssp2_fores_2035" FLOAT null,
"ssp2_others_2035" FLOAT null,
"ssp2_agric_2035" FLOAT null,
"ssp3_description_2035" text null,
"ssp3_veg_2035" FLOAT null,
"ssp3_pastp_2035" FLOAT null,
"ssp3_mosc_2035" FLOAT null,
"ssp3_fores_2035" FLOAT null,
"ssp3_others_2035" FLOAT null,
"ssp3_agric_2035" FLOAT null,
"ssp1_description_2040" text null,
"ssp1_veg_2040" FLOAT null,
"ssp1_pastp_2040" FLOAT null,
"ssp1_mosc_2040" FLOAT null,
"ssp1_fores_2040" FLOAT null,
"ssp1_others_2040" FLOAT null,
"ssp1_agric_2040" FLOAT null,
"ssp2_description_2040" text null,
"ssp2_veg_2040" FLOAT null,
"ssp2_pastp_2040" FLOAT null,
"ssp2_mosc_2040" FLOAT null,
"ssp2_fores_2040" FLOAT null,
"ssp2_others_2040" FLOAT null,
"ssp2_agric_2040" FLOAT null,
"ssp3_description_2040" text null,
"ssp3_veg_2040" FLOAT null,
"ssp3_pastp_2040" FLOAT null,
"ssp3_mosc_2040" FLOAT null,
"ssp3_fores_2040" FLOAT null,
"ssp3_others_2040" FLOAT null,
"ssp3_agric_2040" FLOAT null,
"ssp1_description_2045" text null,
"ssp1_veg_2045" FLOAT null,
"ssp1_pastp_2045" FLOAT null,
"ssp1_mosc_2045" FLOAT null,
"ssp1_fores_2045" FLOAT null,
"ssp1_others_2045" FLOAT null,
"ssp1_agric_2045" FLOAT null,
"ssp2_description_2045" text null,
"ssp2_veg_2045" FLOAT null,
"ssp2_pastp_2045" FLOAT null,
"ssp2_mosc_2045" FLOAT null,
"ssp2_fores_2045" FLOAT null,
"ssp2_others_2045" FLOAT null,
"ssp2_agric_2045" FLOAT null,
"ssp3_description_2045" text null,
"ssp3_veg_2045" FLOAT null,
"ssp3_pastp_2045" FLOAT null,
"ssp3_mosc_2045" FLOAT null,
"ssp3_fores_2045" FLOAT null,
"ssp3_others_2045" FLOAT null,
"ssp3_agric_2045" FLOAT null,
"ssp1_description_2050" text null,
"ssp1_veg_2050" FLOAT null,
"ssp1_pastp_2050" FLOAT null,
"ssp1_mosc_2050" FLOAT null,
"ssp1_fores_2050" FLOAT null,
"ssp1_others_2050" FLOAT null,
"ssp1_agric_2050" FLOAT null,
"ssp2_description_2050" text null,
"ssp2_veg_2050" FLOAT null,
"ssp2_pastp_2050" FLOAT null,
"ssp2_mosc_2050" FLOAT null,
"ssp2_fores_2050" FLOAT null,
"ssp2_others_2050" FLOAT null,
"ssp2_agric_2050" FLOAT null,
"ssp3_description_2050" text null,
"ssp3_veg_2050" FLOAT null,
"ssp3_pastp_2050" FLOAT null,
"ssp3_mosc_2050" FLOAT null,
"ssp3_fores_2050" FLOAT null,
"ssp3_others_2050" FLOAT null,
"ssp3_agric_2050" FLOAT null,
"pgeom" geometry(polygon, 5880) null,
"cgeom" geometry(polygon, 900914) null,
"geom" geometry(polygon, 4326) null,
constraint luccme_merged_pkey primary key (id)
);
