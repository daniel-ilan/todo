import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemIcon } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import AlertDialog from 'shared/components/alertDialog/AlertDialog';
import { deleteTask } from 'main/fireBaseMethods';
import { Draggable } from 'react-beautiful-dnd';

export default function Task({ ...props }) {
  const [open, setOpen] = useState(false);
  const { projectKey, columnDetails, task, taskId, index } = props;
  const alertText = 'למחוק את המשימה סופית? לא יהיה ניתן לשחזר את המשימה לאחר פעולה זאת';
  const handleDeleteTask = () => {
    columnDetails.taskIds.splice(index, 1);
    deleteTask(projectKey, columnDetails.id, taskId, columnDetails.taskIds);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {task && (
        <Draggable draggableId={taskId} index={index} key={taskId}>
          {(provided) => (
            <ListItem
              role={undefined}
              button
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
      )}
    </>
  );
}
