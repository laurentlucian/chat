// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// 2. Add your color mode config
// const config: ThemeConfig = {};

// 3. extend the theme
const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  styles: { global: { body: { bg: '#FFE194' } } },
  components: {
    Button: {
      variants: { ghost: { _hover: { background: '#FEF4D9' }, _active: { background: '#FEF4D9' }, borderRadius: 0 } },
    },
  },
});

export default theme;
