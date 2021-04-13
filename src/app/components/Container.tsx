import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    height: '100%',
    flex: '1 1 100%',
  },
}));

type Props = { children?: React.ReactNode };

const Container = ({ children }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Container;
