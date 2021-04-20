import React, { useEffect, useState } from 'react';
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import { getProjectsRef } from '../fireBaseMethods';

type projectType = {
  projectKey?(index: string): string;
};

type projectListType = {
  [index: string]: projectType;
};

const useStyles = makeStyles((theme) => ({
  menuButton: {
    color: 'white',
    alignSelf: 'inline-start',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    direction: 'rtl',
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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

const DrawerPane = ({ ...props }) => {
  const { isDrawerOpen, handleDrawerClose, onSelectProject } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [projects, setProjects] = useState<projectListType>({});
  const projectsRef = getProjectsRef();

  const handleLoadProject = (key: string) => {
    onSelectProject(key);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (!projects) setProjects({});
    projectsRef.on('value', (snapshot: any) => {
      if (!isEqual(projects, snapshot.val().projects) && snapshot.val().projects) setProjects(snapshot.val().projects);
    });
  }, [projectsRef, projects]);

  const classes = useStyles();

  return (
    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: isDrawerOpen,
        [classes.drawerClose]: !isDrawerOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: isDrawerOpen,
          [classes.drawerClose]: !isDrawerOpen,
        }),
      }}>
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>{<ChevronRightIcon />}</IconButton>
      </div>
      <Divider />
      <List>
        {['פרויקטים'].map((text, index) => (
          <ListItem button key={text} onClick={handleOpenMenu}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} primaryTypographyProps={{ align: 'right' }} />
          </ListItem>
        ))}
      </List>
      <Menu
        id='long-menu'
        anchorEl={anchorEl}
        keepMounted
        open={isMenuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '30ch',
          },
        }}>
        {Object.values(projects).length > 0 &&
          Object.keys(projects).map((key: string, index: number) => (
            <MenuItem key={index} onClick={() => handleLoadProject(key)}>
              {projects[key]}
            </MenuItem>
          ))}
      </Menu>
    </Drawer>
  );
};

export default DrawerPane;
