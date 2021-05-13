import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        נבנה על ידי דניאל אילן ;)
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    flex: '0 0 100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1, 2),
    marginTop: 'auto',
    minHeight: '10%',
    width: '100vw',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth='sm'>
        <Copyright />
      </Container>
    </footer>
  );
};

export default Footer;
