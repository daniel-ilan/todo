import React, { useState } from 'react';
import { Button, Container, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { addNewProject, changeProjectName, reorderTasks, reorderTasksColumns } from '../fireBaseMethods';
import Header from './Header';
import Dialog from './Dialog';
import Cards from './Cards';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import useKanban from '../../utils/kanban';
import { auth } from 'firebaseConfig';
import EditInline from 'shared/components';

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
}));

const Main = () => {
  const classes = useStyles();
  const userId = auth.currentUser!.uid;
  const [projectKeyRef, setProjectKeyRef] = useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const { initialData, setInitialData, boardName } = useKanban(userId, projectKeyRef);
  const [isEditing, setIsediting] = useState(false);

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
    changeProjectName(projectKeyRef, newName, userId);
    setIsediting(false);
  };

  const enableEditName = () => {
    setIsediting(true);
  };

  return (
    <div className={classes.wrapper}>
      <Header onSelectProject={onSelectProject} />
      <main className={classes.main}>
        <div className={classes.toolbar}></div>
        <Container>
          <Grid container spacing={4}>
            {initialData && (
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
                        userId={userId}
                        index={index}
                        cardName={column.title}
                        projectKey={projectKeyRef}
                      />
                    );
                  })}
                </DragDropContext>
              </>
            )}
            <Grid item xs={12}>
              <Button variant='contained' color='primary' onClick={handleClickOpen}>
                פרויקט חדש
              </Button>
              <Dialog
                cbFunc={onAddNewProject}
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
