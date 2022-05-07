import { Button, Flex, Heading, Hide, HStack, Stack, Text, Textarea } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import socketIO, { Socket } from 'socket.io-client';
import Layout from '../../components/Layout';
import useUser from '../../hooks/useUser';
import { Message, User } from '../../interfaces';

const useChat = (roomId: string) => {
  const { user, loading } = useUser();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (!loading && roomId) {
      socketRef.current = socketIO(process.env.NEXT_PUBLIC_HOST, { query: { userId: user?.id, roomId } });

      socketRef.current.on('chat', (data: Message) => {
        const incomingMsg = {
          ...data,
        };
        setMsgs((msgs) => [...msgs, incomingMsg]);
      });

      socketRef.current.on('users', (users: Array<User>) => {
        setUsers(users);
      });

      socketRef.current.on('history', (history: Array<Message>) => {
        setMsgs(history);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, roomId]);

  const sendMsg = (text: string) => {
    socketRef.current.emit('chat', {
      userId: user.id,
      roomId: roomId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      body: text,
    });
  };

  const deleteMsg = (data: Message) => {
    const newMsgs = [...msgs];
    newMsgs.splice(
      msgs.findIndex((msg) => msg.id === data.id),
      1,
    );
    setMsgs(newMsgs);
    socketRef.current.emit('delete', data);
  };

  return { currentUser: user, msgs, users, sendMsg, deleteMsg };
};

const Msg = (props: { id: string; user: User | null; children: Message; delete: (data: Message) => void }) => (
  <Text
    onClick={() => {
      if (props.children.userId === props.user.id) props.delete(props.children);
    }}
    cursor="pointer"
    fontSize={14}
  >
    <Text fontWeight="bold" as="span">
      {props.children.time}
      {` - ${props.user?.name || props.user?.id}: `}
    </Text>
    <Text as="span">{props.children.body}</Text>
  </Text>
);

const Chatroom = () => {
  const router = useRouter();
  const { id } = router.query;
  // @ts-ignore
  const { currentUser, msgs, users, sendMsg, deleteMsg } = useChat(id);
  const [text, setText] = useState('');

  const onSend = () => {
    if (text.trim() !== '') {
      sendMsg(text);
      setText('');
    }
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  return (
    <Layout title={`Chatroom #${id}`}>
      <Flex justify="center">
        <Stack spacing={5}>
          <Heading>Chatroom #{id}</Heading>
          <Flex>
            <Stack>
              <Stack overflow="auto" w={425} h={350}>
                {msgs.map((message) => (
                  <Msg key={message.id} user={message.user} id={message.userId} delete={deleteMsg}>
                    {message}
                  </Msg>
                ))}
              </Stack>
              <HStack border="1px solid black" pl={2} borderRight="0px" alignItems="center">
                <Textarea
                  value={text}
                  onChange={handleTextArea}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      onSend();
                      e.preventDefault();
                    }
                  }}
                  variant="unstyled"
                />
                <Button h="100%" borderRadius={0} onClick={onSend} variant="ghost">
                  Send
                </Button>
              </HStack>
            </Stack>
            <Stack borderLeft="1px solid black" pl={5}>
              <Hide below="md">
                <Text fontWeight="bold">Users</Text>
                <Stack w={150}>
                  {users.map((user) => {
                    return <Text key={user.id}>{user.name || user.id}</Text>;
                  })}
                </Stack>
              </Hide>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </Layout>
  );
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   try {
//     const id = params?.id;
//     // const item = sampleUserData.find((data) => data.id === Number(id));
//     // By returning { props: item }, the StaticPropsDetail component
//     // will receive `item` as a prop at build time
//     return { props: { id } };
//   } catch (err: any) {
//     return { props: { errors: err.message } };
//   }
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { data, mutate, error } = useSWR<Room[]>(`http://${process.env.NEXT_PUBLIC_HOST}/room`);
//   // Get the paths we want to pre-render based on users
//   const paths = data.map((room) => ({
//     params: { id: room.id.toString() },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false };
// };

export default Chatroom;
