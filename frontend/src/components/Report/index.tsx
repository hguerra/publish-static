import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Line } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import { useTrackedState } from 'store';
import { getStyles, createCharts } from './report.utils';

type ReportProps = {
  open: boolean;
  properties?: GeoJSON.GeoJsonProperties;
  onClose: () => void;
};

function Report({ open, properties, onClose }: ReportProps) {
  const classes = getStyles();
  const [scroll] = React.useState<DialogProps['scroll']>('paper');
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const state = useTrackedState();

  const charts: any = createCharts(state, t, properties);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const dialogTitle = t(`Legend.cardValues.${properties?.nm}`, {
    defaultValue: properties?.nm,
  });

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        {charts.map(
          (entry: {
            name: string;
            label: string;
            description: string;
            data: any;
            options: any;
          }) => {
            return (
              <div key={entry.name}>
                <Typography
                  id="alert-dialog-title"
                  variant="h6"
                  gutterBottom
                  align="justify"
                >
                  {entry.label}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  {entry.description}
                </Typography>
                <Line data={entry.data} options={entry.options} />
              </div>
            );
          },
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className={classes.buttonDefault}>
          {t('ReportAllBiomes.buttonClose')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(Report);
