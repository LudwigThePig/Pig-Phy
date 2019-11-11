import { IColor } from './types';

interface IColors {
  light: IColor;
  dark: IColor;
  blue: IColor
}

const colors: IColors = {
    light: {
      primaryColor: '#f9f3ed',
      secondaryColor: '#342e37',
      activeColor: '#A43A4B',
      altColor: '#e57853', 
    },
    dark: {
      primaryColor: '#001011',
      secondaryColor: '#F2F2E6',
      activeColor: '#ED6767',
      altColor: '#793F5C',
    },
    blue: {
      primaryColor: '#323846',
      secondaryColor: '#fbf9f3',
      activeColor: '#c3f7eb',
      altColor: '#78dbf4',
    }
};

export default colors;