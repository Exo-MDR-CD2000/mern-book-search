import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  createHttpLink
} from '@apollo/react-hooks'; // we import all of the necessary packages from Apollo Client

import { setContext } from '@apollo/client/link/context'; // this allows us to set the authentication header



const httpLink = createHttpLink({ // this creates the connection to the server's graphql endpoint
  uri: '/graphql'
});

// create the auth link that will retrieve the token from local storage and set the header

const authLink = setContext((_, { headers }) => { // authLink is a function that will get called every time a request is made to the server
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${ token }` : '',

    },
  };
});


// create the apollo provider to make every request work with the apollo server

const client = new ApolloClient({ // this instantiates the Apollo Client instance and creates the connection to the API endpoint
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}> {/* this wraps the entire app in the ApolloProvider component so that every component has access to the server's API data */}
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
        </Routes>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
