import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  LegendValue,
  MapPropsViewStyleValueType,
  ViewStyleKeyValue,
  ViewType,
} from 'containers/Types';
import { formatNumberDefault } from 'core/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTrackedState } from 'store';
import './style.scss';
import { getLabelSelected } from '../../store/utils';

type LegendProps = {
  title?: string;
  type: ViewType;
  style: ViewStyleKeyValue;
  hoverProperties?: string[];
  onHover?: (name: string | null) => void;
  onClick?: (name: string) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 272,
      position: 'absolute',
      right: '8px',
      top: '70px',
      zIndex: 1100,
      [theme.breakpoints.down('xs')]: {
        maxWidth: 180,
        paddingBottom: 0,
      },
    },
    legendBgBottom: {
      width: 272,
      position: 'absolute',
      right: '8px',
      top: '330px',
      zIndex: 1100,
      [theme.breakpoints.down('xs')]: {
        maxWidth: 180,
      },
    },
    legendBgTop: {
      width: 272,
      zIndex: 1100,
      position: 'absolute',
      right: '8px',
      top: '70px',
    },
    legendBgMiddleBrazil: {
      width: 272,
      zIndex: 1100,
      position: 'absolute',
      right: '8px',
      top: '153px',
    },
    legendBgMiddleRegions: {
      width: 272,
      zIndex: 1100,
      position: 'absolute',
      right: '8px',
      top: '302px',
    },
    cardContentCustom: {
      padding: 8,
      '&:last-child': {
        paddingBottom: '8px !important',
      },
    },
    cardLongContentCustom: {
      padding: 8,
      overflow: 'auto',
      height: '154px',
      marginTop: '6px',
      '&:last-child': {
        paddingBottom: '8px !important',
      },
    },
    cardHeader: {
      padding: '8px 16px',
      background: '#212121',
      color: 'white',
      textTransform: 'uppercase',
      '& span': {
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '.03em',
        [theme.breakpoints.down('xs')]: {
          fontSize: '12px',
        },
      },
    },
    title: {
      fontSize: 14,
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0 0',
      marginBottom: 0,
    },
  }),
);

function legendValuesFactory(
  props: ViewStyleKeyValue,
  t: any,
): LegendValue[] {
  const values: LegendValue[] = [];

  props.value.forEach((v) => {
    let label = 'N/A';
    let name = 'N/A';
    const prefix = v.displayValuePrefix || '';
    let suffix = v.displayValueSuffix || '';

    if (MapPropsViewStyleValueType.ANY === props.type) {
      label = t(`Legend.cardValues.${v.valueString!}`, {
        defaultValue: v.valueString!,
      });
      name = v.valueString!;
    } else if (MapPropsViewStyleValueType.STRING === props.type) {
      label = t(`Legend.cardValues.${v.valueString!}`, {
        defaultValue: v.valueString!,
      });
      name = v.valueString!;
    } else if (MapPropsViewStyleValueType.NUMBER === props.type) {
      label = `${prefix}${formatNumberDefault(v.valueNumber!)}${suffix}`;
      name = label;
    } else if (MapPropsViewStyleValueType.RANGE === props.type) {
      if (v.valueRange!.start) {
        label = `${prefix}${formatNumberDefault(
          v.valueRange!.start,
        )} - ${formatNumberDefault(v.valueRange!.end)}${suffix}`;
      } else {
        label = `>= ${formatNumberDefault(v.valueRange!.end)}${suffix}`;
      }

      name = label;
    }

    values.push({
      icon: 'fiber_manual_record',
      fillColor: v.style.fillColor,
      label,
      name,
    });
  });

  return values;
}

const Legend = React.forwardRef(
  (
    { title, type, style, hoverProperties, onHover, onClick }: LegendProps,
    ref,
  ) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const state = useTrackedState();

    const [legendHoverProperties, setLegendHoverProperties] = React.useState<
      string[] | undefined
    >(hoverProperties);

    const selectedRef = React.useRef<any>(null);

    const values = legendValuesFactory(style, t);
    const hasValues = !values || !values.length;

    const handleClick = (value: LegendValue) => {
      if (!onClick) {
        return;
      }

      onClick(value.name);
    };

    const getCardClassName = () => {
      if (ViewType.BORDER === type) {
        return classes.root;
      }

      if (state.currentBorder === 'None') {
        return classes.legendBgTop;
      }

      if (state.currentBorder === 'Brazil') {
        return classes.legendBgMiddleBrazil;
      }

      if (state.currentBorder === 'Regions') {
        return classes.legendBgMiddleRegions;
      }

      return classes.legendBgBottom;
    };

    const getContentClassName = () => {
      if (ViewType.BORDER === type) {
        if (state.currentBorder === 'States') {
          return classes.cardLongContentCustom;
        }
      }

      return classes.cardContentCustom;
    };

    const getTitle = () => {
      if (
        [ViewType.ATTRIBUTE, ViewType.BORDER].includes(
          type,
        )
      ) {
        return getLabelSelected(state, t, type);
      }

      if (!title) {
        const cardTitleType = t(`Legend.cardTitleType.${type}`);
        return `${t('Legend.cardTitlePrefix')} ${cardTitleType}`;
      }
    };

    const hoverItem = (name: string) => {
      if (legendHoverProperties && legendHoverProperties.includes(name)) {
        return true;
      }

      return false;
    };

    const getLegendContentClassName = (name: string) => {
      if (hoverItem(name)) {
        return 'Legend-content_hover ';
      }

      return 'Legend-content';
    };

    const getLegendContentRef = (name: string) => {
      if (hoverItem(name)) {
        return selectedRef;
      }

      return null;
    };

    const handleMouseHover = (value: LegendValue | null) => {
      if (!onHover) {
        return;
      }

      if (!value) {
        onHover(null);
        return;
      }

      onHover(value.name);
    };

    React.useImperativeHandle(ref, () => ({
      setHover(name: string | null) {
        let props = undefined;
        if (name) {
          props = [name];
        }

        setLegendHoverProperties(props);

        if (selectedRef && selectedRef.current) {
          selectedRef.current.scrollIntoView();
        }
      },
    }));

    return (
      <div>
        <Card className={getCardClassName()}>
          <CardHeader className={classes.cardHeader} title={getTitle()} />
          <CardContent className={getContentClassName()}>
            {hasValues ? (
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                No layers selected
              </Typography>
            ) : (
              <div className="Legend">
                {values.map((value: LegendValue) => (
                  <div
                    className={getLegendContentClassName(value.name)}
                    key={value.label}
                    ref={getLegendContentRef(value.name)}
                    onClick={() => {
                      handleClick(value);
                    }}
                    onMouseEnter={() => {
                      handleMouseHover(value);
                    }}
                    onMouseLeave={() => {
                      handleMouseHover(null);
                    }}
                  >
                    <Icon style={{ color: value.fillColor }}>{value.icon}</Icon>
                    <p className="Legend-text">{value.label}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  },
);

export default React.memo(Legend);
