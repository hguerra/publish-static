import { createStyles, makeStyles } from '@material-ui/core';
import { TimelineOption, View } from 'containers/Types';
import { formatNumberDefault } from 'core/utils';
import { State } from 'store';
import mapper from 'store/mapper';

const scenariosColors = mapper.getScenariosShip();
const scenariosName = mapper.getScenarioNames();
const scenariosLabels = mapper.getScenarioNamesFriendly();

const scenario0Name = scenariosName.IDC2;
const scenario1Name = scenariosName.FC;
const scenario2Name = scenariosName.FCnoCRA;
const scenario3Name = scenariosName.FCnoSFA;
const scenario4Name = scenariosName.FCnoCRAnoSFA;

const scenario0Label = scenariosLabels.IDC2;
const scenario1Label = scenariosLabels.FC;
const scenario2Label = scenariosLabels.FCnoCRA;
const scenario3Label = scenariosLabels.FCnoSFA;
const scenario4Label = scenariosLabels.FCnoCRAnoSFA;

const compareColor = scenariosColors.NONE;
const scenario0Color = scenariosColors.IDC2;
const scenario1Color = scenariosColors.FC;
const scenario2Color = scenariosColors.FCnoCRA;
const scenario3Color = scenariosColors.FCnoSFA;
const scenario4Color = scenariosColors.FCnoCRAnoSFA;

export function datasetsFactory(
  state: State,
  properties: GeoJSON.GeoJsonProperties,
  scenariosNames: string[],
  validLabels: string[],
  axis = 'vertical',
) {
  const datasets: any = {};
  const isDifference =
    TimelineOption.DIFFERENCE === state.currentTimelineOption;
  const changeFromYear = state.changeFromYear;

  for (const key in properties) {
    let value = properties[key];
    let name = key.toLowerCase();

    const parts = name.split('_');
    if (parts.length < 2) {
      continue;
    }

    const partWithDateIndex = parts.length - 1;
    const date = parts[partWithDateIndex].slice(-2).match(/\d+/g)?.join('');

    if (date) {
      name = key.toLowerCase().replace(`${date}`, '');

      scenariosNames.forEach((scenarioName: string) => {
        const scenarioNameToCheck = `${scenarioName}_`;
        if (name.startsWith(scenarioNameToCheck)) {
          name = name.replace(scenarioNameToCheck, '');

          if (!datasets.hasOwnProperty(name)) {
            datasets[name] = {};
          }

          const scenario: any = datasets[name];
          if (!scenario.hasOwnProperty(scenarioName)) {
            scenario[scenarioName] = {
              object: [],
            };
          }

          if (isDifference) {
            const baseAttributeName = key.replace(`${date}`, '');
            const baseAttributeKey = `${baseAttributeName}${changeFromYear
              .toString()
              .slice(-2)}`;
            const baseAttributeValue = properties[baseAttributeKey];

            value = value - baseAttributeValue;
          }

          scenario[scenarioName].object.push({ x: `20${date}`, y: value });
        }
      });
    }
  }

  for (const propertyName in datasets) {
    const property = datasets[propertyName];

    for (const scenarioName in property) {
      const scenario = property[scenarioName];
      const object = scenario.object as { x: any; y: any }[];

      scenario.labels = [];
      scenario.data = [];
      validLabels.forEach((label: string) => {
        const found = object.find((entry: { x: any; y: any }) =>
          axis === 'vertical' ? entry.x === label : entry.y === label,
        );
        if (found) {
          const data = axis === 'vertical' ? found.y : found.x;
          scenario.labels.push(label);
          scenario.data.push(data);
        }
      });
    }
  }

  const attributeToFix = datasets.forreg;
  if (attributeToFix) {
    for (const scenarioToFix in attributeToFix) {
      const props = attributeToFix[scenarioToFix];
      props.labels.unshift('2020');
      props.data.unshift(0);
    }
  }

  return datasets;
}

