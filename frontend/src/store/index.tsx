import { MapProps, TimelineOption, View, ViewType } from 'containers/Types';
import { useReducer } from 'react';
import { createContainer } from 'react-tracked';

// { [name: string]: any; } | null
export type State = {
  currentScenario: string;
  currentAttribute: string;
  currentBorder: string;
  currentBackground: string;
  currentYear: number;
  changeFromYear: number;
  currentTimelineOption: TimelineOption;
  views: View[];
  mapPropeties: MapProps;
  colors: { [name: string]: any };
  compareScenarioEnabled: boolean;
  compareWithScenario: string;
};

type Action =
  | { type: 'ADD_VIEW'; view: View }
  | { type: 'TOGGLE_VIEW'; viewType: ViewType; name: string; visible: boolean }
  | { type: 'SET_CURRENT_YEAR'; year: number }
  | { type: 'SET_CHANGE_FROM_YEAR'; year: number }
  | { type: 'SET_TIMELINE_OPTION'; option: TimelineOption }
  | { type: 'SET_MAP_TOOLTIP'; enabled: boolean }
  | { type: 'SET_ENABLE_COMPARE_SCENARIO'; enabled: boolean }
  | { type: 'SET_COMPARE_SCENARIO'; name: string };

export const initialState: State = {
  currentScenario: 'IDC2',
  currentAttribute: 'Forest vegetation',
  currentBorder: 'Biomes',
  currentBackground: 'None',
  currentYear: 2020,
  changeFromYear: 2020,
  currentTimelineOption: TimelineOption.ABSOLUTE,
  views: [],
  mapPropeties: {
    lat: -15.35143,
    lng: -49.01675,
    zoom: 4,
    dataTooltipsEnabled: true,
  },
  colors: {
    None: 'rgba(117,117,117,1)',
    IDC2: 'rgba(215,25,28,1)',
    FC: 'rgba(253,174,97,1)',
    FCnoCRA: 'rgba(229,229,171,1)',
    FCnoSFA: 'rgba(171,221,164,1)',
    FCnoCRAnoSFA: 'rgba(43,131,186,1)',
  },
  compareScenarioEnabled: false,
  compareWithScenario: '',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_VIEW':
      const newStateAddView = {
        ...state,
        views: [...state.views, action.view],
        mapProperties: { ...state.mapPropeties },
      };

      if (action.view.visible) {
        if (action.view.type === ViewType.SCENARIO) {
          newStateAddView.currentScenario = action.view.name;
        }

        if (action.view.type === ViewType.ATTRIBUTE) {
          newStateAddView.currentAttribute = action.view.name;
        }

        if (action.view.type === ViewType.BORDER) {
          newStateAddView.currentBorder = action.view.name;
        }

        if (action.view.type === ViewType.BACKGROUND) {
          newStateAddView.currentBackground = action.view.name;
        }
      }

      return newStateAddView;
    case 'TOGGLE_VIEW':
      const resetViews = state.views.map((view) => {
        if (view.type === action.viewType) {
          return { ...view, visible: false };
        }

        return { ...view };
      });

      const newViews = resetViews.map((view) => {
        if (view.type === action.viewType && view.name === action.name) {
          return { ...view, visible: action.visible };
        }

        return { ...view };
      });

      const newState = {
        ...state,
        mapPropeties: {
          ...state.mapPropeties,
          dataTooltipsEnabled: false,
        },
      };

      const viewActive = newViews.find(
        (view) => view.type === action.viewType && view.visible,
      );
      if (viewActive) {
        if (viewActive.type === ViewType.SCENARIO) {
          newState.currentScenario = viewActive.name;
        }

        if (viewActive.type === ViewType.ATTRIBUTE) {
          newState.currentAttribute = viewActive.name;
        }

        if (viewActive.type === ViewType.BORDER) {
          newState.currentBorder = viewActive.name;
          newState.mapPropeties.dataTooltipsEnabled =
            viewActive.visible && viewActive.data !== undefined;
        }

        if (viewActive.type === ViewType.BACKGROUND) {
          newState.currentBackground = viewActive.name;
        }

        newState.views = newViews;
      }

      const borderActive = newViews.find(
        (view) =>
          view.type === ViewType.BORDER && view.visible && view.name !== 'None',
      );

      if (borderActive) {
        newState.mapPropeties.dataTooltipsEnabled = true;
      }

      return newState;
    case 'SET_CURRENT_YEAR':
      return {
        ...state,
        currentYear: action.year,
      };
    case 'SET_CHANGE_FROM_YEAR':
      return {
        ...state,
        currentYear: action.year,
        changeFromYear: action.year,
      };
    case 'SET_TIMELINE_OPTION':
      return {
        ...state,
        currentTimelineOption: action.option,
      };
    case 'SET_MAP_TOOLTIP':
      return {
        ...state,
        mapPropeties: {
          ...state.mapPropeties,
          dataTooltipsEnabled: action.enabled,
        },
      };
    case 'SET_ENABLE_COMPARE_SCENARIO':
      return {
        ...state,
        compareScenarioEnabled: action.enabled,
      };
    case 'SET_COMPARE_SCENARIO':
      return {
        ...state,
        compareWithScenario: action.name,
      };
    default:
      return state;
  }
};

const useValue = () => useReducer(reducer, initialState);

export const {
  Provider,
  useTrackedState,
  useUpdate: useDispatch,
} = createContainer(useValue);
