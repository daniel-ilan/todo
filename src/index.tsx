import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './shared/style/theme';
import App from './app';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router basename='/todo'>
      <CssBaseline />
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root'),
);
