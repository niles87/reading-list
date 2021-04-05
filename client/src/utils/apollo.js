import ApolloClient from 'apollo-client';
import { HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('id');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = new HttpLink({
  uri: '/graphql',
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
});
