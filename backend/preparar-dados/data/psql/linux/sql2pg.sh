#!/bin/bash

export PGPASSWORD=geospatialservice

psql -h localhost -p 5432 -U geospatialservice -d geospatialservice -f "/home/user/dev/pessoal/inpe/publish-next/backend/geospatialservice/bin/1_update_table.sql"
psql -h localhost -p 5432 -U geospatialservice -d geospatialservice -f "/home/user/dev/pessoal/inpe/publish-next/backend/geospatialservice/bin/2_update_table.sql"
psql -h localhost -p 5432 -U geospatialservice -d geospatialservice -f "/home/user/dev/pessoal/inpe/publish-next/backend/geospatialservice/bin/3_update_table.sql"
psql -h localhost -p 5432 -U geospatialservice -d geospatialservice -f "/home/user/dev/pessoal/inpe/publish-next/backend/geospatialservice/bin/4_update_table.sql"
psql -h localhost -p 5432 -U geospatialservice -d geospatialservice -f "/home/user/dev/pessoal/inpe/publish-next/backend/geospatialservice/bin/5_update_table.sql"
