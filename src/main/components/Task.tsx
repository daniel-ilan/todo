import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemIcon } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import AlertDialog from './AlertDialog';
import { deleteTask } from 'main/fireBaseMethods';
import { Draggable } from 'react-beautiful-dnd';
const useStyles = makeStyles((theme) => ({
  listItem: {
    textAlign: 'right',
  },
}));

export default function Task({ ...props }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { projectKey, cardName, task, taskId, index } = props;
  const alertText = 'למחוק את המשימה סופית? לא יהיה ניתן לשחזר את המשימה לאחר פעולה זאת';
  const handleDeleteTask = () => {
    deleteTask(projectKey, cardName, taskId);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  /*
  const handleToggle = (todoIndex: number) => () => {
    const currentIndex = checked.indexOf(todoIndex);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(todoIndex);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  useEffect(() => {
    setSelectedProject({ ...selectedProject, todos });
  }, [selectedProject, setSelectedProject, todos]); */
  /* todos: {
    new : [{todo}, {todo}, {todo}]
    ,
    doing [{todo}, {todo}, {todo}, ]
} */
  return (
    <Draggable draggableId={taskId} index={index} key={taskId}>
      {(provided) => (
        <ListItem
          role={undefined}
          button
          className={classes.listItem}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}>
          <ListItemText primary={task.name} />
          <ListItemIcon onClick={() => handleClickOpen()}>
            <DeleteForever />
          </ListItemIcon>
          <AlertDialog open={open} setOpen={setOpen} text={alertText} cbFunc={handleDeleteTask} />
        </ListItem>
      )}
    </Draggable>
  );
}