export function chartDataFactory(
  state: State,
  datasetName: string,
  datasets: { [name: string]: any },
) {
  const scenarioData = mapper.getScenarioData(datasetName, datasets);
  const labels = scenarioData.labels;
  const scenario0Data = scenarioData.datasets[0].data;
  const scenario1Data = scenarioData.datasets[1].data;
  const scenario2Data = scenarioData.datasets[2].data;
  const scenario3Data = scenarioData.datasets[3].data;
  const scenario4Data = scenarioData.datasets[4].data;

  if (state.compareScenarioEnabled) {
    let baseArray = [];
    let compareArray = [];
    let newLabel = ``;

    if (state.currentScenario === scenario0Name) {
      baseArray = scenario0Data;

      if (state.compareWithScenario === scenario1Name) {
        compareArray = scenario1Data;
        newLabel = `${scenario1Label} - ${scenario0Label}`;
      }

      if (state.compareWithScenario === scenario2Name) {
        compareArray = scenario2Data;
        newLabel = `${scenario2Label} - ${scenario0Label}`;
      }

      if (state.compareWithScenario === scenario3Name) {
        compareArray = scenario3Data;
        newLabel = `${scenario3Label} - ${scenario0Label}`;
      }

      if (state.compareWithScenario === scenario4Name) {
        compareArray = scenario4Data;
        newLabel = `${scenario4Label} - ${scenario0Name}`;
      }
    } else if (state.currentScenario === scenario1Name) {
      baseArray = scenario1Data;

      if (state.compareWithScenario === scenario0Name) {
        compareArray = scenario0Data;
        newLabel = `${scenario0Label} - ${scenario1Label}`;
      }

      if (state.compareWithScenario === scenario2Name) {
        compareArray = scenario2Data;
        newLabel = `${scenario2Label} - ${scenario1Label}`;
      }

      if (state.compareWithScenario === scenario3Name) {
        compareArray = scenario3Data;
        newLabel = `${scenario3Label} - ${scenario1Label}`;
      }

      if (state.compareWithScenario === scenario4Name) {
        compareArray = scenario4Data;
        newLabel = `${scenario4Label} - ${scenario1Label}`;
      }
    } else if (state.currentScenario === scenario2Name) {
      baseArray = scenario2Data;

      if (state.compareWithScenario === scenario0Name) {
        compareArray = scenario0Data;
        newLabel = `${scenario0Label} - ${scenario2Label}`;
      }

      if (state.compareWithScenario === scenario1Name) {
        compareArray = scenario1Data;
        newLabel = `${scenario1Label} - ${scenario2Label}`;
      }

      if (state.compareWithScenario === scenario3Name) {
        compareArray = scenario3Data;
        newLabel = `${scenario3Label} - ${scenario2Label}`;
      }

      if (state.compareWithScenario === scenario4Name) {
        compareArray = scenario4Data;
        newLabel = `${scenario4Label} - ${scenario2Label}`;
      }
    } else if (state.currentScenario === scenario3Name) {
      baseArray = scenario3Data;

      if (state.compareWithScenario === scenario0Name) {
        compareArray = scenario0Data;
        newLabel = `${scenario0Label} - ${scenario3Label}`;
      }

      if (state.compareWithScenario === scenario1Name) {
        compareArray = scenario1Data;
        newLabel = `${scenario1Label} - ${scenario3Label}`;
      }

      if (state.compareWithScenario === scenario2Name) {
        compareArray = scenario2Data;
        newLabel = `${scenario2Label} - ${scenario3Label}`;
      }

      if (state.compareWithScenario === scenario4Name) {
        compareArray = scenario4Data;
        newLabel = `${scenario4Label} - ${scenario3Label}`;
      }
    } else {
      baseArray = scenario4Data;

      if (state.compareWithScenario === scenario0Name) {
        compareArray = scenario0Data;
        newLabel = `${scenario0Label} - ${scenario4Name}`;
      }

      if (state.compareWithScenario === scenario1Name) {
        compareArray = scenario1Data;
        newLabel = `${scenario1Label} - ${scenario4Label}`;
      }

      if (state.compareWithScenario === scenario2Name) {
        compareArray = scenario2Data;
        newLabel = `${scenario2Label} - ${scenario4Label}`;
      }

      if (state.compareWithScenario === scenario3Name) {
        compareArray = scenario3Data;
        newLabel = `${scenario3Label} - ${scenario4Label}`;
      }
    }

    const newArray: number[] = [];
    for (let index = 0; index < baseArray.length; index++) {
      const baseValue = Number(baseArray[index]);
      const compareValue = Number(compareArray[index]);

      const newValue = compareValue - baseValue;
      newArray.push(newValue);
    }

    return {
      labels,
      datasets: [
        {
          label: newLabel,
          fill: false,
          lineTension: 0.1,
          backgroundColor: compareColor,
          borderColor: compareColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: compareColor,
          pointBackgroundColor: compareColor,
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: compareColor,
          pointHoverBorderColor: compareColor,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: newArray,
        },
      ],
    };
  }

  return {
    labels,
    datasets: [
      {
        label: scenario0Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario0Color,
        borderColor: scenario0Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario0Color,
        pointBackgroundColor: scenario0Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario0Color,
        pointHoverBorderColor: scenario0Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario0Data,
      },
      {
        label: scenario1Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario1Color,
        borderColor: scenario1Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario1Color,
        pointBackgroundColor: scenario1Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario1Color,
        pointHoverBorderColor: scenario1Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario1Data,
      },
      {
        label: scenario2Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario2Color,
        borderColor: scenario2Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario2Color,
        pointBackgroundColor: scenario2Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario2Color,
        pointHoverBorderColor: scenario2Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario2Data,
      },
      {
        label: scenario3Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario3Color,
        borderColor: scenario3Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario3Color,
        pointBackgroundColor: scenario3Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario3Color,
        pointHoverBorderColor: scenario3Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario3Data,
      },
      {
        label: scenario4Label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario4Color,
        borderColor: scenario4Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario4Color,
        pointBackgroundColor: scenario4Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario4Color,
        pointHoverBorderColor: scenario4Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: scenario4Data,
      },
    ],
  };
}

