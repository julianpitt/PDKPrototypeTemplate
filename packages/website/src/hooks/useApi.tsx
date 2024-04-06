import useSigV4Client from '@aws-northstar/ui/components/CognitoAuth/hooks/useSigv4Client';
import { QueryClient } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { DefaultApi, Configuration, DefaultApiClientProvider } from 'TestApi-typescript-react-query-hooks';
import { RuntimeConfigContext } from '../context/RuntimeContext';

export const useApi = () => {
  const client = useSigV4Client();
  const runtimeContext = useContext(RuntimeConfigContext);

  return useMemo(() => {
    return runtimeContext?.apiUrl
      ? new DefaultApi(
          new Configuration({
            basePath: runtimeContext.apiUrl,
            fetchApi: client,
          }),
        )
      : undefined;
  }, [client, runtimeContext?.apiUrl]);
};

export const ApiProvider = ({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) => {
  const api = useApi();
  if (api) {
    return (
      <DefaultApiClientProvider apiClient={api} client={queryClient}>
        {children}
      </DefaultApiClientProvider>
    );
  } else {
    return <></>;
  }
};
