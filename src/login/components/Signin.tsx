import React, { useState } from 'react';
/* import { useHistory } from 'react-router-dom'; */
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from 'shared/providers/firebaseAuthProvider';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    height: '100%',
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '75%;',
    maxWidth: '75%',
    justifyContent: 'center', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: '50%',
    alignSelf: 'center',
  },
  smallText: {
    width: '100%',
  },
  h100: {
    height: '100%',
  },
}));

const Signin = ({ ...props }) => {
  const { handleChange } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signin = useAuth()!.signin;
  const history = useHistory();

  const handleSignIn = (event: any, email: string, password: string) => {
    console.log(error);
    event.preventDefault();
    setError('');
    setLoading(true);
    signin(email, password)
      .then((ref) => {
        setLoading(false);
        history.push('/todos');
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
        setLoading(false);
      });
    setEmail('');
    setPassword('');
  };

  const handleTabChange = (event: any) => {
    handleChange(event, 1);
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  return (
    <div className={classes.h100}>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h4'>
          התחברות
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='dense'
            required
            fullWidth
            id='userEmail'
            label='כתובת מייל'
            name='userEmail'
            value={email}
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            variant='outlined'
            margin='dense'
            required
            fullWidth
            name='userPassword'
            value={password}
            label='ססמא'
            type='password'
            id='userPassword'
            onChange={(event) => onChangeHandler(event)}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={loading}
            onClick={(event) => {
              handleSignIn(event, email, password);
            }}>
            התחברות
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            disabled={loading}
            className={classes.submit}
            onClick={(event) => {
              console.log(event);
            }}>
            התחברות עם גוגל
          </Button>
          <Grid container>
            <Typography variant='body2' align='center' className={classes.smallText}>
              אין לך חשבון?
              <Link href='#' variant='body2' onClick={handleTabChange}>
                {' צור לי משתמש חדש  '}
              </Link>
            </Typography>
          </Grid>
        </form>
      </div>
    </div>
  );
};

/* mt={4}
            color='secondary'
            className={classes.submit}
            onClick={(event) => {
              console.log(event);
            }} */
export default Signin;
