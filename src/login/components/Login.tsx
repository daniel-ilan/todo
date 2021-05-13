import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Signin from './Signin';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Signup from './Signup';
import TabPanel from './TabPanel';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    alignSelf: 'stretch',
    minHeight: '90%',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  tab: {
    flexGrow: 1,
    maxWidth: '100%',
  },
  h100: {
    height: '100%',
  },
  h90: {
    height: '90%',
  },
}));

const Login = (props: any) => {
  const classes = useStyles();
  const [chosenTab, setChosenTab] = useState(0);

  const handleChange = (event: any, value: number) => {
    setChosenTab(value);
  };

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
        <Tabs
          aria-label='simple tabs example'
          textColor='primary'
          indicatorColor='primary'
          onChange={handleChange}
          value={chosenTab}>
          <Tab label='התחברות' id='0' aria-controls='0' className={classes.tab} />
          <Tab label='הרשמה' id='1' aria-controls='1' className={classes.tab} />
        </Tabs>

        <TabPanel index={1} value={chosenTab} className={classes.h90} classes={classes}>
          <Signup handleChange={handleChange} className={classes.h100} />
        </TabPanel>

        <TabPanel index={0} value={chosenTab} className={classes.h90} classes={classes}>
          <Signin handleChange={handleChange} className={classes.h100} />
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default Login;
