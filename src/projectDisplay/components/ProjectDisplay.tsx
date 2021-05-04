import { Button, Card, CardActions, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { isEqual } from 'lodash';
import { deleteProject, getSelectProjectRef } from 'main/fireBaseMethods';
import React, { useEffect, useState } from 'react';
import AlertDialog from 'shared/components/alertDialog/AlertDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    '&:hover': {
      boxShadow: theme.shadows[10],
    },
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  deleteProject: {
    transition: 'color 0.2s',
    '&:hover': {
      color: theme.palette.warning.dark,
    },
  },
}));

const ProjectDisplay = ({ ...props }) => {
  const classes = useStyles();
  const { name, projectKey, onSelectProject, user } = props;
  const [open, setOpen] = useState(false);
  const alertText = 'למחוק את הפרויקט סופית? לא יהיה ניתן לשחזר אותו לאחר מכן';
  const projectRef = getSelectProjectRef(projectKey);
  const [projectData, setProjectData] = useState(null);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    projectRef.on('value', (snapshot) => {
      if (!isEqual(snapshot.val(), projectData)) {
        setProjectData(snapshot.val());
        setTaskCount(Object.keys(snapshot.val().tasks).length);
      }
    });
  }, [projectData, projectRef]);
  console.log(projectData);

  const handleDeleteProject = () => {
    deleteProject(projectKey, user.uid);
  };

  return (
    <Card className={classes.root} variant='outlined'>
      {projectData && (
        <>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography className={classes.title} color='textSecondary' gutterBottom>
                  שם הפרויקט
                </Typography>
                <Typography variant='h5' component='h2'>
                  {name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.title} color='textSecondary' gutterBottom>
                  מספר משימות
                </Typography>
                <Typography variant='body1' component='p'>
                  {taskCount} משימות בפרויקט
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button size='small' color='primary' variant='outlined' onClick={() => onSelectProject(projectKey)}>
              כניסה לפרויקט
            </Button>
            <Button size='small' className={classes.deleteProject} onClick={() => setOpen(true)}>
              מחיקת פרויקט
            </Button>
          </CardActions>
          <AlertDialog open={open} setOpen={setOpen} text={alertText} cbFunc={handleDeleteProject} />
        </>
      )}
    </Card>
  );
};

export default ProjectDisplay;
