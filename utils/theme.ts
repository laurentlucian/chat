import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  styles: {
    global: (props) => ({
      body: {
        fontFamily: 'body',
        color: mode('#161616', '#EEE6E2')(props),
        bg: mode('#EEE6E2', '#131415')(props),
        lineHeight: 'base',
      },
    }),
  },
  components: {
    Button: {
      variants: { ghost: { _hover: { background: '#E8DED8' }, _active: { background: '#E8DED8' }, borderRadius: 3 } },
    },
  },
  fonts: {
    heading: 'MonoLisa Bold, sans-serif',
    body: 'MonoLisa, sans-serif',
  },
});

export default theme;
