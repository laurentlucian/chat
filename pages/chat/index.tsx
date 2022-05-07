import { Button, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import { Room } from '../../interfaces';
import fetch from '../../libs/fetch';

const Rooms = ({ data }: { data: Room }) => {
  return (
    <Flex justify="space-between" pl={3} align="center" border="1px solid black">
      <Text>Room #{data.id}</Text>
      <Link href={`/chat/${data.id}`} variant="ghost">
        Enter
      </Link>
    </Flex>
  );
};

const Chat = () => {
  const { data, mutate } = useSWR<Room[]>(`${process.env.NEXT_PUBLIC_HOST}/room`);

  const onClick = async () => {
    const response = await fetch<Room>(`${process.env.NEXT_PUBLIC_HOST}/room/new`);
    mutate([...data, response]);
  };

  return (
    <Layout title="Chat">
      <Stack w={600} align="center" spacing={5}>
        <Stack justify="center" spacing={7} w={400}>
          {data ? data.map((room, index) => <Rooms data={room} key={index} />) : 'No rooms'}
        </Stack>
        <Button onClick={onClick} variant="ghost">
          New
        </Button>
      </Stack>
    </Layout>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   // Example for including static props in a Next.js function component page.
//   // Don't forget to include the respective types for any props passed into
//   // the component.
//   const items: User[] = sampleUserData;
//   return { props: { items } };
// };

export default Chat;
