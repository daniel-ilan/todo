import React from 'react';
import rtl from 'jss-rtl';
import { create } from 'jss';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './shared/style/theme';
import App from './app';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

ReactDOM.render(
  <StylesProvider jss={jss}>
    <ThemeProvider theme={theme}>
      <Router basename='/todo'>
        <CssBaseline />
        <App />
      </Router>
    </ThemeProvider>
  </StylesProvider>,
  document.getElementById('root'),
);
