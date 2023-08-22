#!/bin/bash

export PGPASSWORD=geospatialservice

shp2pgsql -I -s 4326 "/home/heitorcarneiro/dev/projects/inpe/data/Output/shp/brazil-luccme.shp" brazil_luccme | psql -h localhost -p 5432 -U geospatialservice -d geospatialservice
