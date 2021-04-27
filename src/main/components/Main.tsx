import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { addNewProject, getSelectProjectRef, reOrderTasks } from '../fireBaseMethods';
import Header from './Header';
import Dialog from './Dialog';
import Cards from './Cards';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface taskType {
  name: string;
  owner: string;
  id: string;
  [key: string]: any;
}

interface todoType {
  status: taskType;
  [key: string]: any;
}

interface Iproject {
  name: string;
  users: string[];
  todos: todoType;
  [key: string]: any;
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

  const HandleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const startColumn = selectedProject!.todos[source.droppableId];
    const endColumn = selectedProject!.todos[destination.droppableId]
      ? selectedProject!.todos[destination.droppableId]
      : {};
    console.log('startColumn', startColumn);
    console.log('endColumn', endColumn);
    if (endColumn === startColumn) {
      console.log('reorder same column!');
      /* const tasksArray = Object.keys(startColumn);
      tasksArray.splice(source.index, 1);
    tasksArray.splice(destination.index, 0, draggableId);

    const newColumn = Object.fromEntries(
      tasksArray.map((value: string) => {
        return [value, { name: startColumn[value].name, owner: startColumn[value].owner }];
      }),
    );
    reOrderTasks(projectKeyRef, source.droppableId, newColumn); */
      return;
    }

    const newStartTasks = Object.keys(startColumn);
    newStartTasks.splice(source.index, 1);
    console.log('newStartTasks', newStartTasks);

    const newEndTasks = Object.keys(endColumn);
    newEndTasks.splice(source.index, 0, draggableId);
    console.log('newEndTasks', newEndTasks);

    const newStartColumn = Object.fromEntries(
      newStartTasks.map((value: string) => {
        return [value, { name: startColumn[value].name, owner: startColumn[value].owner }];
      }),
    );

    console.log('startColumn', startColumn);

    const newEndColumn = Object.fromEntries(
      newEndTasks.map((value: string) => {
        if (endColumn[value]) {
          return [value, { name: endColumn[value].name, owner: endColumn[value].owner }];
        }
        return [value, { name: startColumn[value].name, owner: startColumn[value].owner }];
      }),
    );
    reOrderTasks(projectKeyRef, source.droppableId, destination.droppableId, newStartColumn, newEndColumn);
    /*
        const tasksArray = Object.keys(column).map((value: string) => {
      return { id: value, name: column[value].name, owner: column[value].owner };
    });
    const newTasksArray = Object.keys(column) */

    /*  tasksArray.splice(destination.index, 0, tasksArray.filter(task => task.id === draggableId)); */
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
                {selectedProject && (
                  <DragDropContext onDragEnd={HandleDragEnd}>
                    {['new', 'doing', 'done'].map((cardName: string, index: number) => {
                      return (
                        <Cards
                          key={cardName}
                          selectedProject={selectedProject}
                          cardName={cardName}
                          projectKey={projectKeyRef}
                        />
                      );
                    })}
                  </DragDropContext>
                )}
              </>
            )}
            <Grid item xs={12}>
              <Button variant='contained' color='primary' onClick={handleClickOpen}>
                פרויקט חדש
              </Button>
              <Dialog
                cbFunc={addNewProject}
                onSelectProject={onSelectProject}
                open={openDialog}
                setOpen={setOpenDialog}
                text={{ label: 'שם פרויקט:' }}
              />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Main;
