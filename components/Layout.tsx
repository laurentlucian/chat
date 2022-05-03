import { Box, Link as ChakraLink, Button, Flex, HStack } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Link = (props) => {
  const { children, href, ...rest } = props;
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <NextLink passHref href={href}>
      <ChakraLink fontWeight={isActive ? 'semibold' : 'normal'} {...rest}>
        {children}
      </ChakraLink>
    </NextLink>
  );
};

const Layout = ({ children, title = 'Study Hub' }: Props) => {
  return (
    <Flex justify="center">
      <Box minW={400}>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <HStack mx="auto" as="header" w={400} py={7} mb={5} spacing={4}>
          <Link href="/">Home</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/chat">Chat</Link>
        </HStack>
        {children}
        {/* footer */}
      </Box>
    </Flex>
  );
};

export default Layout;
