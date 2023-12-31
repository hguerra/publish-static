SET pg_bin=C:\Program Files\pgAdmin 4\v4\runtime\
SET exec=psql.exe
SET PGPASSWORD=sedgeo

::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "VACUUM ANALYZE public.transects;"
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "CLUSTER public.transects USING transects_gix;"
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "ANALYZE public.transects;"

::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "CREATE INDEX amazon_palsar_17_gix ON amazon_palsar_17 USING GIST (geom);"
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "VACUUM ANALYZE public.amazon_palsar_17;"
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "CLUSTER public.amazon_palsar_17 USING amazon_palsar_17_gix;"
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "ANALYZE public.amazon_palsar_17;"

"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "SELECT fupdate_amazon_biomass_17();"

::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "select count(*) as count_max from amazon_trmm_new where trmm_max is not null;" >> result.txt
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "select count(*) as count_median from amazon_trmm_new where trmm_median is not null;" >> result.txt
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "select count(*) as count_min from amazon_trmm_new where trmm_min is not null;" >> result.txt
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "select count(*) as count_q1 from amazon_trmm_new where trmm_q1 is not null;" >> result.txt
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "select count(*) as count_q3 from amazon_trmm_new where trmm_q3 is not null;" >> result.txt
::"%pg_bin%%exec%" -U sedgeo -d sedgeo -c "select count(*) as count_sd from amazon_trmm_new where trmm_sd is not null;" >> result.txt
