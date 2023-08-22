import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import Logo from '../../assets/img/restore-logo.png';
import BMULogo from '../../assets/img/bmu-logo.png';
import resumeEn from '../../assets/img/resume-en.png';
import resumePt from '../../assets/img/resume-pt.png';

type ResumeProps = {
  open: boolean;
  onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonDefault: {
      backgroundColor: '#24806F',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#24806F',
      },
    },
    imgContent: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      margin: '12px 16px 8px 16px',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        marginBottom: 16,
      },
    },
    imgLogo: {
      height: 30,
      marginLeft: 24,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
        marginTop: 8,
      },
    },
    imgResumeTable: {
      width: '90%',
      height: '100%',
      marginBottom: 0,
      margin: 'auto',
      [theme.breakpoints.down('xs')]: {
        marginBottom: 16,
      },
    },
    imgBMULogo: {
      height: 120,
      marginTop: 16,
      marginBottom: 0,
      [theme.breakpoints.down('xs')]: {
        marginBottom: 16,
      },
    },
    contentDialogTitile: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        fontSize: '16px',
        flexWrap: 'wrap',
        textAlign: 'center',
      },
    },
    dialogInfo: {
      [theme.breakpoints.up('xl')]: {
        fontSize: '14px',
      },
    },
  }),
);

function Resume({ open, onClose }: ResumeProps) {
  const classes = useStyles();
  const [scroll] = React.useState<DialogProps['scroll']>('paper');

  const { t } = useTranslation();

  const getImageOfResumeTable = () => {
    if (t('Language') === 'pt') {
      return resumePt;
    }
    return resumeEn;
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        onClose={onClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <div className={classes.contentDialogTitile}>
            {t('Subtitle')}
            <img src={Logo} className={classes.imgLogo} alt="Restore" />
          </div>
        </DialogTitle>

        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            align={'justify'}
            style={{ marginBottom: '0' }}
            className={classes.dialogInfo}
          >
            {t('Resume.part01')}

            <strong>
              <a
                href="https://iopscience.iop.org/article/10.1088/1748-9326/aaccbb"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('Resume.part02')}
              </a>
            </strong>

            {t('Resume.part03')}
          </DialogContentText>

          <div className={classes.imgContent}>
            <img
              src={getImageOfResumeTable()}
              className={classes.imgResumeTable}
              alt="Restore+"
            />
          </div>

          <div className={classes.imgContent}>
            <img src={BMULogo} className={classes.imgBMULogo} alt="Restore+" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} className={classes.buttonDefault}>
            {t('ReportAllBiomes.buttonClose')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default React.memo(Resume);
