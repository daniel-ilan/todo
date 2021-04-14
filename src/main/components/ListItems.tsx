import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { ListItemIcon } from '@material-ui/core';
import { Launch } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  listItem: {
    textAlign: 'right',
  },
}));

export default function CheckboxList({ ...props }) {
  const classes = useStyles();
  const [checked, setChecked] = useState([0]);
  const { selectedProject, setSelectedProject } = props;
  const { todos } = props;

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
            <ListItemIcon>
              <Launch />
            </ListItemIcon>
          </ListItem>
        );
      })}
    </>
  );
}
