import { Button, Flex, Heading, HStack, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { nanoid } from 'nanoid';
import socketIO, { Socket } from 'socket.io-client';

type Message = {
  id: string;
  userId: string;
  name: string;
  time: Date;
  body: string;
};

type User = {
  userId: string;
  name: string;
  active: boolean;
};

const useChat = () => {
  const [msgs, setMsgs] = useState<Array<Message>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const userId = useRef('');
  const socketRef = useRef<Socket>();

  const getUserId = () => {
    const localUser = localStorage.getItem('userId');
    if (localUser) return (userId.current = localUser);
    const newUser = nanoid();
    localStorage.setItem('userId', newUser);
    return (userId.current = newUser);
  };

  useEffect(() => {
    getUserId();
    socketRef.current = socketIO(process.env.NEXT_PUBLIC_HOST, { query: { userId: userId.current } });

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

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const setName = (name: string) => {
    socketRef.current.emit('name', name);
  };

  const sendMsg = (text: string) => {
    socketRef.current.emit('chat', {
      id: nanoid(),
      userId: userId.current,
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
    console.log(newMsgs);
    setMsgs(newMsgs);
    socketRef.current.emit('delete', data);
  };

  return { userId: userId.current, msgs, users, sendMsg, setName, deleteMsg };
};

const Msg = (props: { id: string; user: User | null; children: Message; delete: (data: Message) => void }) => (
  <Text
    onClick={() => {
      if (props.children.userId === props.user.userId) props.delete(props.children);
    }}
    cursor="pointer"
    fontSize={14}
  >
    <Text fontWeight="bold" as="span">
      {props.children.time}
      {` - ${props.user?.name || props.user?.userId}: `}
    </Text>
    <Text as="span">{props.children.body}</Text>
  </Text>
);

const Chat = () => {
  const { userId, msgs, users, sendMsg, setName, deleteMsg } = useChat();
  const [text, setText] = useState('');
  const [name, editName] = useState('');
  const [edit, toggleEdit] = useState(false);

  const onSend = () => {
    if (text.trim() !== '') {
      sendMsg(text);
      setText('');
    }
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  useEffect(() => {
    editName(users.find((user) => user.userId === userId)?.name);
  }, [users]);

  return (
    <Layout>
      <Flex justify="center">
        <Stack spacing={5} p={5}>
          <Flex>
            <Heading>Chatroom</Heading>
          </Flex>
          <Flex>
            <Stack>
              <Stack overflow="auto" w={500} h={350}>
                {msgs.map((message) => (
                  <Msg
                    key={message.id}
                    user={users.find((user) => user.userId === message.userId) ?? null}
                    id={message.userId}
                    delete={deleteMsg}
                  >
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
            <Stack borderLeft="1px solid black" pl={5} w={230}>
              <Text fontWeight="bold">Users</Text>
              <Stack>
                {users
                  .filter((user) => user.active === true)
                  .map((user) => {
                    if (user.userId === userId) {
                      return (
                        <HStack key={user.userId} justify="space-between">
                          {edit ? (
                            <>
                              <Input
                                variant="unstyled"
                                autoFocus
                                w="fit-content"
                                value={name}
                                onChange={(e) => editName(e.currentTarget.value)}
                              />
                              <Text
                                as="button"
                                onClick={() => {
                                  setName(name);
                                  toggleEdit(!edit);
                                }}
                                size="sm"
                                variant="unstyled"
                              >
                                ✓
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text key={user.userId}>{user.name || user.userId}</Text>
                              <Text as="button" onClick={() => toggleEdit(!edit)} size="sm" variant="unstyled">
                                ✍
                              </Text>
                            </>
                          )}
                        </HStack>
                      );
                    }
                    return <Text key={user.userId}>{user.name || user.userId}</Text>;
                  })}
              </Stack>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Chat;
