import { Box, Button, Flex, Heading, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      <Box display="flex" justifyContent="center">
        <Heading>Hello</Heading>
      </Box>
    </Layout>
  );
};

export default IndexPage;
