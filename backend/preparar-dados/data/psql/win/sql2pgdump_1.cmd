SET pg_bin=C:\Program Files\pgAdmin 4\v4\runtime\
SET exec=psql.exe
SET PGPASSWORD=sedgeo

echo %time%
"%pg_bin%%exec%" -U sedgeo -d sedgeo -f "C:\projects\seduc\git\sedgeo-carga-dados\bin\db\psql\sql2pgdump_1_handle_00.sql"
"%pg_bin%%exec%" -U sedgeo -d sedgeo -f "C:\projects\seduc\git\sedgeo-carga-dados\bin\db\psql\sql2pgdump_1_handle_01.sql"
echo %time%
