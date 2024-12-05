

import { createTheme } from '@mui/material';


const theme = createTheme({
    palette: {
      mode: 'light',
      common: {
        black: '#06030d',
        white: '#fcfcfc',
      },
      primary: {
        main: '#614298',
        light: '#5f6367',
        dark: '#1565c0',
        contrastText: '#e8eaed',
      },
      secondary: {
        main: '#fbbd05',
        light: '#ba68c8',
        dark: '#41331c',
        contrastText: '#fff',
      },
      error: {
        main: '#e83f40',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#fff',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff',
      },
      gray:{
        "gray5": "#7d748c",
        "gray2": "#d5d2d9",
        "gray9": "#181126",
        "gray7": "#4a4159",
        "gray4":  "#9A93A5"
      },
      grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#f5f5f5',
        A200: '#eeeeee',
        A400: '#bdbdbd',
        A700: '#616161',
      },
      contrastThreshold: 3,
      getContrastText: (background) =>
        background.contrastText || theme.palette.primary.contrastText,
      augmentColor: (color, mainShade = 500, lightShade = 300, darkShade = 700) => {
        const mainColor = color[mainShade];
        color = { ...color, main: mainColor };
        color.light = color[lightShade] || theme.palette.primary.light;
        color.dark = color[darkShade] || theme.palette.primary.dark;
        return color;
      },
      tonalOffset: 0.2,
    },
    typography: {
      htmlFontSize: 16,
      pxToRem: () => {},
      fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 300,
        fontSize: '6rem',
        lineHeight: 1.167,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 300,
        fontSize: '3.75rem',
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '3rem',
        lineHeight: 1.167,
        letterSpacing: '0em',
      },
      h4: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '2.125rem',
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '1.5rem',
        lineHeight: 1.334,
        letterSpacing: '0em',
      },
      h6: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
      },
      caption: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      overline: {
        fontFamily: '"Google Sans",Roboto,Arial,sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
      },
      inherit: {
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit',
      },
    },
  });



  export default theme;