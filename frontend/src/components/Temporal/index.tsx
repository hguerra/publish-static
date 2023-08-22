import {
  Button,
  Card,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { TimelineOption } from 'containers/Types';
import debounce from 'lodash.debounce';
import React from 'react';
import { useDispatch, useTrackedState } from 'store';
import mapper from 'store/mapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      position: 'fixed',
      zIndex: 1198,
      display: 'flex',
      bottom: '16px',
      justifyContent: 'center',
      right: '40px',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        left: 0,
        bottom: 0,
        zIndex: 1200,
        right: 0,
      },
    },
    slider: {
      width: 500 + theme.spacing(3) * 2,
      display: 'block',
      background: '#fff',
      padding: '8px 26px 0',
      position: 'relative',
      left: '40px',
      [theme.breakpoints.down('xs')]: {
        left: 0,
      },
    },
    content: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: '24px',
    },
    margin: {
      height: theme.spacing(3),
    },
  }),
);

const thumbShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const defaultMarks = [
  {
    value: 0,
    label: '2020',
  },
  {
    value: 33,
    label: '2030',
  },
  {
    value: 66,
    label: '2040',
  },
  {
    value: 100,
    label: '2050',
  },
];

const createTemporalSlider = (
  barColor: string,
  buttonColor: string,
  trackHeight: number,
) => {
  return React.memo(
    withStyles({
      root: {
        color: barColor,
        height: 2,
        padding: '16px 0',
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: buttonColor,
        boxShadow: thumbShadow,
        marginTop: -12,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
          boxShadow:
            '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            boxShadow: thumbShadow,
          },
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 12px)',
        top: -18,
        '& *': {
          background: 'transparent',
          color: '#000',
        },
      },
      track: {
        height: trackHeight,
      },
      rail: {
        height: 2,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
      },
      mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
      },
      markActive: {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    })(Slider),
  );
};

// TODO bug #38 Com funcoes genericas lendo as cores do state, nao e possivel
// deslocar a barra do tempo mais do que 1 ano por vez.
const colors = mapper.getScenariosShip();

const TemporalSliderScenarioIDC2Difference = createTemporalSlider(
  colors.IDC2,
  colors.IDC2,
  3,
);
const TemporalSliderScenarioIDC2Absolute = createTemporalSlider(
  colors.NONE,
  colors.IDC2,
  0,
);

const TemporalSliderScenarioFCDifference = createTemporalSlider(
  colors.FC,
  colors.FC,
  3,
);
const TemporalSliderScenarioFCAbsolute = createTemporalSlider(
  colors.NONE,
  colors.FC,
  0,
);
const TemporalSliderScenarioFCnoCRADifference = createTemporalSlider(
  colors.FCnoCRA,
  colors.FCnoCRA,
  3,
);
const TemporalSliderScenarioFCnoCRAAbsolute = createTemporalSlider(
  colors.NONE,
  colors.FCnoCRA,
  0,
);

const TemporalSliderScenarioFCnoSFADifference = createTemporalSlider(
  colors.FCnoSFA,
  colors.FCnoSFA,
  3,
);
const TemporalSliderScenarioFCnoSFAAbsolute = createTemporalSlider(
  colors.NONE,
  colors.FCnoSFA,
  0,
);

const TemporalSliderScenarioFCnoCRAnoSFADifference = createTemporalSlider(
  colors.FCnoCRAnoSFA,
  colors.FCnoCRAnoSFA,
  3,
);
const TemporalSliderScenarioFCnoCRAnoSFAAbsolute = createTemporalSlider(
  colors.NONE,
  colors.FCnoCRAnoSFA,
  0,
);

const TemporalSliderCompareScenario = createTemporalSlider(
  colors.NONE,
  colors.NONE,
  0,
);

