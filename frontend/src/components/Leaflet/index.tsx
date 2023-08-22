import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import Legend from 'components/Legend';
import Report from 'components/Report';
import ReportAllBiomes from 'components/Report/ReportAllBiomes';
import Temporal from 'components/Temporal';
import {
  MapPropsViewStyleValueType,
  TimelineOption,
  View,
  ViewType,
} from 'containers/Types';
import { createObjectId, formatNumberDefault } from 'core/utils';
import L, { Layer } from 'leaflet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJSON, Map, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { useDispatch, useTrackedState } from 'store';
import { filter, filterByName } from 'store/utils';
import mapper from 'store/mapper';
import { defaultViewStyleProps, FeatureService } from './feature.service';
import { iconEquals } from './icons';
import './Legend.scss';

const getBaseViewGraphAllBtn = (theme: Theme, top: number) => {
  return {
    position: 'absolute',
    top: top,
    zIndex: 1100,
    right: 8,
    background: '#fff',
    width: 272,
    borderRadius: 4,
    boxShadow: '1px 1px 2px #424242',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 180,
    },
  } as any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    viewGraphAllBiomesBtn: getBaseViewGraphAllBtn(theme, 273),
    viewGraphAllRegionsBtn: getBaseViewGraphAllBtn(theme, 248),
    viewGraphAllStatesBtn: getBaseViewGraphAllBtn(theme, 273),
    btnCustom: {
      borderRadius: 50,
      textTransform: 'none',
      [theme.breakpoints.down('xs')]: {
        zoom: '0.7',
      },
    },
    tooltipFC: {
      backgroundColor: '#2196f3',
      borderColor: '#2196f3',
      color: '#fff',
      marginLeft: '-8px',
    },
    tooltipNoFC: {
      backgroundColor: '#A6A6A6',
      borderColor: '#A6A6A6',
      color: '#fff',
      marginLeft: '-8px',
    },
  }),
);

function geoJSONStyle(view: View) {
  const style = view!.style;

  return function (feature?: GeoJSON.Feature) {
    let newStyle = { ...defaultViewStyleProps };
    if (!feature) {
      return newStyle;
    }

    if (style) {
      if (MapPropsViewStyleValueType.ANY === style.type) {
        if (style.value && style.value.length) {
          newStyle = style.value[0].style;
        }
      } else {
        const properties = feature.properties as any;

        if (properties.hasOwnProperty(style.key)) {
          const propertyValue = properties[style.key];

          if (MapPropsViewStyleValueType.STRING === style.type) {
            const propertyStyleFound = style.value.find(
              (v) => v.valueString === propertyValue,
            );
            if (propertyStyleFound) {
              newStyle = propertyStyleFound.style;
            }
          } else if (MapPropsViewStyleValueType.NUMBER === style.type) {
            const propertyStyleFound = style.value.find(
              (v) => v.valueNumber === propertyValue,
            );
            if (propertyStyleFound) {
              newStyle = propertyStyleFound.style;
            }
          } else if (MapPropsViewStyleValueType.RANGE === style.type) {
            const propertyStyleFound = style.value.find((v) => {
              if (v && v.valueRange) {
                return (
                  v.valueRange.start <= propertyValue &&
                  propertyValue < v.valueRange.end
                );
              }
              return undefined;
            });
            if (propertyStyleFound) {
              newStyle = propertyStyleFound.style;
            }
          }
        }
      }
    }

    return newStyle;
  };
}

