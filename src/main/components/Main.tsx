import React from 'react';
import { Container, Grid, makeStyles, Theme, Button } from '@material-ui/core';
import Header from './Header';
import { addNewProject } from 'main/fireBaseMethods';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },

  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
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

const Main = () => {
  const classes = useStyles();

  const handleNewProject = () => {
    addNewProject('new test project');
  };

  return (
    <div className={classes.wrapper}>
      <Header />
      <main className={classes.main}>
        <div className={classes.toolbar}></div>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <div>פרויקט!</div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant='contained' color='primary' onClick={() => handleNewProject()}>
                הוסף פפרויקט
              </Button>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Main;
