import { IColor } from './types';

interface IColors {
  light: IColor;
  dark: IColor;
  blue: IColor
}

const colors: IColors = {
    light: {
      primary: '#f9f3ed',
      secondary: '#342e37',
      activeColor: '#A43A4B',
      altColor: '#e57853', 
    },
    dark: {
      primary: '#001011',
      secondary: '#F2F2E6',
      activeColor: '#ED6767',
      altColor: '#793F5C',
    },
    blue: {
      primary: '#323846',
      secondary: '#fbf9f3',
      activeColor: '#c3f7eb',
      altColor: '#78dbf4',
    }
};

export default colors;