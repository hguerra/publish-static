import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TimelineOption, ViewType } from 'containers/Types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useTrackedState } from 'store';
import SideChipList from './SideChipList';
import SideChipListCompareScenario from './SideChipListCompareScenario';
import './style.scss';

import mapper from 'store/mapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 275,
      position: 'absolute',
      zIndex: 1199,
      // left: 56,
      left: 0,
      height: '100%',
    },
    cardContent: {
      padding: '68px 8px',
      overflow: 'auto',
      height: '610px',
      marginTop: '6px',
      [theme.breakpoints.up('xl')]: {
        height: 'auto',
      },
    },
    main: {
      width: '100%',
    },
    customAccordionSummary: {
      padding: '0px 8px',
    },
    customAccordionDetails: {
      flexWrap: 'wrap',
      padding: '0px 4px 4px',
    },
    heading: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightMedium,
    },
    chipSpacing: {
      margin: '2px 4px',
      [theme.breakpoints.up('xl')]: {
        margin: '2px',
        fontSize: '12px',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      marginLeft: '12px',
    },
    switch: {
      marginBottom: '6px',
      marginLeft: 8,
    },
    compareSwitch: {
      width: '100%',
      margin: '12px 8px 5px 8px',
    },
  }),
);

function SideContent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { t } = useTranslation();

  const [stateCompareSwitch, setStateCompareSwitch] = React.useState({
    checkedA: true,
    checkedB: false,
  });

  const [compareOption, setCompareOption] = React.useState(-1);

  const isDisabledMapTooltip = () => {
    return state.currentBorder === 'None';
  };

  const isDisabledSwitchTimelieOptions = () => {
    return state.compareScenarioEnabled || state.changeFromYear > 2020;
  };

  const isDisabledCompareScenario = () => {
    return TimelineOption.DIFFERENCE === state.currentTimelineOption;
  };

  const getScenarioSwitchTextLabel = () => {
    return t('Drawer.SideContent.scenario.buttons.buttonCompare');
  };

  const handleSwitchMapTooltip = () => {
    const checked = !state.mapPropeties.dataTooltipsEnabled;
    dispatch({
      type: 'SET_MAP_TOOLTIP',
      enabled: checked,
    });
  };
  const [
    switchStateTimelineOption,
    setSwitchStateTimelineOption,
  ] = React.useState({
    checkedA: false,
    checkedB: true,
  });

  const getSwitchLabelTooltips = (): string => {
    return state.mapPropeties.dataTooltipsEnabled
      ? t('Drawer.SideContent.settings.chips.2.label')
      : t('Drawer.SideContent.settings.chips.3.label');
  };

  const getSwitchLabelValues = (): string => {
    return TimelineOption.ABSOLUTE === state.currentTimelineOption
      ? t('Drawer.SideContent.settings.chips.0.label')
      : t('Drawer.SideContent.settings.chips.1.label');
  };

  const getSwitchMapTooltipDescription = (): string => {
    return t('Drawer.SideContent.settings.chips.2.description');
  };

  const getSwitchTimelineDescription = (): string => {
    return TimelineOption.ABSOLUTE === state.currentTimelineOption
      ? t('Drawer.SideContent.settings.chips.0.description')
      : t('Drawer.SideContent.settings.chips.1.description');
  };

  const handleChangeSwitchTimelineOption = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    if (checked) {
      dispatch({
        type: 'SET_TIMELINE_OPTION',
        option: TimelineOption.DIFFERENCE,
      });
    } else {
      dispatch({
        type: 'SET_TIMELINE_OPTION',
        option: TimelineOption.ABSOLUTE,
      });
    }

    setSwitchStateTimelineOption({
      ...switchStateTimelineOption,
      [event.target.name]: checked,
    });
  };

  const handleCompareSwitchChange = (event: any) => {
    const checked = event.target.checked;

    let compareWith = '';
    let switchOption = -1;
    if (checked) {
      const options = mapper.getSwitchOptions(state);

      switchOption = 0;
      if (compareOption === 0) {
        switchOption = 1;
      }
      if (compareOption === 1) {
        switchOption = 2;
      }
      if (compareOption === 2) {
        switchOption = 3;
      }
      if (compareOption === 3) {
        switchOption = 4;
      }

      compareWith = options[switchOption];
    }

    setCompareOption(switchOption);

    dispatch({
      type: 'SET_COMPARE_SCENARIO',
      name: compareWith,
    });

    // console.log('>> SideContent#handleCompareSwitchChange', compareOption, switchOption, compareWith);

    setStateCompareSwitch({
      ...stateCompareSwitch,
      [event.target.name]: checked,
    });

    dispatch({
      type: 'SET_ENABLE_COMPARE_SCENARIO',
      enabled: checked,
    });
  };

  const getScenarioSideChipList = () => {
    if (state.compareScenarioEnabled) {
      return (
        <SideChipListCompareScenario
          viewType={ViewType.SCENARIO}
          className={classes.chipSpacing}
          backgroundColorOnActive={mapper.getScenariosShip()}
        />
      );
    }

    return (
      <SideChipList
        viewType={ViewType.SCENARIO}
        className={classes.chipSpacing}
        backgroundColorOnActive={mapper.getScenariosShip()}
      />
    );
  };

  const getScenarioDetails = () => {
    return (
      <>
        {getScenarioSideChipList()}

        <div className={classes.compareSwitch}>
          <FormControlLabel
            control={
              <Switch
                checked={stateCompareSwitch.checkedB}
                onChange={handleCompareSwitchChange}
                name="checkedB"
                color="primary"
                size="small"
              />
            }
            label={getScenarioSwitchTextLabel()}
            disabled={isDisabledCompareScenario()}
          />
        </div>
      </>
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.cardContent}>
        <div className={classes.main}>
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              className={classes.customAccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                {t('Drawer.SideContent.scenario.title')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.customAccordionDetails}>
              {getScenarioDetails()}
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={true}>
            <AccordionSummary
              className={classes.customAccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>
                {t('Drawer.SideContent.attribute.title')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.customAccordionDetails}>
              <SideChipList
                viewType={ViewType.ATTRIBUTE}
                className={classes.chipSpacing}
                backgroundColorOnActive={state.colors.None}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={true}>
            <AccordionSummary
              className={classes.customAccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>
                {t('Drawer.SideContent.border.title')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.customAccordionDetails}>
              <SideChipList
                viewType={ViewType.BORDER}
                className={classes.chipSpacing}
                backgroundColorOnActive={state.colors.None}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={true}>
            <AccordionSummary
              className={classes.customAccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className={classes.heading}>
                {t('Drawer.SideContent.settings.title')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.customAccordionDetails}>
              <Tooltip title={getSwitchTimelineDescription()} arrow>
                <FormControlLabel
                  className={classes.switch}
                  control={
                    <Switch
                      size="small"
                      checked={switchStateTimelineOption.checkedA}
                      onChange={handleChangeSwitchTimelineOption}
                      name="checkedA"
                      color="primary"
                    />
                  }
                  label={getSwitchLabelValues()}
                  disabled={isDisabledSwitchTimelieOptions()}
                />
              </Tooltip>

              <Tooltip title={getSwitchMapTooltipDescription()} arrow>
                <FormControlLabel
                  style={{
                    marginLeft: 8,
                    marginRight: '-2px',
                  }}
                  control={
                    <Switch
                      checked={state.mapPropeties.dataTooltipsEnabled}
                      onChange={handleSwitchMapTooltip}
                      color="primary"
                      size="small"
                    />
                  }
                  label={getSwitchLabelTooltips()}
                  disabled={isDisabledMapTooltip()}
                />
              </Tooltip>
            </AccordionDetails>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(SideContent);
