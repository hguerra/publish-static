import React from 'react';

import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';

import Main from 'layouts/Main';
import { Icon } from '@material-ui/core';
import Resume from 'components/Resume';
import SideContent from 'components/SideContent';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MapTitle from 'components/MapTitle';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 24,
      '& > span': {
        marginLeft: '-8px',
      },
      display: 'none',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7) + 4,
      },
      display: 'none',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(0),
    },
    contentInfo: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    contentInfoText: {
      display: 'flex',
      alignItems: 'center',
    },
    subtitle: {
      marginLeft: '24px',
      display: 'block',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    download: {
      marginTop: '-5px',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
    },
    icon: {
      marginRight: 8,
      position: 'relative',
      top: '7px',
    },
    adjustMobile: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  }),
);

function Sidebar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [resumeOpen, setResumeOpen] = React.useState(
    process.env.NODE_ENV === 'production',
  );

  const { t } = useTranslation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleResumeOpen = () => {
    setResumeOpen(true);
  };

  const handleResumeClose = () => {
    setResumeOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleTranslateOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTranslateCloseNone = () => {
    setAnchorEl(null);
  };

  const handleTranslateCloseEnglish = () => {
    setAnchorEl(null);
    if (window.location.href.includes('pt')) {
      window.location.href = `http://${window.location.host}`;
    }
  };

  const handleTranslateClosePortuguese = () => {
    setAnchorEl(null);
    if (!window.location.href.includes('pt')) {
      window.location.href = `http://${window.location.host}?lng=pt`;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>

          <div className={classes.contentInfo}>
            <div className={classes.contentInfoText}>
              <Typography variant="h6">{t('Title')}</Typography>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {t('Subtitle')}
              </Typography>
            </div>
            <div className={classes.adjustMobile}>
              <Button
                style={{ color: '#fff' }}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleTranslateOpen}
              >
                <Icon style={{ marginRight: 4 }}>translate</Icon>
                {t('AppBar.buttonTranslate.0')}
                <Icon>keyboard_arrow_down</Icon>
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleTranslateCloseNone}
              >
                <MenuItem onClick={handleTranslateCloseEnglish}>
                  {t('AppBar.buttonTranslate.1')}
                </MenuItem>
                <MenuItem onClick={handleTranslateClosePortuguese}>
                  {t('AppBar.buttonTranslate.2')}
                </MenuItem>
              </Menu>
              {/* <Tooltip title="Download data" arrow>
                <Button className={classes.download}>
                  <a
                    href="https://static.publishdata.com.br/brazilsforestcode/download/restoreplus.zip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.link}
                  >
                    {t('AppBar.buttonDownload')}{' '}
                    <Icon className={classes.icon}>download</Icon>
                  </a>
                </Button>
              </Tooltip> */}
              <Button onClick={handleResumeOpen} color="inherit">
                {t('AppBar.buttonAbout')}{' '}
                <Icon style={{ marginLeft: 8 }}>info_outlined</Icon>
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
      </Drawer>

      <SideContent></SideContent>
      <MapTitle></MapTitle>

      <Resume open={resumeOpen} onClose={handleResumeClose}></Resume>
      <main className={classes.content}>
        <Main />
      </main>
    </div>
  );
}

export default React.memo(Sidebar);
