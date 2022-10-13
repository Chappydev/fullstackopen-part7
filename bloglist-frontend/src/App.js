import { Button, Container, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useMatch } from 'react-router-dom';
import BlogDetails from './components/BlogDetails';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import User from './components/User';
import UsersList from './components/UsersList';
import { initializeBlogs } from './reducers/blogReducer';
import { showError, showNotification } from './reducers/notificationReducer';
import { loginAs, loginWithCredentials } from './reducers/userReducer';
import { initializeUsers } from './reducers/usersReducer';
import blogService from './services/blogs';

const App = () => {
  const dispatch = useDispatch();
  const { user, users, blogs } = useSelector((state) => state);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userMatch = useMatch('/users/:id');
  const userToDisplay = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch('/blogs/:id');
  const blogToDisplay = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginWithCredentials(username, password));
      setUsername('');
      setPassword('');
      dispatch(showNotification('Successfully logged in', 5));
    } catch (exception) {
      dispatch(showError('Wrong username or password', 5));
      console.error('Wrong username or password');
    }
  };

  useEffect(() => {
    try {
      dispatch(initializeBlogs());
    } catch (error) {
      dispatch(showError('Failed to fetch blogs from the server', 5));
      console.error('Failed to fetch blogs from the server');
    }
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');

    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      dispatch(loginAs(loggedInUser));
      blogService.setToken(loggedInUser.token);
    }
  }, []);

  useEffect(() => {
    try {
      dispatch(initializeUsers());
    } catch (error) {
      dispatch(showError('Failed to get user data'));
      console.error(error);
    }
  }, []);

  const divSpacing = {
    marginTop: 8
  };

  if (user === null) {
    return (
      <Container>
        <h2>Please login to the app</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div style={divSpacing}>
            <TextField
              id="username"
              label="username"
              value={username}
              name="username"
              autoComplete="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div style={divSpacing}>
            <TextField
              id="password"
              label="password"
              value={password}
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <div style={divSpacing}>
            <Button
              id="login-button"
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <h1>Blogs App</h1>
      <Notification />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersList />} />
        <Route
          path="/users/:id"
          element={<User userToDisplay={userToDisplay} />}
        />
        <Route
          path="/blogs/:id"
          element={<BlogDetails blogToDisplay={blogToDisplay} />}
        />
      </Routes>
    </Container>
  );
};

export default App;
