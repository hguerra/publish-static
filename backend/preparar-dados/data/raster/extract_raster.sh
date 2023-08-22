#!/bin/bash

# Criar raster de exemplo no QGIS

# EPSG: 5880
# processing.run("gdal:rasterize", {'INPUT':'/home/heitorcarneiro/dev/projects/inpe/data/Output/luccme_merged/luccme_merged_pgeom.shp','FIELD':'ssp1_pastp','BURN':1,'UNITS':0,'WIDTH':10000,'HEIGHT':10000,'EXTENT':'2784987.105540027,7124987.105540027,6258790.593749901,10588790.593749901 [EPSG:5880]','NODATA':-9999,'OPTIONS':'','DATA_TYPE':5,'INIT':1,'INVERT':False,'EXTRA':'','OUTPUT':'TEMPORARY_OUTPUT'})
# gdal_rasterize -l luccme_merged_pgeom -a ssp1_pastp -ts 10000.0 10000.0 -init 1.0 -a_nodata -9999.0 -te 2784987.105540027 6258790.593749901 7124987.105540027 10588790.593749901 -ot Float32 -of GTiff /home/heitorcarneiro/dev/projects/inpe/data/Output/luccme_merged/luccme_merged_pgeom.shp /tmp/processing_a89bc62f257047c390fff5ad957f343b/2004fdb9093b4c3d80e3071668fdfe24/OUTPUT.tif

# EPSG: 4326
# processing.run("gdal:rasterize", {'INPUT':'/home/heitorcarneiro/dev/projects/inpe/data/Output/luccme_merged/luccme_merged_geom.shp','FIELD':'ssp1_pastp','BURN':1,'UNITS':0,'WIDTH':10000,'HEIGHT':10000,'EXTENT':'-74.07992829892997,-34.73112145814919,-33.7966281043243,5.294754463527768 [EPSG:4326]','NODATA':-9999,'OPTIONS':'','DATA_TYPE':5,'INIT':1,'INVERT':False,'EXTRA':'','OUTPUT':'TEMPORARY_OUTPUT'})
# gdal_rasterize -l luccme_merged_geom -a ssp1_pastp -ts 10000.0 10000.0 -init 1.0 -a_nodata -9999.0 -te -74.07992829892997 -33.7966281043243 -34.73112145814919 5.294754463527768 -ot Float32 -of GTiff /home/heitorcarneiro/dev/projects/inpe/data/Output/luccme_merged/luccme_merged_geom.shp /tmp/processing_a89bc62f257047c390fff5ad957f343b/69d63e17639d44639e420dc47ca2df8d/OUTPUT.tif

# Extrair consulta em Raster
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fc/cr_carbon/1x1km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fc/cr_carbon/50x50km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocra/cr_carbon/1x1km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocra/cr_carbon/50x50km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocranosfa/cr_carbon/1x1km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocranosfa/cr_carbon/50x50km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnosfa/cr_carbon/1x1km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnosfa/cr_carbon/50x50km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/idc2/cr_carbon/1x1km
mkdir -p /home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/idc2/cr_carbon/50x50km

python extract_raster.py -s "select idc22020 as \"2020\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/idc2/cr_carbon/50x50km" -a "2020"
python extract_raster.py -s "select idc22030 as \"2030\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/idc2/cr_carbon/50x50km" -a "2030"
python extract_raster.py -s "select idc22040 as \"2040\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/idc2/cr_carbon/50x50km" -a "2040"
python extract_raster.py -s "select idc22050 as \"2050\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/idc2/cr_carbon/50x50km" -a "2050"

python extract_raster.py -s "select fc2020 as \"2020\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fc/cr_carbon/50x50km" -a "2020"
python extract_raster.py -s "select fc2030 as \"2030\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fc/cr_carbon/50x50km" -a "2030"
python extract_raster.py -s "select fc2040 as \"2040\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fc/cr_carbon/50x50km" -a "2040"
python extract_raster.py -s "select fc2050 as \"2050\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fc/cr_carbon/50x50km" -a "2050"

python extract_raster.py -s "select fcnc2020 as \"2020\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocra/cr_carbon/50x50km" -a "2020"
python extract_raster.py -s "select fcnc2030 as \"2030\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocra/cr_carbon/50x50km" -a "2030"
python extract_raster.py -s "select fcnc2040 as \"2040\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocra/cr_carbon/50x50km" -a "2040"
python extract_raster.py -s "select fcnc2050 as \"2050\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocra/cr_carbon/50x50km" -a "2050"

python extract_raster.py -s "select fcnn2020 as \"2020\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocranosfa/cr_carbon/50x50km" -a "2020"
python extract_raster.py -s "select fcnn2030 as \"2030\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocranosfa/cr_carbon/50x50km" -a "2030"
python extract_raster.py -s "select fcnn2040 as \"2040\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocranosfa/cr_carbon/50x50km" -a "2040"
python extract_raster.py -s "select fcnn2050 as \"2050\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnocranosfa/cr_carbon/50x50km" -a "2050"

python extract_raster.py -s "select fcns2020 as \"2020\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnosfa/cr_carbon/50x50km" -a "2020"
python extract_raster.py -s "select fcns2030 as \"2030\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnosfa/cr_carbon/50x50km" -a "2030"
python extract_raster.py -s "select fcns2040 as \"2040\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnosfa/cr_carbon/50x50km" -a "2040"
python extract_raster.py -s "select fcns2050 as \"2050\", geom from brazilsforestcode_cr_carbon" -r "extend_50km2_4326.tif" -o "/home/user/dev/pessoal/inpe/data/BrazilForestCode/output/2022/raster/fcnosfa/cr_carbon/50x50km" -a "2050"

