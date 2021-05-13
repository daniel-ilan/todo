import { Breadcrumbs, Grid, Link, makeStyles, Theme, Typography } from '@material-ui/core';
import { auth } from 'firebaseConfig';
import Cards from 'main/components/Cards';
import { changeProjectName, reorderTasks, reorderTasksColumns } from 'main/fireBaseMethods';
import * as React from 'react';
import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Link as RouterLink, useParams } from 'react-router-dom';
import EditInline from 'shared/components/editInline';
import useKanban from 'utils/kanban';

const useStyles = makeStyles((theme: Theme) => ({
  projectName: {
    display: 'inline-block',
    transition: '0.3s',
    padding: theme.spacing(0, 2),
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
}));

const Project = ({ ...props }) => {
  const user = auth.currentUser!;
  const [isEditing, setIsediting] = useState(false);
  const { projectKey }: any = useParams();
  const { initialData, setInitialData, boardName } = useKanban(user.uid, projectKey);
  const classes = useStyles();
  console.log(projectKey);

  const submitProjectNameChange = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const newName = event.target.value;
    changeProjectName(projectKey, newName, user.uid);
    setIsediting(false);
  };

  const enableEditName = () => {
    setIsediting(true);
  };
  console.log('Got here!');

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
      reorderTasks(projectKey, startColumn.id, newTaskIds);
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
    reorderTasksColumns(projectKey, newStart.id, newFinish.id, startTaskIDs, finishTaskIDs);
  };
  console.log(initialData);

  return (
    <>
      {initialData ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label='breadcrumb'>
              <Link color='inherit' component={RouterLink} to='/todos'>
                פרויקטים
              </Link>
              <Typography color='textPrimary'> {boardName}</Typography>
            </Breadcrumbs>
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
                  projectKey={projectKey}
                />
              );
            })}
          </DragDropContext>
        </Grid>
      ) : (
        <div>משו!</div>
      )}
    </>
  );
};

export default Project;
