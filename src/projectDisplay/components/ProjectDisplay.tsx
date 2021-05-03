import { Button, Card, CardActions, CardContent, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const ProjectDisplay = ({ ...props }) => {
  const classes = useStyles();
  const { name, projectKey } = props;

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          שם הפרויקט
        </Typography>
        <Typography variant='h5' component='h2'>
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default ProjectDisplay;
