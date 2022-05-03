import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Hey' }: Props) => {
  return (
    <Flex justify="center">
      <Box width="400px">
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <header>
          <HStack m={5} spacing={3}>
            <Button variant="ghost">
              <Link href="/">
                <a>Home</a>
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/tasks">
                <a>Tasks</a>
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/chat">
                <a>Chat</a>
              </Link>
            </Button>
          </HStack>
        </header>
        {children}
        {/* footer */}
      </Box>
    </Flex>
  );
};

export default Layout;
