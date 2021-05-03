import React, { useEffect, useState } from 'react';
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import PersonIcon from '@material-ui/icons/Person';
import { Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import { getProjectsRef, changeUserName } from '../fireBaseMethods';
import FormDialog from './Dialog';

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
    ...theme.mixins.toolbar,
  },
  lowerDevider: {
    marginTop: 'auto',
  },
}));

const DrawerPane = ({ ...props }) => {
  const { isDrawerOpen, handleDrawerClose, onSelectProject } = props;
  const [anchorProjectsEl, setAnchorProjectsEl] = React.useState<null | HTMLElement>(null);
  const isProjectsMenuOpen = Boolean(anchorProjectsEl);
  const [anchorUserEl, setAnchorUserEl] = React.useState<null | HTMLElement>(null);
  const isUserMenuOpen = Boolean(anchorUserEl);
  const [projects, setProjects] = useState<projectListType>({});
  const projectsRef = getProjectsRef();
  const classes = useStyles();

  const [isNameDialogOpen, setNameDialogOpen] = useState(false);

  const handleLoadProject = (key: string) => {
    onSelectProject(key);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorProjectsEl(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorUserEl(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorProjectsEl(event.currentTarget);
  };

  const openUserOptions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserEl(event.currentTarget);
  };

  const handleNameChange = (newName: string) => {
    changeUserName(newName);
  };

  useEffect(() => {
    if (!projects) setProjects({});
    projectsRef.on('value', (snapshot: any) => {
      if (!isEqual(projects, snapshot.val().projects) && snapshot.val().projects) setProjects(snapshot.val().projects);
    });
  }, [projectsRef, projects]);

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
        <Menu
          id='long-menu'
          anchorEl={anchorProjectsEl}
          keepMounted
          open={isProjectsMenuOpen}
          onClose={handleCloseMenu}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
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
      </List>

      <Divider className={classes.lowerDevider} />
      <List>
        <ListItem button onClick={openUserOptions}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary='פרטי משתמש' primaryTypographyProps={{ align: 'right' }} />
        </ListItem>
        <Menu
          id='user-menu'
          anchorEl={anchorUserEl}
          keepMounted
          open={isUserMenuOpen}
          onClose={handleCloseUserMenu}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '30ch',
            },
          }}>
          <MenuItem
            onClick={() => {
              setNameDialogOpen(true);
            }}>
            שינוי שם
          </MenuItem>
        </Menu>
      </List>
      <FormDialog
        cbFunc={handleNameChange}
        open={isNameDialogOpen}
        setOpen={setNameDialogOpen}
        text={{ label: 'שם חדש:' }}
      />
    </Drawer>
  );
};

export default DrawerPane;
