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

  if (user === null) {
    return (
      <div>
        <h2>Please login to the app</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          Username
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
          Password
          <input
            id="password"
            type="text"
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <button id="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default App;
