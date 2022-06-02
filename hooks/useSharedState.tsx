import useSWR from 'swr';

const useSharedState = (key: string, initial: any) => {
  const { data: state, mutate: setState } = useSWR(key, {
    fallbackData: initial,
  });
  return [state, setState];
};

export default useSharedState;
