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
import { getStyles, createChartsAllBiomes } from './report.utils';
import { View } from 'containers/Types';

type ReportAllBiomesProps = {
  open: boolean;
  view: View;
  onClose: () => void;
};

function ReportAllBiomes({ open, view, onClose }: ReportAllBiomesProps) {
  const classes = getStyles();
  const [scroll] = React.useState<DialogProps['scroll']>('paper');
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const state = useTrackedState();

  const chart: any = createChartsAllBiomes(state, t, view);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

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
      <DialogTitle id="scroll-dialog-title">
        {t('ReportAllBiomes.title')}
      </DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <div>
          <Typography
            id="alert-dialog-title"
            variant="h6"
            gutterBottom
            align="justify"
          >
            {chart.label}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            {chart.description}
          </Typography>
          <Line data={chart.data} options={chart.options} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className={classes.buttonDefault}>
          {t('ReportAllBiomes.buttonClose')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(ReportAllBiomes);
