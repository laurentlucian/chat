import { Box, Flex, HStack, Input, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import { User } from '../interfaces';
import fetch from '../libs/fetch';
import Link from './Link';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Study Hub' }: Props) => {
  const { user, mutate, loading } = useUser();
  const [name, setName] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user?.name]);

  const onSubmit = async () => {
    const response = await fetch<User>(`${process.env.NEXT_PUBLIC_HOST}/user/name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id, name: name }),
    });
    mutate({ ...user, name: response.name });
  };
  if (loading) return <Text>Loading...</Text>;

  return (
    <Flex justify="center">
      <Box minW={500}>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        </Head>
        <Flex mx="auto" w={500} as="header" py={7} mb={5} justify="space-between">
          <HStack spacing={4}>
            <Link href="/">Home</Link>
            <Link href="/tasks">Tasks</Link>
            <Link href="/chat">Chat</Link>
          </HStack>

          <Input
            textAlign="right"
            value={name}
            w={200}
            onChange={(e) => setName(e.currentTarget.value)}
            maxLength={20}
            onBlur={onSubmit}
            borderRadius={0}
            variant="unstyled"
            pr={4}
          />
        </Flex>
        {children}
        {/* footer */}
      </Box>
    </Flex>
  );
};

export default Layout;
