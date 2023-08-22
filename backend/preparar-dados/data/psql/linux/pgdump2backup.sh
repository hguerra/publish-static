#!/bin/bash

export PGPASSWORD=geospatialservice
pg_dump -h localhost -p 5432 -U geospatialservice -F c -b -v -f "geospatialservice.backup" geospatialservice

# https://davejansen.com/how-to-dump-and-restore-a-postgresql-database-from-a-docker-container/
# docker ps
# docker compose exec -i postgres /bin/bash -c "PGPASSWORD=geospatialservice pg_dump -h localhost -p 5432 -U geospatialservice -F c -b -v -f "/geospatialservice.backup" geospatialservice"
# docker compose cp postgres:/geospatialservice.backup /home/heitor
# docker compose exec -i postgres /bin/bash -c "rm -f /geospatialservice.backup"
