import { useState } from 'react';
import Layout from '../components/Layout';
import { Box, Button, Divider, Flex, Heading, HStack, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';
import useSWR from 'swr';
import useUser from '../hooks/useUser';
import fetcher from '../libs/fetch';

const TaskItem = ({
  task,
  onEdit,
  onComplete,
  onSave,
  onDelete,
}: {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (value: string, id: string) => void;
  onSave: (value: string, id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Flex width={400} justify="space-between" border="1px solid black">
      <Textarea
        as={TextareaAutosize}
        variant="unstyled"
        value={task.body}
        resize="none"
        minHeight="40px"
        fontWeight="semibold"
        pl={3}
        pr={1}
        onChange={(e) => onEdit(e.currentTarget.value, task.id)}
        onBlur={(e) => onSave(e.currentTarget.value, task.id)}
      />

      <HStack justify="center" spacing={0}>
        <Button h="100%" variant="ghost" onClick={() => onComplete(task.id)}>
          ✓
        </Button>

        <Button h="100%" variant="ghost" onClick={() => onDelete(task.id)} color="#FF7678">
          ✕
        </Button>
      </HStack>
    </Flex>
  );
};
const TaskCompletedItem = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
  return (
    <Flex width={400} justify="space-between" minHeight="40px" border="1px solid black">
      <Text w="100%" lineHeight="40px" pl={3} pr={1} wordBreak="break-word" fontWeight="semibold">
        {task.body}
      </Text>

      <HStack justify="center">
        <Button h="100%" variant="ghost" onClick={() => onDelete(task.id)} color="#FF7678">
          ✕
        </Button>
      </HStack>
    </Flex>
  );
};

type Task = {
  id: string;
  body: string;
  completed: boolean;
};

const Tasks = () => {
  const [text, setText] = useState('');
  const { user } = useUser();
  const { data, mutate, error } = useSWR<Task[]>(
    user ? [`${process.env.NEXT_PUBLIC_HOST}/tasks`, { headers: { userId: user.id } }] : null,
  );

  const onSubmit = async () => {
    if (text === '') return;
    const response = await fetcher<Task>(`${process.env.NEXT_PUBLIC_HOST}/tasks/new`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id, value: text }),
    });
    mutate([...data, response]);
    setText('');
  };

  const onEdit = (value: string, id: string) => {
    mutate([...data.map((task) => (task.id === id ? { ...task, body: value } : task))], { revalidate: false });
  };

  const onSave = async (value: string, id: string) => {
    const response = await fetcher<Task>(`${process.env.NEXT_PUBLIC_HOST}/tasks/${id}/edit`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    mutate([...data.map((task) => (task.id === id ? response : task))]);
  };

  const onComplete = async (id: string) => {
    const response = await fetcher<Task>(`${process.env.NEXT_PUBLIC_HOST}/tasks/${id}/complete`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: true }),
    });
    mutate([...data.map((task) => (task.id === id ? response : task))]);
  };

  const onDelete = async (id: string) => {
    await fetcher<Task>(`${process.env.NEXT_PUBLIC_HOST}/tasks/${id}`, { method: 'delete' });
    mutate([...data.filter((task) => task.id !== id)]);
  };

  const onClear = () => {
    fetcher<Task[]>(`${process.env.NEXT_PUBLIC_HOST}/tasks/clear`);
    mutate([]);
  };

  if (!data) return <Text>Loading</Text>;

  return (
    <Layout title="Tasks">
      <Flex justify="center">
        <Box w="100%">
          <HStack marginBottom={8}>
            <Input
              placeholder="What's up"
              borderBottomColor="black"
              variant="flushed"
              value={text}
              onChange={(data) => {
                setText(data.currentTarget.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSubmit();
                }
              }}
            />
            <Button variant="ghost" onClick={onSubmit}>
              Enter
            </Button>
            <Button variant="ghost" onClick={onClear}>
              Clear
            </Button>
          </HStack>

          <Stack alignItems="center" spacing={5} minH="300px">
            {data
              .map(
                (task) =>
                  !task.completed && (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={onComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onSave={onSave}
                    />
                  ),
              )
              .reverse()}
          </Stack>
          <Stack alignItems="center" spacing={5} minH="300px">
            <Divider my={5} borderColor="black" />
            {data
              ?.map((task) => task.completed && <TaskCompletedItem key={task.id} task={task} onDelete={onDelete} />)
              .reverse()}
          </Stack>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Tasks;
