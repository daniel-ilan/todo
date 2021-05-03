import Task from './Task';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { CardHeader, Card, CardContent, Grid, List, Button, IconButton } from '@material-ui/core';
import { AddCircleOutlineRounded } from '@material-ui/icons';
import { addTask, changeColumnName } from 'main/fireBaseMethods';
import Dialog from './Dialog';
import { Droppable } from 'react-beautiful-dnd';
import Edit from '@material-ui/icons/Edit';
import EditInline from 'shared/components';

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
  cardTitleIcon: {
    opacity: '0',
    transition: '0.3s',
  },
  cardTitle: {
    display: 'inline-block',
    borderRadius: 5,
    padding: theme.spacing(0, 2),
    transition: '0.3s',
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      '& $cardTitleIcon': {
        opacity: '1',
      },
    },
  },
}));

interface IaddTask {
  projectKey: string;
  column: string;
  name: string;
}

export default function Cards({ ...props }) {
  const classes = useStyles();

  const { projectKey, column, tasks, allData } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsediting] = useState(false);

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

  const enableEditName = () => {
    setIsediting(true);
  };

  const submitColumnNameChange = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const newName = event.target.value;
    changeColumnName(projectKey, column.id, newName);
    setIsediting(false);
  };

  return (
    <Grid item xs={12} md={4}>
      <Card className={classes.card}>
        <CardHeader
          onClick={() => enableEditName()}
          title={
            !isEditing ? (
              <div className={classes.cardTitle}>
                {column.title}
                <IconButton className={classes.cardTitleIcon}>
                  <Edit />
                </IconButton>
              </div>
            ) : (
              <EditInline value={column.title} cbFunc={submitColumnNameChange} />
            )
          }
        />

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
