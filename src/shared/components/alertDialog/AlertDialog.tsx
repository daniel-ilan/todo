import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = ({ ...props }) => {
  const { open, setOpen, text, cbFunc } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const onAgree = () => {
    cbFunc();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'מחיקת משימה'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            ביטול פעולה
          </Button>
          <Button onClick={onAgree} color='primary' autoFocus>
            בסדר, המשך
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;
