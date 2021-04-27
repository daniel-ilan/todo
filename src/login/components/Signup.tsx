import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'shared/providers/firebaseAuthProvider';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

/* import { signInWithGoogle } from "../../firebase";
 */

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
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '75%;',
    maxWidth: '75%',
    justifyContent: 'center', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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

const Signup = ({ ...props }) => {
  const classes = useStyles();
  const { handleChange } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const signup = useAuth()!.signup;
  const history = useHistory();

  const handleSignup = (event: any, email: string, password: string, displayName: string) => {
    console.log(error);
    event.preventDefault();
    setError('');
    setLoading(true);
    signup(email, password, displayName)
      .then((ref) => {
        setLoading(false);
        history.push('/todos');
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
    setEmail('');
    setPassword('');
    setDisplayName('');
  };
  const onChangeHandler = (event: any) => {
    const { name, value } = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    } else if (name === 'displayName') {
      setDisplayName(value);
    }
  };

  const handleTabChange = (event: any) => {
    handleChange(event, 0);
  };

  return (
    <div className={classes.h100}>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h4'>
          הרשמה
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='dense'
            required
            fullWidth
            id='displayName'
            label='לדוגמא: ישראל ישראלי'
            name='displayName'
            value={displayName}
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            variant='outlined'
            margin='dense'
            required
            fullWidth
            id='userEmail'
            value={email}
            label='כתובת מייל'
            name='userEmail'
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            variant='outlined'
            margin='dense'
            required
            fullWidth
            name='userPassword'
            label='ססמא'
            type='password'
            id='userPassword'
            autoComplete='current-password'
            value={password}
            onChange={(event) => onChangeHandler(event)}
          />
          <TextField
            variant='outlined'
            margin='dense'
            required
            fullWidth
            name='authPassword'
            label='אישור סיסמה'
            type='password'
            id='authPassword'
            autoComplete='current-password'
            onChange={(event) => onChangeHandler(event)}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading}
            className={classes.submit}
            onClick={(event) => {
              handleSignup(event, email, password, displayName);
            }}>
            הרשמה
          </Button>
          {/* <Button
            type='submit'
            variant='contained'
            mt={4}
            color='secondary'
            className={classes.submit}
            onClick={(event) => {
              console.log(event);
            }}>
            התחברות עם גוגל
          </Button> */}
          <Grid container>
            <Typography variant='body2' align='center' className={classes.smallText}>
              כבר נרשמת?
              <Link href='#' variant='body2' onClick={handleTabChange}>
                {' עבור להתחברות  '}
              </Link>
            </Typography>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default Signup;
