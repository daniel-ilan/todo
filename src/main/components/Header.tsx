import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'shared/providers/firebaseAuthProvider';
import { makeStyles, Typography, Toolbar, IconButton, AppBar, Button, Box } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import DrawerPane from './DrawerPane';
import { getUserNameRef } from '../fireBaseMethods';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginInlineStart: 240,
    width: `calc(100% - ${240}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  menuButton: {
    color: 'white',
    alignSelf: 'inline-start',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: 240,
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
      width: theme.spacing(9) + 1,
    },
  },

  buttonsWrapper: {
    display: 'flex',
    width: '30%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logOutBtn: {
    marginInlineStart: 'auto',
    marginInlineEnd: '5%',
  },
}));

const Header = ({ ...props }) => {
  const { onSelectProject } = props;
  const signout = useAuth()!.signout;
  const [userName, setUserName] = useState('');
  const [isDrawerOpen, SetIsDrawerOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const handleDrawerOpen = () => {
    SetIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    SetIsDrawerOpen(false);
  };

  const handleLogOut = () => {
    history.push('/');
    signout();
  };

  const currentUser = useAuth()?.currentUser;
  useEffect(() => {
    if (!userName) setUserName(currentUser.displayName);
    const userNameRef = getUserNameRef(currentUser.uid);
    userNameRef.on('value', (snapshot) => {
      const newUserName = snapshot.val();
      setUserName(newUserName);
    });
  }, [currentUser.displayName, currentUser.uid, userName]);

  return (
    <>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isDrawerOpen,
        })}>
        <Toolbar>
          <Box component='div' className={classes.buttonsWrapper}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, {
                [classes.hide]: isDrawerOpen,
              })}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              {userName}
            </Typography>
          </Box>
          <Button variant='contained' className={classes.logOutBtn} color='primary' onClick={() => handleLogOut()}>
            התנתק
          </Button>
        </Toolbar>
      </AppBar>
      <DrawerPane isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} onSelectProject={onSelectProject} />
    </>
  );
};

export default Header;
