SET pg_bin=C:\Program Files\pgAdmin 4\v4\runtime\
SET dump=pg_dump.exe
SET psql=psql.exe
SET PGPASSWORD=sedgeo

:: Dump database
::"%pg_bin%%dump%" -U sedgeo -F t sedgeo > "C:\projects\seduc\git\sedgeo-carga-dados\bin\db\backup\sedgeo-14-08-17.sql"

:: Dump table
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "transects" > "E:\heitor.guerra\db_backup\transects.sql"
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "metrics" > "E:\heitor.guerra\db_backup\metrics.sql"
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "amazon" > "E:\heitor.guerra\db_backup\amazon_nofill.sql"
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "amazon_evi_max_2" > "E:\heitor.guerra\db_backup\amazon_evi_max_2.sql"
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "amazon_evi" > "E:\heitor.guerra\db_backup\amazon_evi.sql"
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "amazon_ndvi" > "E:\heitor.guerra\db_backup\amazon_ndvi.sql"
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "amazon_srtm" > "E:\heitor.guerra\db_backup\table\amazon_srtm.sql"

:: Dump table to another database
::"%pg_bin%%dump%" -U sedgeo -d sedgeo -t "amazon_trmm" | "%pg_bin%%psql%" -U sedgeo -d sedgeo_amazon_test
