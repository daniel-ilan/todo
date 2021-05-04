import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { addNewProject, changeProjectName, getUserRef, reorderTasks, reorderTasksColumns } from '../fireBaseMethods';
import Header from 'header';
import FormDialog from 'shared/components/dialog';
import Cards from './Cards';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import useKanban from '../../utils/kanban';
import { auth } from 'firebaseConfig';
import EditInline from 'shared/components/editInline';
import isEqual from 'lodash/isEqual';
import ProjectDisplay from 'projectDisplay';

type projectType = {
  [index: string]: string;
};

type userDataType = {
  [index: string]: projectType;
};

type projectDataType = {
  [index: string]: any;
};

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
    ...theme.mixins.toolbar,
  },
  projectName: {
    display: 'inline-block',
    transition: '0.3s',
    padding: theme.spacing(0, 2),
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
  userName: {
    color: theme.palette.grey['A700'],
  },
}));

const Main = () => {
  const classes = useStyles();
  const user = auth.currentUser!;
  const [projectKeyRef, setProjectKeyRef] = useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const { initialData, setInitialData, boardName } = useKanban(user.uid, projectKeyRef);
  const [isEditing, setIsediting] = useState(false);
  const [userData, setUserData] = useState<userDataType>({});
  const userRef = getUserRef();

  const onSelectProject = (projectKey: string) => {
    setProjectKeyRef(projectKey);
  };

  const onAddNewProject = async (projectName: string) => {
    const projectKey = await addNewProject(projectName);
    if (projectKey) onSelectProject(projectKey);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const HandleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    console.log('handleDragEnd');

    if (!destination) return;

    const startColumn = initialData.columns[source.droppableId];
    const endColumn = initialData.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(endColumn.taskIds);

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...endColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...initialData,
        columns: { ...initialData.columns, [endColumn.id]: newColumn },
      };

      setInitialData(newState);
      reorderTasks(projectKeyRef, startColumn.id, newTaskIds);
      return;
    }
    const startTaskIDs = Array.from(startColumn.taskIds);
    startTaskIDs.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIDs,
    };

    let finishTaskIDs: string[] = [];
    if (endColumn.taskIds) finishTaskIDs = Array.from(endColumn.taskIds);

    finishTaskIDs.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...endColumn,
      taskIds: finishTaskIDs,
    };

    const newState = {
      ...initialData,
      columns: {
        ...initialData.columns,
        [startColumn.id]: newStart,
        [endColumn.id]: newFinish,
      },
    };

    setInitialData(newState);
    reorderTasksColumns(projectKeyRef, newStart.id, newFinish.id, startTaskIDs, finishTaskIDs);
  };

  const submitProjectNameChange = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const newName = event.target.value;
    changeProjectName(projectKeyRef, newName, user.uid);
    setIsediting(false);
  };

  const enableEditName = () => {
    setIsediting(true);
  };

  useEffect(() => {
    if (!userData) setUserData({});
    userRef.on('value', (snapshot: any) => {
      if (!isEqual(userData, snapshot.val()) && snapshot.val()) {
        setUserData(snapshot.val());
      }
    });
  }, [userRef, userData]);

  return (
    <div className={classes.wrapper}>
      <Header onSelectProject={onSelectProject} projects={userData.projects} />
      <main className={classes.main}>
        <div className={classes.toolbar}></div>

        {userData && (
          <Container>
            <Grid container spacing={4}>
              {initialData ? (
                <>
                  <Grid item xs={12}>
                    {!isEditing ? (
                      <Typography onClick={() => enableEditName()} variant='h3' className={classes.projectName}>
                        {boardName}
                      </Typography>
                    ) : (
                      <EditInline value={boardName} cbFunc={submitProjectNameChange} />
                    )}
                  </Grid>
                  <DragDropContext onDragEnd={HandleDragEnd}>
                    {initialData.columnOrder.map((colId: string, index: number) => {
                      const column = initialData?.columns[colId];
                      const tasks = column.taskIds?.map((t: any) => t);
                      return (
                        <Cards
                          column={column}
                          tasks={tasks}
                          allData={initialData}
                          key={column.id}
                          index={index}
                          projectKey={projectKeyRef}
                        />
                      );
                    })}
                  </DragDropContext>
                </>
              ) : (
                <>
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
                            onSelectProject={onSelectProject}
                            projectKey={projectKey}
                            name={userData.projects[projectKey]}
                            key={index}
                            user={user}
                          />
                        </Grid>
                      );
                    })}
                </>
              )}
            </Grid>
          </Container>
        )}
      </main>
    </div>
  );
};

export default Main;
