@echo off
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do (
    set day=%%i
    set month=%%j
    set year=%%k
)
set datestr=%day%_%month%_%year%
echo datestr is %datestr%

set BACKUP_FILE=sedgeo_%datestr%.backup
echo backup file name is %BACKUP_FILE%

SET pg_bin=C:\Program Files\pgAdmin 4\v4\runtime\
SET dump=pg_dump.exe
SET PGPASSWORD=sedgeo
echo on

:: Dump database
"%pg_bin%%dump%" -h localhost -p 5432 -U sedgeo -F c -b -v -f "E:/heitor.guerra/db_backup/db/%BACKUP_FILE%" sedgeo
::"%pg_bin%%dump%" -h localhost -p 5432 -U sedgeo -F c -b -v -f "E:/heitor.guerra/db_backup/db/palsar/%BACKUP_FILE%" palsar
