import React from 'react';
import { Button, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { addNewProject } from '../fireBaseMethods';
import FormDialog from 'shared/components/dialog';
import { auth } from 'firebaseConfig';
import ProjectDisplay from 'projectDisplay';

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

  userName: {
    color: theme.palette.grey['A700'],
  },
}));

const Main = ({ ...props }) => {
  const { userData } = props;
  const classes = useStyles();
  const user = auth.currentUser!;
  const [openDialog, setOpenDialog] = React.useState(false);

  const onAddNewProject = (projectName: string) => {
    return addNewProject(projectName);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  return (
    <>
      {userData && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1' gutterBottom className={classes.userName}>
                שלום, {userData.displayName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h4' component='h2' gutterBottom className={classes.userName}>
                פרויקטים:
              </Typography>
              <Button variant='contained' color='primary' onClick={handleClickOpen}>
                פרויקט חדש
              </Button>
              <FormDialog
                cbFunc={onAddNewProject}
                open={openDialog}
                setOpen={setOpenDialog}
                text={{ label: 'שם פרויקט:' }}
              />
            </Grid>
            {userData.projects &&
              Object.keys(userData.projects).map((projectKey: string, index: number) => {
                return (
                  <Grid item xs={6} key={projectKey}>
                    <ProjectDisplay
                      projectKey={projectKey}
                      name={userData.projects[projectKey]}
                      key={index}
                      user={user}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
    </>
  );
};

export default Main;
