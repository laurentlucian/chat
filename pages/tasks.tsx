import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Box, Button, Divider, Flex, Heading, HStack, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { darken } from '@chakra-ui/theme-tools';
import TextareaAutosize from 'react-textarea-autosize';
import { nanoid } from 'nanoid';

const TaskItem = ({
  task,
  onEdit,
  onComplete,
  onDelete,
}: {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (value: string, id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Flex
      padding={1.5}
      paddingLeft={5}
      paddingRight={4}
      borderRadius={13}
      width={400}
      minHeight="45px"
      alignItems="center"
      justifyContent="space-between"
      bg="#FFF4D9"
      _hover={{ bg: darken('#FFF4D9', 6) }}
      _focusWithin={{ bg: darken('#FFF4D9', 6) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Textarea
        as={TextareaAutosize}
        variant="unstyled"
        value={task.value}
        resize="none"
        minHeight="40px"
        fontWeight="semibold"
        pr={1}
        onChange={(e) => onEdit(e.currentTarget.value, task.id)}
      />

      <HStack justify="center" minW="25px">
        {hover && (
          <Text as="button" onClick={() => onComplete(task.id)} _hover={{ fontWeight: 'semibold' }}>
            ✓
          </Text>
        )}

        <Text as="button" onClick={() => onDelete(task.id)} _hover={{ fontWeight: 'semibold' }} color="#FF7678">
          ✕
        </Text>
      </HStack>
    </Flex>
  );
};
const TaskCompletedItem = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
  return (
    <Flex
      padding={1.5}
      paddingLeft={5}
      paddingRight={4}
      borderRadius={13}
      width={400}
      minHeight="45px"
      alignItems="center"
      justifyContent="space-between"
      bg="#FCEBBB"
    >
      <Text wordBreak="break-word" fontWeight="semibold" pr={1}>
        {task.value}
      </Text>

      <Text as="button" onClick={() => onDelete(task.id)} _hover={{ fontWeight: 'semibold' }} color="#FF7678">
        ✕
      </Text>
    </Flex>
  );
};

type Task = {
  id: string;
  value: string;
  completed: boolean;
};

const Tasks = () => {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const onSave = (updatedTasks: Array<Task>) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const onSubmit = () => {
    setTasks((prevState) => {
      if (text === '') return prevState;
      const updatedTasks = [...prevState, { id: nanoid(), value: text, completed: false }];
      onSave(updatedTasks);
      setText('');
      return updatedTasks;
    });
  };

  const onEdit = (value: string, id: string) => {
    const newTasks = tasks.map((task) => (task.id === id ? { ...task, value } : task));
    setTasks(newTasks);
    onSave(newTasks);
  };

  const onComplete = (id: string) => {
    const newTasks = tasks.map((task) => (task.id === id ? { ...task, completed: true } : task));
    setTasks(newTasks);
    onSave(newTasks);
  };

  const onClear = () => {
    setTasks([]);
    onSave([]);
  };

  const onDelete = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    onSave(updatedTasks);
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('tasks'));
    if (storedHistory) {
      setTasks(storedHistory);
    }
  }, []);

  return (
    <Layout title="Task List">
      <Flex justify="center">
        <Box w="100%">
          <Heading paddingBottom={10}>Task List</Heading>
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
                  console.log(event.key);
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
            {tasks
              .map(
                (task) =>
                  !task.completed && (
                    <TaskItem key={task.id} task={task} onComplete={onComplete} onDelete={onDelete} onEdit={onEdit} />
                  ),
              )
              .reverse()}
          </Stack>
          <Stack>
            <Divider my={5} borderColor="black" />
            {tasks
              .map((task) => task.completed && <TaskCompletedItem key={task.id} task={task} onDelete={onDelete} />)
              .reverse()}
          </Stack>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Tasks;
