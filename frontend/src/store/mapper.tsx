import { State } from 'store';
import { permutator } from './utils';

const years = ['2020', '2030', '2040', '2050'];

const colsMap: any = {
  'Natural Vegetation': 'natveg',
  'Forest Regenerated': 'forreg',
  'Planted Forest': 'pltfor',
  Agriculture: 'cropland',
  Pasture: 'pasture',
  'CR Carbon': 'cr_carbon',
};

const scenarioPropMap: any = {
  idc2: 'idc2_dd',
  fc: 'fcdd',
  fcnocra: 'fcnocra_dd',
  fcnosfa: 'fcnosfa',
  fcnocranosfa: 'fcnocranosfa',
};

const scenarioNameMap: any = {
  idc2_dd: 'IDC2',
  fcdd: 'FC',
  fcnocra_dd: 'FCnoCRA',
  fcnosfa: 'FCnoSFA',
  fcnocranosfa: 'FCnoCRAnoSFA',
};

const scenarioColorMap: any = {
  none: 'rgba(117,117,117,1)',
  idc2_dd: 'rgba(215,25,28,1)',
  fcdd: 'rgba(253,174,97,1)',
  fcnocra_dd: 'rgba(229,229,171,1)',
  fcnosfa: 'rgba(171,221,164,1)',
  fcnocranosfa: 'rgba(43,131,186,1)',
};

const scenarioColorMapFriendly = {
  NONE: 'rgba(117,117,117,1)',
  IDC2: 'rgba(215,25,28,1)',
  FC: 'rgba(253,174,97,1)',
  FCnoCRA: 'rgba(229,229,171,1)',
  FCnoSFA: 'rgba(171,221,164,1)',
  FCnoCRAnoSFA: 'rgba(43,131,186,1)',
};

const scenarioNameFriendly = {
  IDC2: 'Baseline',
  FC: 'FC',
  FCnoCRA: 'FCnoCRA',
  FCnoSFA: 'FCnoSFA',
  FCnoCRAnoSFA: 'FCnoCRAnoSFA',
};

const scenarioName = {
  IDC2: 'IDC2',
  FC: 'FC',
  FCnoCRA: 'FCnoCRA',
  FCnoSFA: 'FCnoSFA',
  FCnoCRAnoSFA: 'FCnoCRAnoSFA',
};

const scenariosFriendlyNames = Object.values(scenarioNameFriendly) as string[];
const scenariosShortNames = Object.keys(scenarioPropMap) as string[];
const scenariosNames = Object.values(scenarioPropMap) as string[];
const datasetAbbreviation = Object.values(colsMap) as string[];
const scenariosNamesUpper = Object.values(scenarioName) as string[];
const scenariosFriendlyNamesPermutation = permutator(scenariosFriendlyNames);

const containsAttribute = (attribute: string): boolean => {
  return colsMap.hasOwnProperty(attribute);
};

const containsCurrentAttribute = (state: State): boolean => {
  return containsAttribute(state.currentAttribute);
};

const getAttributeName = (attribute: string): string => {
  return colsMap[attribute];
};

const getScenarioName = (scenario: string): string => {
  return scenarioPropMap[scenario.toLowerCase()];
};

const getYear = (year: number) => {
  return year.toString().slice(-2);
};

const getFieldName = (
  state: State,
  scenarioName: string,
  yearValue: number,
): string => {
  const scenario = getScenarioName(scenarioName);
  const year = getYear(yearValue);
  const attribute = getAttributeName(state.currentAttribute);
  return `${scenario}_${attribute}${year}`.toLowerCase();
};

const getFieldValue = (
  state: State,
  geoJsonProperties: any,
  scenarioName: string,
  yearValue: number,
): number | undefined => {
  let fieldName = getFieldName(state, scenarioName, yearValue);
  let fieldValue = geoJsonProperties[fieldName];

  if (!fieldValue) {
    fieldName = fieldName.toLowerCase();
    fieldValue = geoJsonProperties[fieldName];
  }

  return fieldValue;
};

const getCurrentScenarioFieldValue = (
  state: State,
  geoJsonProperties: any,
): number | undefined => {
  return getFieldValue(
    state,
    geoJsonProperties,
    state.currentScenario,
    state.currentYear,
  );
};

