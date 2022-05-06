import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { User } from '../interfaces';

const useUser = () => {
  const [userId, setUserId] = useState<string>(null);
  const { data, mutate, error } = useSWR<User>(
    userId === null ? `${process.env.NEXT_PUBLIC_HOST}/user/${userId}` : null,
  );
  console.log('🚀 ~ useUser ~ data | userId | error', data, userId, error);

  const getUserId = () => {
    const localUser = localStorage.getItem('userId');
    if (localUser) return setUserId(localUser);
    return setUserId('');
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (data) {
      setUserId(data.id);
      localStorage.setItem('userId', data.id);
    }
  }, [data]);

  return {
    user: data,
    mutate,
    loading: !error && !data,
    error: error,
  };
};

export default useUser;
