import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { addNewProject, getSelectProjectRef } from '../fireBaseMethods';
import Header from './Header';
import Dialog from './Dialog';
import Cards from './Cards';
import { DragDropContext } from 'react-beautiful-dnd';

type todoType = {
  status: string;
};

interface Iproject {
  name?: string;
  users?: string[];
  todos?: todoType[];
}

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
  const [selectedProject, setSelectedProject] = useState<Iproject | null>(null);
  const [projectKeyRef, setProjectKeyRef] = useState('');
  const onSelectProject = (projectKey: string) => {
    setProjectKeyRef(projectKey);
    const projectRef = getSelectProjectRef(projectKey);
    projectRef.on('value', (snapshot: any) => {
      setSelectedProject(snapshot.val());
    });
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const HandleDragEnd = () => {
    console.log('drag ended!');
  };

  useEffect(() => {
    if (!selectedProject) setSelectedProject(null);
    setSelectedProject(selectedProject);
    console.log('selectedProject', selectedProject);
  }, [selectedProject]);

  return (
    <div className={classes.wrapper}>
      <Header onSelectProject={onSelectProject} />
      <main className={classes.main}>
        <div className={classes.toolbar}></div>
        <Container>
          <Grid container spacing={4}>
            {selectedProject && (
              <>
                <Grid item xs={12}>
                  <Typography variant='h3'>{selectedProject.name}</Typography>
                </Grid>
                {selectedProject &&
                  ['new', 'doing', 'done'].map((cardName: string, index: number) => {
                    return (
                      <DragDropContext onDragEnd={HandleDragEnd}>
                        <Cards
                          key={index}
                          selectedProject={selectedProject}
                          cardName={cardName}
                          projectKey={projectKeyRef}
                        />
                      </DragDropContext>
                    );
                  })}
              </>
            )}
            <Grid item xs={12}>
              <Button variant='contained' color='primary' onClick={handleClickOpen}>
                פרויקט חדש
              </Button>
              <Dialog cbFunc={addNewProject} open={openDialog} setOpen={setOpenDialog} text={{ label: 'שם פרויקט:' }} />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Main;