export function chartOptionsFactory(t: any) {
  let prefix = 'Area';
  let unity = 'Mha';
  let denominator = 1000;

  return {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: t('ReportAllBiomes.chart.labelX'),
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: `${prefix} (${unity})`,
          },
          ticks: {
            callback: function (value: number) {
              return `${formatNumberDefault(value / denominator)}`;
            },
          },
        },
      ],
    },
    tooltips: {
      mode: 'label',
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          const defaultLabel =
            data.datasets[tooltipItem.datasetIndex].label || '';
          const label = t(`Legend.cardValues.${defaultLabel}`, {
            defaultValue: defaultLabel,
          });

          const value = formatNumberDefault(tooltipItem.yLabel / denominator);
          return `${label}: ${value}`;
        },
      },
    },
    legend: {
      labels: {
        fontSize: 14,
        padding: 20,
      },
    },
  };
}

export function getStyles() {
  return makeStyles(() =>
    createStyles({
      buttonDefault: {
        backgroundColor: '#24806F',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#24806F',
        },
      },
    }),
  )();
}

export function createCharts(
  state: State,
  t: any,
  properties: GeoJSON.GeoJsonProperties | undefined,
) {
  const charts: any = [];
  if (!properties) {
    return charts;
  }

  const info = mapper.getScenarioMetadata(t);

  const datasets = datasetsFactory(
    state,
    properties,
    info.scenariosNames,
    info.labels,
  );
  info.datasetAbbreviation.forEach((selectedName: string, index: number) => {
    const name = info.datasetNames[index];

    if (state.currentAttribute && name === state.currentAttribute) {
      const label = info.datasetLabels[index];
      const description = info.datasetDescriptions[index];

      charts.push({
        name,
        label,
        description,
        data: chartDataFactory(state, selectedName, datasets),
        options: chartOptionsFactory(t),
      });
    }
  });

  return charts;
}

