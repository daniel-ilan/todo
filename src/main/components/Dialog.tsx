import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: '450px',
  },
}));

export default function FormDialog({ ...props }) {
  const [name, setName] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const { cbFunc, open, setOpen, text } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (event: any) => {
    const { value } = event.currentTarget;
    setName(value);
  };

  const handleModelClose = (event: any, name: string) => {
    event.preventDefault();
    cbFunc(name);
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{text.label}</DialogTitle>
        <DialogContent className={classes.dialog}>
          <TextField
            autoFocus
            onChange={handleNameChange}
            margin='dense'
            id='projectName'
            name='projectName'
            label={text.label}
            type='text'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            ביטול
          </Button>
          <Button color='primary' variant='contained' onClick={(event) => handleModelClose(event, name)}>
            שליחה
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
