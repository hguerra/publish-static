#!/bin/bash

export PGPASSWORD=geospatialservice
pg_restore -h localhost -p 5432 -U geospatialservice -d geospatialservice -v "/home/heitor/projects/inpe/data/Backup/2020-07-11_geospatialservice.backup"
