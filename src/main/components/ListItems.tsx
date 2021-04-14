import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemIcon } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import AlertDialog from './AlertDialog';
import { deleteTask } from 'main/fireBaseMethods';
const useStyles = makeStyles((theme) => ({
  listItem: {
    textAlign: 'right',
  },
}));

export default function CheckboxList({ ...props }) {
  const classes = useStyles();
  const [checked, setChecked] = useState([0]);
  const [open, setOpen] = useState(false);
  const [taskId, setTaskId] = useState('');
  const { selectedProject, setSelectedProject, projectKey, card } = props;
  const { todos } = props;

  const alertText = 'למחוק את המשימה סופית? לא יהיה ניתן לשחזר את המשימה לאחר פעולה זאת';
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

  const handleDeleteTask = () => {
    deleteTask(projectKey, card, taskId);
  };
  const handleClickOpen = (id: string) => {
    setOpen(true);
    setTaskId(id);
  };
  console.log('todos', todos);

  /*   useEffect(() => {
    setSelectedProject({ ...selectedProject, todos });
  }, [selectedProject, setSelectedProject, todos]); */
  /* todos: {
    new : [{todo}, {todo}, {todo}]
    ,
    doing [{todo}, {todo}, {todo}, ]
} */
  return (
    <>
      {Object.keys(todos).map((key: string, index: number) => {
        const labelId = `checkbox-list-label-${index}`;
        return (
          <ListItem key={index} role={undefined} button className={classes.listItem}>
            <ListItemText id={labelId} primary={todos[key].name} />
            <ListItemIcon onClick={() => handleClickOpen(key)}>
              <DeleteForever />
            </ListItemIcon>
          </ListItem>
        );
      })}
      <AlertDialog open={open} setOpen={setOpen} text={alertText} cbFunc={handleDeleteTask} />
    </>
  );
}
