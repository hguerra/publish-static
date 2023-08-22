SET pg_bin=C:\Program Files\pgAdmin 4\v4\runtime\
SET restore=pg_restore.exe
SET PGPASSWORD=sedgeo

:: Restore database
::"%pg_bin%%restore%" -h localhost -p 5432 -U sedgeo -d sedgeo -v "sedgeo_23_08_2017_.backup"
"%pg_bin%%restore%" -h localhost -p 5432 -U sedgeo -d simple_plotdata -v "C:\projects\seduc\git\sedgeo-carga-dados\bin\db\backup\simple_plotdata_12_11_2017.backup"

:: Restore table
::"%pg_bin%%restore%" -t amazon_trmm_new -h localhost -p 5432 -U sedgeo -d sedgeo -v "C:\projects\seduc\git\sedgeo-carga-dados\bin\db\backup\sedgeo_05_10_2017.backup"
