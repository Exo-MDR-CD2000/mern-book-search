import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

// This means that I no longer need to import the getMe and the deleteBook functions from the API file. I can instead import the useQuery() Hook from Apollo Client and use it to execute the GET_ME query on load.

//TODO: remove the useEffect hook that sets the userData state on load and instead use the useQuery() Hook to execute the GET_ME query on load and save it to a variable named userData






const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  // // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {}; // provides defensive programming so that the data object will always have the me object available on it, which will always be an empty array if nothing has been saved yet


  const [removeBook] = useMutation(REMOVE_BOOK); // our imported mutation function set as a variable

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try { // this try catch block needs to be modified to use the removeBook() mutation function instead of the deleteBook() function imported from the API file
      // const response = await deleteBook(bookId, token);
      const { data } = await removeBook({
        variables: { bookId }
      });

      if (!data.removeBook) {
        throw new Error('something went wrong!');
      }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      userData = data.removeBook; 
      // upon success, remove book's id from localStorage
      removeBookId(bookId); // keep this
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!loading) { // change this to 'loading' stated above handleDeleteBook
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
