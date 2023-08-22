import { State } from 'store';
import { TimelineOption, View, ViewType } from 'containers/Types';

export const filter = (state: State, viewType: ViewType): View[] => {
  return state.views.filter((view: View) => view.type === viewType);
};

export const filterByName = (
  state: State,
  viewType: ViewType,
  name: string,
): View | undefined => {
  return state.views.find(
    (view: View) => view.type === viewType && view.name === name,
  );
};

export const getScenarioMapper = (t: any) => {
  return {
    IDC2: t('Drawer.SideContent.scenario.chips.0.label'),
    FC: t('Drawer.SideContent.scenario.chips.1.label'),
    FCnoCRA: t('Drawer.SideContent.scenario.chips.2.label'),
    FCnoSFA: t('Drawer.SideContent.scenario.chips.3.label'),
    FCnoCRAnoSFA: t('Drawer.SideContent.scenario.chips.4.label'),
  } as any;
};

export const getAttributesMapper = (t: any) => {
  return {
    'Natural Vegetation': t('Drawer.SideContent.attribute.chips.0.label'),
    'Forest Regenerated': t('Drawer.SideContent.attribute.chips.1.label'),
    'Planted Forest': t('Drawer.SideContent.attribute.chips.2.label'),
    Agriculture: t('Drawer.SideContent.attribute.chips.3.label'),
    Pasture: t('Drawer.SideContent.attribute.chips.4.label'),
    'CR Carbon': t('Drawer.SideContent.attribute.chips.5.label'),
  } as any;
};

export const getBorderMapper = (t: any) => {
  return {
    Biomes: t('Drawer.SideContent.border.chips.1.label'),
    Brazil: t('Drawer.SideContent.border.chips.2.label'),
    Regions: t('Drawer.SideContent.border.chips.3.label'),
    States: t('Drawer.SideContent.border.chips.4.label'),
  } as any;
};

export const getLabelSelected = (state: State, t: any, type: ViewType) => {
  if ([ViewType.ATTRIBUTE, ViewType.BACKGROUND].includes(type)) {
    return getAttributesMapper(t)[state.currentAttribute];
  }

  if (ViewType.BORDER === type) {
    return getBorderMapper(t)[state.currentBorder];
  }

  throw Error(`Label for type ${type} is undefined.`);
};

export const getMapTitleEn = (state: State, t: any) => {
  if (state.currentBorder === 'None') {
    return null;
  }

  const scenarioMapper = getScenarioMapper(t);
  const attributesMapper = getAttributesMapper(t);
  const borderMapper = getBorderMapper(t);

  const isDifference =
    TimelineOption.DIFFERENCE === state.currentTimelineOption;

  const borderPrefix = state.currentBorder === 'Brazil' ? 'in' : 'per';
  const borderDescription =
    state.currentBorder === 'None'
      ? ''
      : ` ${borderPrefix} ${borderMapper[state.currentBorder]}`;

  const unitType = 'Area';

  let title = `${
    attributesMapper[state.currentAttribute]
  } ${unitType}${borderDescription} in Scenario ${
    scenarioMapper[state.currentScenario]
  } for ${state.currentYear}`;
  if (isDifference) {
    title = `Change of ${
      attributesMapper[state.currentAttribute]
    } ${unitType} from ${state.changeFromYear} to ${
      state.currentYear
    } ${borderPrefix} ${borderMapper[state.currentBorder]} in Scenario ${
      scenarioMapper[state.currentScenario]
    }`;
  }

  if (state.compareScenarioEnabled) {
    title = `Change of ${
      attributesMapper[state.currentAttribute]
    } ${unitType} for Scenario ${
      scenarioMapper[state.compareWithScenario]
    } minus ${scenarioMapper[state.currentScenario]} in ${
      state.currentYear
    } ${borderPrefix} ${borderMapper[state.currentBorder]}`;
  }

  return title;
};

export const getMapTitlePt = (state: State, t: any) => {
  if (state.currentBorder === 'None') {
    return null;
  }

  const scenarioMapper = getScenarioMapper(t);
  const attributesMapper = getAttributesMapper(t);
  const borderMapper = getBorderMapper(t);

  const isDifference =
    TimelineOption.DIFFERENCE === state.currentTimelineOption;

  const borderPrefix = state.currentBorder === 'Brazil' ? 'no' : 'por';
  const borderDescription =
    state.currentBorder === 'None'
      ? ''
      : ` ${borderPrefix} ${borderMapper[state.currentBorder]}`;

  const unitType = 'Área';

  let title = `${unitType} de ${
    attributesMapper[state.currentAttribute]
  } ${borderDescription} no Cenário ${
    scenarioMapper[state.currentScenario]
  } em ${state.currentYear}`;
  if (isDifference) {
    title = `Mudanças de ${unitType} de ${
      attributesMapper[state.currentAttribute]
    } de 2020 à ${state.currentYear} ${borderPrefix} ${
      borderMapper[state.currentBorder]
    } no Cenário ${scenarioMapper[state.currentScenario]}`;
  }

  if (state.compareScenarioEnabled) {
    title = `Mudanças de ${unitType} de ${
      attributesMapper[state.currentAttribute]
    } no Cenário ${scenarioMapper[state.compareWithScenario]} menos ${
      scenarioMapper[state.currentScenario]
    } em ${state.currentYear} ${borderPrefix} ${
      borderMapper[state.currentBorder]
    }`;
  }

  return title;
};

/**
 * https://stackoverflow.com/questions/9960908/permutations-in-javascript
 *
 * @param selected
 * @param inputArr
 * @returns
 */
export const permutator = (inputArr: string[]): string[][] => {
  const result: string[][] = [];

  const permute = (arr: string[], m: string[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};