export function createChartsAllBiomes(state: State, t: any, view: View) {
  const lines: any = [];

  const info = mapper.getScenarioMetadata(t);
  let chartLabel = '';
  let chartDescription = '';

  const data = view!.data;
  const features = (data as any).features as any[];
  features.forEach((feature: GeoJSON.Feature) => {
    const datasets = datasetsFactory(
      state,
      feature.properties,
      info.scenariosNames,
      info.labels,
    );
    info.datasetAbbreviation.forEach((selectedName: string, index: number) => {
      const name = info.datasetNames[index];

      if (name === state.currentAttribute) {
        const attributeLabel = info.datasetLabels[index];
        const description = info.datasetDescriptions[index];

        const featureName = (feature.properties as any).nm;
        const featureLabel = t(`Legend.cardValues.${featureName}`, {
          defaultValue: featureName,
        });

        chartLabel = attributeLabel;
        chartDescription = description;

        const scenarioData = mapper.getScenarioData(selectedName, datasets);
        const scenario0Data = scenarioData.datasets[0].data;
        const scenario1Data = scenarioData.datasets[1].data;
        const scenario2Data = scenarioData.datasets[2].data;
        const scenario3Data = scenarioData.datasets[3].data;
        const scenario4Data = scenarioData.datasets[4].data;

        lines.push({
          featureName,
          featureLabel,
          attributeName: name,
          attributeLabel,
          attributeDescription: description,
          scenario0Data,
          scenario1Data,
          scenario2Data,
          scenario3Data,
          scenario4Data,
        });
      }
    });
  });

  const chartDatasets: any = [];
  lines.forEach((line: any) => {
    if (state.compareScenarioEnabled) {
      const compareColor = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      let baseArray = [];
      let compareArray = [];

      const scenario0Data = line.scenario0Data;
      const scenario1Data = line.scenario1Data;
      const scenario2Data = line.scenario2Data;
      const scenario3Data = line.scenario3Data;
      const scenario4Data = line.scenario4Data;

      if (state.currentScenario === scenario0Name) {
        baseArray = scenario0Data;

        if (state.compareWithScenario === scenario1Name) {
          compareArray = scenario1Data;
        }

        if (state.compareWithScenario === scenario2Name) {
          compareArray = scenario2Data;
        }

        if (state.compareWithScenario === scenario3Name) {
          compareArray = scenario3Data;
        }

        if (state.compareWithScenario === scenario4Name) {
          compareArray = scenario4Data;
        }
      } else if (state.currentScenario === scenario1Name) {
        baseArray = scenario1Data;

        if (state.compareWithScenario === scenario0Name) {
          compareArray = scenario0Data;
        }

        if (state.compareWithScenario === scenario2Name) {
          compareArray = scenario2Data;
        }

        if (state.compareWithScenario === scenario3Name) {
          compareArray = scenario3Data;
        }

        if (state.compareWithScenario === scenario4Name) {
          compareArray = scenario4Data;
        }
      } else if (state.currentScenario === scenario2Name) {
        baseArray = scenario2Data;

        if (state.compareWithScenario === scenario0Name) {
          compareArray = scenario0Data;
        }

        if (state.compareWithScenario === scenario1Name) {
          compareArray = scenario1Data;
        }

        if (state.compareWithScenario === scenario3Name) {
          compareArray = scenario3Data;
        }

        if (state.compareWithScenario === scenario4Name) {
          compareArray = scenario4Data;
        }
      } else if (state.currentScenario === scenario3Name) {
        baseArray = scenario3Data;

        if (state.compareWithScenario === scenario0Name) {
          compareArray = scenario0Data;
        }

        if (state.compareWithScenario === scenario1Name) {
          compareArray = scenario1Data;
        }

        if (state.compareWithScenario === scenario2Name) {
          compareArray = scenario2Data;
        }

        if (state.compareWithScenario === scenario4Name) {
          compareArray = scenario4Data;
        }
      } else {
        baseArray = scenario4Data;

        if (state.compareWithScenario === scenario0Name) {
          compareArray = scenario0Data;
        }

        if (state.compareWithScenario === scenario1Name) {
          compareArray = scenario1Data;
        }

        if (state.compareWithScenario === scenario2Name) {
          compareArray = scenario2Data;
        }

        if (state.compareWithScenario === scenario3Name) {
          compareArray = scenario3Data;
        }
      }

      const newArray: number[] = [];
      for (let index = 0; index < baseArray.length; index++) {
        const baseValue = Number(baseArray[index]);
        const compareValue = Number(compareArray[index]);

        const newValue = compareValue - baseValue;
        newArray.push(newValue);
      }

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: compareColor,
        borderColor: compareColor,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: compareColor,
        pointBackgroundColor: compareColor,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: compareColor,
        pointHoverBorderColor: compareColor,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: newArray,
      });
    } else if (state.currentScenario === scenario0Name) {
      const scenario0Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario0Color,
        borderColor: scenario0Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario0Color,
        pointBackgroundColor: scenario0Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario0Color,
        pointHoverBorderColor: scenario0Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.scenario0Data,
      });
    } else if (state.currentScenario === scenario1Name) {
      const scenario1Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario1Color,
        borderColor: scenario1Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario1Color,
        pointBackgroundColor: scenario1Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario1Color,
        pointHoverBorderColor: scenario1Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.scenario1Data,
      });
    } else if (state.currentScenario === scenario2Name) {
      const scenario2Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario2Color,
        borderColor: scenario2Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario2Color,
        pointBackgroundColor: scenario2Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario2Color,
        pointHoverBorderColor: scenario2Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.scenario2Data,
      });
    } else if (state.currentScenario === scenario3Name) {
      const scenario3Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario3Color,
        borderColor: scenario3Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario3Color,
        pointBackgroundColor: scenario3Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario3Color,
        pointHoverBorderColor: scenario3Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.scenario3Data,
      });
    } else {
      const scenario4Color = getFeatureColor(
        line.featureName,
        view!.style!.value!,
      );

      chartDatasets.push({
        label: `${line.featureLabel}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: scenario4Color,
        borderColor: scenario4Color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: scenario4Color,
        pointBackgroundColor: scenario4Color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: scenario4Color,
        pointHoverBorderColor: scenario4Color,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: line.scenario4Data,
      });
    }
  });

  return {
    label: chartLabel,
    description: chartDescription,
    data: {
      labels: info.labels,
      datasets: chartDatasets,
    },
    options: chartOptionsFactory(t),
  };
}

function getRandomColor() {
  return '#' + (((1 << 24) * Math.random()) | 0).toString(16);
}

function getFeatureColor(featureName: string, style: any[]) {
  const found = style.find((s: any) => s.valueString === featureName);
  if (found) {
    return found.style.fillColor;
  }

  return getRandomColor();
}
