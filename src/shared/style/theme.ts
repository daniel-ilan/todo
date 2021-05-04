import { red } from '@material-ui/core/colors';
import { createMuiTheme, Theme } from '@material-ui/core/styles';

// A custom theme for this app
const theme: Theme = createMuiTheme({
    direction: 'rtl',
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        warning: {
            main: '#F44336',
        },
        background: {
            default: '#fff',
        },
    },
    typography: {
        h1: {
            fontSize: "4rem"
        }
    }
});

export default theme;
