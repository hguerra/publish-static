import React from 'react';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useTrackedState } from 'store';
import { useTranslation } from 'react-i18next';

import { getMapTitleEn, getMapTitlePt } from 'store/utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      width: '100%',
      display: 'flex',
      zIndex: 1198,
      position: 'fixed',
      justifyContent: 'center',
      top: '68px',
    },
    root: {
      maxWidth: 800,
      width: 'auto',
      lineHeight: 1.2,
      backgroundColor: '#757575',
      color: '#fff',
      fontWeight: 400,
      [theme.breakpoints.down('sm')]: {
        top: '53px',
        left: '8px',
      },
    },
    title: {
      padding: '0 8px',
      margin: 8,
    },
  }),
);

function MapTitle() {
  const classes = useStyles();
  const state = useTrackedState();
  const { t } = useTranslation();

  const getCard = () => {
    let title = getMapTitleEn(state, t);
    if (t('Language') === 'pt') {
      title = getMapTitlePt(state, t);
    }

    if (title !== null) {
      return (
        <div className={classes.main}>
          <Card className={classes.root}>
            <p className={classes.title}>{title}</p>
          </Card>
        </div>
      );
    }

    return <div></div>;
  };

  return getCard();
}

export default React.memo(MapTitle);
