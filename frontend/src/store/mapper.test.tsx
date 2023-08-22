import { initialState } from '.';
import mapper from './mapper';

test('mapper#getScenarioSwitchText', () => {
  let testState = {
    ...initialState,
    compareScenarioEnabled: true,
  };

  let option = mapper.getScenarioSwitchText(testState);
  expect(option.option1).toBe('FC');
  expect(option.option2).toBe('FCnoCRA');

  testState = {
    ...initialState,
    compareScenarioEnabled: true,
    currentScenario: 'FCnoCRA',
  };

  option = mapper.getScenarioSwitchText(testState);
  expect(option.option1).toBe('FC');
  expect(option.option2).toBe('FCnoSFA');

  testState = {
    ...initialState,
    compareScenarioEnabled: true,
    currentScenario: 'FCnoSFA',
  };

  option = mapper.getScenarioSwitchText(testState);
  expect(option.option1).toBe('FC');
  expect(option.option2).toBe('FCnoCRA');
});

test('mapper#getSwitchOptions', () => {
  let testState = {
    ...initialState,
    compareScenarioEnabled: true,
  };

  let options = mapper.getSwitchOptions(testState);
  expect(JSON.stringify(options)).toBe(
    JSON.stringify(['FC', 'FCnoCRA', 'FCnoSFA', 'FCnoCRAnoSFA']),
  );

  testState = {
    ...initialState,
    compareScenarioEnabled: true,
    currentScenario: 'FCnoCRA',
  };

  options = mapper.getSwitchOptions(testState);
  expect(JSON.stringify(options)).toBe(
    JSON.stringify(['Baseline', 'FC', 'FCnoSFA', 'FCnoCRAnoSFA']),
  );

  testState = {
    ...initialState,
    compareScenarioEnabled: true,
    currentScenario: 'FCnoSFA',
  };

  options = mapper.getSwitchOptions(testState);
  expect(JSON.stringify(options)).toBe(
    JSON.stringify(['Baseline', 'FC', 'FCnoCRA', 'FCnoCRAnoSFA']),
  );
});

test('mapper#getScenariosShip', () => {
  const result = mapper.getScenariosShip();
  expect(JSON.stringify(result)).toBe(
    '{"Baseline":"rgba(43,131,186,1)","FC":"rgba(171,221,164,1)","FCnoCRA":"rgba(255,255,191,1)","FCnoSFA":"rgba(253,174,97,1)","FCnoCRAnoSFA":"rgba(215,25,28,1)"}',
  );
});