const getCurrentScenarioDifferenceFieldValue = (
  state: State,
  geoJsonProperties: any,
): number | undefined => {
  return getFieldValue(
    state,
    geoJsonProperties,
    state.currentScenario,
    state.changeFromYear,
  );
};

const getCompareScenarioFieldValue = (
  state: State,
  geoJsonProperties: any,
): number | undefined => {
  return getFieldValue(
    state,
    geoJsonProperties,
    state.compareWithScenario,
    state.currentYear,
  );
};

const getScenarioMetadata = (t: any) => {
  const labels = years;
  const datasetNames = [
    t('Drawer.SideContent.attribute.chips.0.name'),
    t('Drawer.SideContent.attribute.chips.1.name'),
    t('Drawer.SideContent.attribute.chips.2.name'),
    t('Drawer.SideContent.attribute.chips.3.name'),
    t('Drawer.SideContent.attribute.chips.4.name'),
    t('Drawer.SideContent.attribute.chips.5.name'),
  ];
  const datasetLabels = [
    t('Drawer.SideContent.attribute.chips.0.label'),
    t('Drawer.SideContent.attribute.chips.1.label'),
    t('Drawer.SideContent.attribute.chips.2.label'),
    t('Drawer.SideContent.attribute.chips.3.label'),
    t('Drawer.SideContent.attribute.chips.4.label'),
    t('Drawer.SideContent.attribute.chips.5.label'),
  ];
  const datasetDescriptions = [
    t('Drawer.SideContent.attribute.chips.0.description'),
    t('Drawer.SideContent.attribute.chips.1.description'),
    t('Drawer.SideContent.attribute.chips.2.description'),
    t('Drawer.SideContent.attribute.chips.3.description'),
    t('Drawer.SideContent.attribute.chips.4.description'),
    t('Drawer.SideContent.attribute.chips.5.description'),
  ];
  return {
    labels,
    scenariosFriendlyNames: scenariosNamesUpper,
    scenariosShortNames,
    scenariosNames,
    datasetAbbreviation,
    datasetNames,
    datasetLabels,
    datasetDescriptions,
  };
};

const getScenarioData = (
  datasetName: string,
  datasets: { [name: string]: any },
) => {
  let property = datasets[datasetName];

  if (!property) {
    property = datasets[datasetName.toLowerCase()];
  }

  const labels = property[scenariosNames[0] as any].labels as string[];

  const data: any = {
    names: scenariosNames,
    shortNames: scenariosShortNames,
    friendlyNames: scenariosNamesUpper,
    labels,
  };

  const scenariosDatasets: any = [];
  scenariosNames.forEach((name: any) => {
    scenariosDatasets.push({
      data: property[name].data,
      label: scenarioNameMap[name],
      color: scenarioColorMap[name],
    });
  });

  data.datasets = scenariosDatasets;

  return data;
};

const getScenarioSwitchText = (state: State) => {
  const scenario1Name = scenariosNamesUpper[1];
  const scenario2Name = scenariosNamesUpper[2];
  const scenario3Name = scenariosNamesUpper[3];

  if (state.currentScenario === scenario1Name) {
    return { option1: scenario2Name, option2: scenario3Name };
  }

  if (state.currentScenario === scenario2Name) {
    return { option1: scenario1Name, option2: scenario3Name };
  }

  return { option1: scenario1Name, option2: scenario2Name };
};

const getSwitchOptions = (state: State): string[] => {
  const currentScenarioLabel = (scenarioNameFriendly as any)[
    state.currentScenario
  ];
  const values = scenariosFriendlyNamesPermutation.find(
    (values: string[]) => values[0] === currentScenarioLabel,
  );
  if (!values) {
    return [];
  }
  return values.slice(1);
};

const getScenariosShip = () => {
  return scenarioColorMapFriendly;
};

const getScenarioNamesFriendly = () => {
  return scenarioNameFriendly;
};

const getScenarioNames = () => {
  return scenarioName;
};

export default {
  containsCurrentAttribute,
  getFieldValue,
  getCurrentScenarioFieldValue,
  getCurrentScenarioDifferenceFieldValue,
  getCompareScenarioFieldValue,
  getScenarioMetadata,
  getScenarioData,
  getScenarioSwitchText,
  getSwitchOptions,
  getScenariosShip,
  getScenarioNamesFriendly,
  getScenarioNames,
};
