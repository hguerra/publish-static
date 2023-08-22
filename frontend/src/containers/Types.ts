export type MapPropsViewStyle = {
  color: string;
  weight: number;
  fillOpacity: number;
  fillColor: string;
};

export enum MapPropsViewStyleValueType {
  ANY = 'ANY',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  RANGE = 'RANGE',
}

export type ViewStyleValue = {
  valueString?: string;
  valueNumber?: number;
  valueRange?: { start: number; end: number };
  displayValuePrefix?: string;
  displayValueSuffix?: string;
  style: MapPropsViewStyle;
};

export type ViewStyleKeyValue = {
  type: MapPropsViewStyleValueType;
  key: string;
  value: ViewStyleValue[];
};

export type MapPropsLayer = {
  name: string;
  style: ViewStyleKeyValue;
};

export type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
  dataTooltipsEnabled: boolean;
};

export type LegendValue = {
  icon: string;
  fillColor: string;
  label: string;
  name: string;
};

export enum ViewType {
  SCENARIO = 'SCENARIO',
  ATTRIBUTE = 'ATTRIBUTE',
  BORDER = 'BORDER',
  BACKGROUND = 'BACKGROUND',
}

export type View = {
  name: string;
  label: string;
  type: ViewType;
  visible: boolean;
  description: string;
  url?: string;
  data?: GeoJSON.GeoJsonObject;
  style?: ViewStyleKeyValue;
};

export enum TimelineOption {
  ABSOLUTE = 'Absolute values',
  DIFFERENCE = 'Change from 2020',
}
