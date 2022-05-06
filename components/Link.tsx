import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const Link = (props) => {
  const { children, href, ...rest } = props;
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <NextLink passHref href={href}>
      <Button variant="ghost" isActive={isActive} {...rest}>
        {children}
      </Button>
    </NextLink>
  );
};

export default Link;