function Temporal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useTrackedState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [sliderValue, setSliderValue] = React.useState<number | number[]>(0);
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(false);

  const validYears = [2020];
  const [selectedYear, setSelectedYear] = React.useState<number>(validYears[0]);
  const [marks, setMarks] = React.useState<{ value: number; label: string }[]>(
    defaultMarks,
  );

  const upperNames = mapper.getScenarioNames();

  const getScenarioComponent = (): JSX.Element => {
    if (state.compareScenarioEnabled) {
      return (
        <TemporalSliderCompareScenario
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    }

    if (TimelineOption.DIFFERENCE === state.currentTimelineOption) {
      if (state.currentScenario === upperNames.IDC2) {
        return (
          <TemporalSliderScenarioIDC2Difference
            aria-label="slider"
            value={sliderValue}
            step={null}
            marks={marks}
            valueLabelDisplay="off"
            disabled={buttonDisabled}
            onChange={handleChangeSlider}
          />
        );
      } else if (state.currentScenario === upperNames.FC) {
        return (
          <TemporalSliderScenarioFCDifference
            aria-label="slider"
            value={sliderValue}
            step={null}
            marks={marks}
            valueLabelDisplay="off"
            disabled={buttonDisabled}
            onChange={handleChangeSlider}
          />
        );
      } else if (state.currentScenario === upperNames.FCnoCRA) {
        return (
          <TemporalSliderScenarioFCnoCRADifference
            aria-label="slider"
            value={sliderValue}
            step={null}
            marks={marks}
            valueLabelDisplay="off"
            disabled={buttonDisabled}
            onChange={handleChangeSlider}
          />
        );
      } else if (state.currentScenario === upperNames.FCnoSFA) {
        return (
          <TemporalSliderScenarioFCnoSFADifference
            aria-label="slider"
            value={sliderValue}
            step={null}
            marks={marks}
            valueLabelDisplay="off"
            disabled={buttonDisabled}
            onChange={handleChangeSlider}
          />
        );
      }

      return (
        <TemporalSliderScenarioFCnoCRAnoSFADifference
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    }

    if (state.currentScenario === upperNames.IDC2) {
      return (
        <TemporalSliderScenarioIDC2Absolute
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    } else if (state.currentScenario === upperNames.FC) {
      return (
        <TemporalSliderScenarioFCAbsolute
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    } else if (state.currentScenario === upperNames.FCnoCRA) {
      return (
        <TemporalSliderScenarioFCnoCRAAbsolute
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    } else if (state.currentScenario === upperNames.FCnoSFA) {
      return (
        <TemporalSliderScenarioFCnoSFAAbsolute
          aria-label="slider"
          value={sliderValue}
          step={null}
          marks={marks}
          valueLabelDisplay="off"
          disabled={buttonDisabled}
          onChange={handleChangeSlider}
        />
      );
    }

    return (
      <TemporalSliderScenarioFCnoCRAnoSFAAbsolute
        aria-label="slider"
        value={sliderValue}
        step={null}
        marks={marks}
        valueLabelDisplay="off"
        disabled={buttonDisabled}
        onChange={handleChangeSlider}
      />
    );
  };

  const handleClickPlay = () => {
    setButtonDisabled(true);

    const indexMark = marks.findIndex((mark) => mark.value === sliderValue);
    if (indexMark > -1) {
      let index = 0;

      const sliderEvent = { timeline: true };
      handleChangeSlider(sliderEvent, 0);

      const timelineInterval = setInterval(() => {
        const position = marks[index];
        handleChangeSlider(sliderEvent, position.value);

        index++;
        if (index > indexMark) {
          clearInterval(timelineInterval);
          setButtonDisabled(false);
        }
      }, 500);
    }
  };

  const handleChangeSlider = (
    event: any,
    newSliderValue: number | number[],
  ) => {
    if ((event && event.timeline) || sliderValue !== newSliderValue) {
      setSliderValue(newSliderValue);

      const debounceSlider = debounce(() => {
        const mark = marks.find((mark) => mark.value === newSliderValue);
        if (mark) {
          dispatch({ type: 'SET_CURRENT_YEAR', year: Number(mark.label) });
        }
      }, 300);

      debounceSlider();
    }
  };

  const handleClickMenuYears = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuYears = (year: number) => {
    setSelectedYear(year);

    const newMarks = defaultMarks.filter((mark) => Number(mark.label) >= year);
    setSliderValue(newMarks[0].value);
    setMarks(newMarks);

    dispatch({ type: 'SET_CHANGE_FROM_YEAR', year: Number(year) });
    setAnchorEl(null);
  };

  const getDifferenceButton = () => {
    if (
      TimelineOption.ABSOLUTE === state.currentTimelineOption ||
      validYears.length === 1
    ) {
      return <div></div>;
    }

    return (
      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClickMenuYears}
        >
          {selectedYear}
          <Icon style={{ marginLeft: 8 }}>keyboard_arrow_down</Icon>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenuYears}
        >
          {validYears.map((year: number) => (
            <MenuItem
              key={year}
              onClick={() => {
                handleCloseMenuYears(year);
              }}
            >
              {year}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Card className={classes.slider}>
        <Typography gutterBottom></Typography>

        <div className={classes.content}>
          {getDifferenceButton()}
          <IconButton
            aria-label="play"
            className={classes.icon}
            disabled={buttonDisabled}
            onClick={handleClickPlay}
          >
            <PlayArrowIcon />
          </IconButton>

          {getScenarioComponent()}
        </div>
      </Card>
    </div>
  );
}

export default React.memo(Temporal);