function Leaflet() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useTrackedState();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [AllBiomesDialogOpen, setAllBiomesDialogOpen] = React.useState(false);

  const { t } = useTranslation();

  const [
    featureSelected,
    setFeatureSelected,
  ] = React.useState<GeoJSON.Feature | null>(null);

  const geoJSONRef = React.useRef<any>(null);
  const mapRef = React.useRef<any>(null);
  const legendRef = React.useRef<any>();

  const namesByLayer: any = {};
  let removeFromHover: string | null = null;

  const getFeatureName = (feature: GeoJSON.Feature) => {
    let name = '';
    if (feature && feature.properties && feature.properties.nm) {
      name = feature.properties.nm as string;
    }
    return name;
  };

  const handleHighlightFeature = (layer: any) => {
    if (!layer) {
      return;
    }

    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const handleResetHighlight = (geoJSONRef: any, layer: any) => {
    if (geoJSONRef && geoJSONRef.current && layer) {
      geoJSONRef.current.leafletElement.resetStyle(layer);
    }
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const name = getFeatureName(feature);

    // const popupContent = `<strong>${name}</strong>`;
    // layer.bindPopup(popupContent, { closeButton: true, autoPan: false });

    namesByLayer[name] = layer;

    layer.on('click', () => {
      setDialogOpen(true);
      setFeatureSelected(feature);
    });

    layer.on('mouseover', (e: any) => {
      handleHighlightFeature(e.target);
      legendRef.current.setHover(name);
    });

    layer.on('mouseout', (e: any) => {
      handleResetHighlight(geoJSONRef, e.target);
      legendRef.current.setHover(null);
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    legendRef.current.setHover(null);
  };

  const handleAllBiomesDialogClose = () => {
    setAllBiomesDialogOpen(false);
  };

  const handleHoverLegend = (name: string | null) => {
    if (name) {
      const layer = namesByLayer[name];
      handleHighlightFeature(layer);

      removeFromHover = name;
    } else {
      if (removeFromHover) {
        const layer = namesByLayer[removeFromHover];
        handleResetHighlight(geoJSONRef, layer);
      }
    }
  };

  const handleClickLegend = (name: string) => {
    const layer = namesByLayer[name];

    setDialogOpen(true);
    setFeatureSelected(layer.feature);
  };

  const loadGeoJSON = (views: View[]) => {
    return (
      <div>
        {views
          .filter((view?: View) => view && view.data && view.visible)
          .map((view?: View) => {
            return (
              <div key={createObjectId()}>
                <GeoJSON
                  key={view!.name}
                  data={view!.data!}
                  style={geoJSONStyle(view!)}
                  onEachFeature={onEachFeature}
                  ref={geoJSONRef}
                />

                <Legend
                  key={createObjectId()}
                  type={view?.type!}
                  style={view!.style!}
                  onHover={handleHoverLegend}
                  onClick={handleClickLegend}
                  ref={legendRef}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const loadAttributes = (views: View[], classes: any): JSX.Element[] => {
    const layers: JSX.Element[] = [];

    views.forEach((view) => {
      if (view && view.data && view.visible) {
        let geojson = { ...view.data } as any;

        // TODO deixar mais generico
        if (state.currentBorder) {
          if (state.currentBorder === 'Brazil') {
            geojson = FeatureService.cache.labels
              .brazil as GeoJSON.GeoJsonObject;
          }

          if (state.currentBorder === 'Regions') {
            geojson = FeatureService.cache.labels
              .regions as GeoJSON.GeoJsonObject;
          }

          if (state.currentBorder === 'States') {
            geojson = FeatureService.cache.labels
              .states as GeoJSON.GeoJsonObject;
          }
        }

        if (!geojson) {
          return;
        }

        for (const feature of geojson.features) {
          const properties = feature.properties;

          const geometry = feature.geometry;
          const lat = geometry.coordinates[1];
          const lng = geometry.coordinates[0];
          const coords: any = [lat, lng];

          if (
            state.mapPropeties.dataTooltipsEnabled &&
            state.currentScenario &&
            state.currentAttribute &&
            state.currentYear
          ) {
            let unity = 'Mha';
            let denominator = 1000;

            if (state.compareScenarioEnabled && state.compareWithScenario) {
              if (mapper.containsCurrentAttribute(state)) {
                let baseFieldValue = mapper.getCurrentScenarioFieldValue(
                  state,
                  properties,
                );

                if (!baseFieldValue) {
                  baseFieldValue = 0.0;
                }

                let compareFildValue = mapper.getCompareScenarioFieldValue(
                  state,
                  properties,
                );
                if (!compareFildValue) {
                  compareFildValue = 0.0;
                }

                const fieldDiff =
                  (Number(compareFildValue) - Number(baseFieldValue)) /
                  denominator;
                const tooltipValue = formatNumberDefault(Math.abs(fieldDiff));
                let emojiSelected = '';
                let tooltipClassSelected = '';

                const ignoreValue = '0.00';
                if (ignoreValue !== tooltipValue) {
                  if (fieldDiff > 0) {
                    emojiSelected = '▲ ';
                    tooltipClassSelected = classes.tooltipFC;
                  } else if (fieldDiff < 0) {
                    emojiSelected = '▼ ';
                    tooltipClassSelected = classes.tooltipNoFC;
                  }
                }

                layers.push(
                  <Marker
                    key={createObjectId()}
                    position={coords}
                    icon={iconEquals}
                  >
                    <Tooltip
                      className={tooltipClassSelected}
                      direction={'right'}
                      offset={[0, 0]}
                      opacity={0.9}
                      permanent
                    >
                      {`${emojiSelected}${tooltipValue} ${unity}`}
                    </Tooltip>
                  </Marker>,
                );
              }
            } else {
              if (mapper.containsCurrentAttribute(state)) {
                let fieldValue = mapper.getCurrentScenarioFieldValue(
                  state,
                  properties,
                );

                if (!fieldValue) {
                  fieldValue = 0.0;
                }

                let tooltipValue = formatNumberDefault(
                  fieldValue / denominator,
                );
                let emojiSelected = '';
                let tooltipClassSelected = '';

                if (TimelineOption.DIFFERENCE === state.currentTimelineOption) {
                  let fieldDiffValue = mapper.getCurrentScenarioDifferenceFieldValue(
                    state,
                    properties,
                  );

                  if (!fieldDiffValue) {
                    fieldDiffValue = 0.0;
                  }

                  const fieldDiff =
                    (Number(fieldValue) - Number(fieldDiffValue)) / denominator;
                  tooltipValue = formatNumberDefault(Math.abs(fieldDiff));

                  const ignoreValue = '0.00';
                  if (ignoreValue !== tooltipValue) {
                    if (fieldDiff > 0) {
                      emojiSelected = '▲ ';
                      tooltipClassSelected = classes.tooltipFC;
                    } else if (fieldDiff < 0) {
                      emojiSelected = '▼ ';
                      tooltipClassSelected = classes.tooltipNoFC;
                    }
                  }
                }

                layers.push(
                  <Marker
                    key={createObjectId()}
                    position={coords}
                    icon={iconEquals}
                  >
                    <Tooltip
                      className={tooltipClassSelected}
                      direction={'right'}
                      offset={[0, 0]}
                      opacity={0.9}
                      permanent
                    >
                      {`${emojiSelected}${tooltipValue} ${unity}`}
                    </Tooltip>
                  </Marker>,
                );
              }
            }
          }
        }
      }
    });

    return layers;
  };

  const loadBtnViewGraphAllBiomes = () => {
    const validViews = ['Biomes', 'Regions', 'States'];

    if (!validViews.includes(state.currentBorder)) {
      return null;
    }

    const border = filterByName(state, ViewType.BORDER, state.currentBorder);
    if (!border) {
      return null;
    }

    const handleBtnViewGraphClick = () => {
      setAllBiomesDialogOpen(true);
    };

    const getReportAllBiomes = () => {
      if (!AllBiomesDialogOpen) {
        return null;
      }

      return (
        <ReportAllBiomes
          open={AllBiomesDialogOpen}
          view={border}
          onClose={handleAllBiomesDialogClose}
        />
      );
    };

    const getClassName = () => {
      if (state.currentBorder === 'Biomes') {
        return classes.viewGraphAllBiomesBtn;
      }

      if (state.currentBorder === 'Regions') {
        return classes.viewGraphAllRegionsBtn;
      }

      if (state.currentBorder === 'States') {
        return classes.viewGraphAllStatesBtn;
      }
    };

    return (
      <div className={getClassName()}>
        <Button
          className={classes.btnCustom}
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleBtnViewGraphClick}
        >
          {t('ReportAllBiomes.label')}
        </Button>

        {getReportAllBiomes()}
      </div>
    );
  };

  const loadLines = (): JSX.Element => {
    if (state.currentBorder === 'States') {
      const geojson = FeatureService.cache.lines
        .states as GeoJSON.GeoJsonObject;

      return (
        <GeoJSON
          key={'states-labels-lines'}
          data={geojson}
          style={{
            color: '#1f2021',
            weight: 1.5,
          }}
        />
      );
    }

    return <div></div>;
  };

  React.useEffect(() => {
    const featureService = FeatureService;

    // featureService.getBordersNone(t).then((views: View[]) => {
    //   views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
    // });

    Promise.all([
      featureService.getBordersBrazil(t),
      featureService.getBordersRegions(t),
      featureService.getBordersBiomes(t),
      featureService.getBordersStates(t),
    ]).then(() => {
      featureService.getBordersBrazil(t).then((views: View[]) => {
        views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
      });

      featureService.getBordersRegions(t).then((views: View[]) => {
        views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
      });

      featureService.getBordersBiomes(t).then((views: View[]) => {
        views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
      });

      featureService.getBordersStates(t).then((views: View[]) => {
        views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
      });
    });

    featureService.getAttributesBiomes(t).then((views: View[]) => {
      views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
    });

    featureService.getScenarios(t).then((views: View[]) => {
      views.forEach((view: View) => dispatch({ type: 'ADD_VIEW', view }));
    });

    setTimeout(async () => {
      featureService.getLabelsBrazil().finally();
      featureService.getLabelsRegions().finally();
      featureService.getLabelsStates().finally();
      featureService.getLinesStates().finally();
    }, 300);

    if (mapRef && mapRef.current) {
      const map = mapRef.current.leafletElement;
      console.log('Map Instance', map);
    }
  }, [dispatch, t, mapRef]);

  return (
    <div>
      <Map
        id="mapId"
        center={state.mapPropeties}
        zoom={state.mapPropeties.zoom}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {loadGeoJSON(filter(state, ViewType.BORDER))}
        {loadAttributes(filter(state, ViewType.ATTRIBUTE), classes)}
        {loadLines()}
      </Map>
      <Report
        open={dialogOpen}
        properties={featureSelected?.properties}
        onClose={handleDialogClose}
      />
      <Temporal></Temporal>
      {loadBtnViewGraphAllBiomes()}
    </div>
  );
}

export default React.memo(Leaflet);
