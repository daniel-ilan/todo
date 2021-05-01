import Task from './Task';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { CardHeader, Card, CardContent, Grid, List, Button } from '@material-ui/core';
import { AddCircleOutlineRounded } from '@material-ui/icons';
import { addTask, initTasksOrder } from 'main/fireBaseMethods';
import Dialog from './Dialog';
import { Droppable } from 'react-beautiful-dnd';
import useKanban from 'utils/kanban';
import { auth } from 'firebaseConfig';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    fontWeight: 400,
  },
  cardContent: {
    flexGrow: 1,
    height: '50vh',
  },
  list: {
    width: '100%',
    maxWidth: 360,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(1, 'auto'),
    maxWidth: '50%',
  },
  buttonIcon: {
    marginInlineEnd: theme.spacing(1),
    marginRight: theme.spacing(-1),
  },
}));

interface IaddTask {
  projectKey: string;
  column: string;
  name: string;
}

interface Itask {
  id: string;
  name: string;
  owner: string;
  [key: string]: any;
}

export default function Cards({ ...props }) {
  const classes = useStyles();

  const { cardName, projectKey, column, tasks, allData } = props;

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const onAddNewTask = (name: string) => {
    const newTask: IaddTask = {
      projectKey,
      column: column.id,
      name,
    };
    addTask(newTask);
  };

  return (
    <Grid item xs={12} md={4}>
      <Card className={classes.card}>
        <CardHeader title={cardName} />
        <CardContent className={classes.cardContent}>
          <Droppable droppableId={column.id}>
            {(provided) => (
              <List className={classes.list} dir='rtl' {...provided.droppableProps} innerRef={provided.innerRef}>
                {tasks &&
                  tasks.map((taskId: string, index: number) => {
                    return (
                      <Task
                        taskId={taskId}
                        projectKey={projectKey}
                        columnDetails={column}
                        task={allData.tasks[taskId]}
                        index={index}
                        key={taskId}
                      />
                    );
                  })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </CardContent>
        <Button
          variant='contained'
          dir='rtl'
          color='secondary'
          onClick={handleClickOpen}
          className={classes.button}
          startIcon={<AddCircleOutlineRounded className={classes.buttonIcon} />}>
          הוסף
        </Button>
        <Dialog cbFunc={onAddNewTask} open={openDialog} setOpen={setOpenDialog} text={{ label: 'משימה:' }} />
      </Card>
    </Grid>
  );
}
