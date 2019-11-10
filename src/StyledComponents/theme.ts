import colors from './colors';
import { IColor, themeAlias } from './types';

let colorTheme: IColor;
const currentTheme: themeAlias = 'dark';
if (currentTheme === 'light') colorTheme = colors.light;
if (currentTheme === 'blue') colorTheme = colors.blue;
else colorTheme = colors.dark;


const theme:any = {
  ...colorTheme,
};

export default theme;