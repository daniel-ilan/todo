import React, { useEffect, useState } from 'react';
import Main from 'main';
import Header from 'header';
import { Switch, useRouteMatch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Container, makeStyles, Theme } from '@material-ui/core';
import Project from 'project';
import isEqual from 'lodash/isEqual';
import { getUserRef } from 'main/fireBaseMethods';

type userDataType = {
  [index: string]: projectType;
};

type projectType = {
  [index: string]: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  wrapper: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
  },
}));

const Todos = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState<userDataType>({});
  const userRef = getUserRef();
  let { path } = useRouteMatch();

  useEffect(() => {
    if (!userData) setUserData({});
    userRef.on('value', (snapshot: any) => {
      if (!isEqual(userData, snapshot.val()) && snapshot.val()) {
        setUserData(snapshot.val());
      }
    });
  }, [userRef, userData]);

  return (
    <React.Fragment>
      <Header projects={userData.projects} />
      <main className={classes.main}>
        <div className={classes.toolbar}></div>
        <div className={classes.wrapper}>
          <Container>
            <Switch>
              <PrivateRoute exact path={path} component={Main} userData={userData} />
              <PrivateRoute path={`${path}/:projectKey`} component={Project} />
            </Switch>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Todos;
