const fs = require("fs");
const path = require("path");
const Pbf = require("pbf");
const geobuf = require("geobuf");

function removeDecimaisGeoJsonProperties(dirpath) {
  fs.readdirSync(dirpath).forEach((filename) => {
    if (path.extname(filename) === ".geojson") {
      const jsonpath = path.join(dirpath, filename);

      const json = JSON.parse(fs.readFileSync(jsonpath, "utf8"));
      for (const feature of json.features) {
        for (const propertyName of Object.keys(feature.properties)) {
          if (Object.hasOwnProperty.call(feature.properties, propertyName)) {
            const propertyValue = feature.properties[propertyName];
            const numericValue = Number(propertyValue);

            if (numericValue) {
              feature.properties[propertyName] = Number(
                numericValue.toFixed(3)
              );
            }
          }
        }
      }

      const newfilepath = path.join(dirpath, `fixed-${filename}`);
      fs.writeFileSync(newfilepath, JSON.stringify(json));
    }
  });
}

function geoJsonToProtobuf(dirpath) {
  fs.readdirSync(dirpath).forEach((filename) => {
    if (
      // filename.startsWith("fixed-") &&
      path.extname(filename) === ".geojson"
    ) {
      const jsonpath = path.join(dirpath, filename);

      const json = JSON.parse(fs.readFileSync(jsonpath, "utf8"));

      const pbf = geobuf.encode(json, new Pbf());
      const buffer = Buffer.allocUnsafe ? Buffer.from(pbf) : new Buffer(pbf);

      const newfilename = filename
        .replace("fixed-", "")
        .replace(".geojson", "");
      const newfilepath = path.join(dirpath, `${newfilename}.pbf`);
      fs.writeFileSync(newfilepath, buffer, "binary");
    }
  });
}

(async () => {
  // 1 - simplificar geometria 0,19 https://gis.stackexchange.com/questions/25914/smoothing-generalizing-polygon-in-qgis
  // 2 - simplificar casas decimais
  removeDecimaisGeoJsonProperties("/home/heitor/projects/inpe/data/BrazilForestCode/output/2022/geojson/");
  // 3 - gerar Protobuf
  geoJsonToProtobuf("/home/heitor/projects/inpe/data/BrazilForestCode/output/2022/geojson/");
})();
