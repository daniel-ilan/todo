import ListItems from './ListItems';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CardHeader, Card, CardContent, Typography, Grid, List, IconButton, Button } from '@material-ui/core';
import { AddCircleOutlineRounded } from '@material-ui/icons';
import { addTask } from 'main/fireBaseMethods';
import Dialog from './Dialog';

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

interface Ititles {
  new: string;
  doing: string;
  done: string;
  [key: string]: string;
}

interface IaddTask {
  projectKey: string;
  board: string;
  name: string;
}

export default function Cards({ ...props }) {
  const classes = useStyles();
  const { selectedProject, setSelectedProject, card, projectKey } = props;
  const titles: Ititles = {
    new: 'חדש',
    doing: 'בעשייה',
    done: 'נעשה',
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const onAddNewTask = (name: string) => {
    const newTask: IaddTask = {
      projectKey,
      board: card,
      name,
    };
    addTask(newTask);
  };
  return (
    <Grid item xs={12} md={4}>
      <Card className={classes.card}>
        <CardHeader title={titles[card]} />
        <CardContent className={classes.cardContent}>
          <List className={classes.list} dir='rtl'>
            {card in selectedProject.todos && (
              <ListItems
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                todos={selectedProject.todos[card]}
              />
            )}
          </List>
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
        <Dialog cbFunc={onAddNewTask} open={openDialog} setOpen={setOpenDialog} />
      </Card>
    </Grid>
  );
}
