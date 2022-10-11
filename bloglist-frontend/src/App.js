import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { showError, showNotification } from './reducers/notificationReducer';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const onChangeMaker =
    (callback) =>
    ({ target }) =>
      callback(target.value);
  const newBlogFormRef = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password
      });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
      dispatch(showNotification(`Successfully logged in user ${user.name}`, 5));
    } catch (exception) {
      dispatch(showError('Wrong username or password', 5));
      console.error('Wrong username or password');
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();

    window.localStorage.removeItem('loggedInUser');
    setUser(null);
    dispatch(showNotification('Successfully logged out', 5));
  };

  const addBlog = async (blogObj) => {
    newBlogFormRef.current.toggleVisibility();

    try {
      const blog = await blogService.addBlog(blogObj);
      setBlogs(blogs.concat(blog));
      dispatch(
        showNotification(
          `The new blog "${blog.title}" by ${
            blog.author || 'author undefined'
          } was added`,
          5
        )
      );
    } catch (error) {
      dispatch(showError('Failed to add blog', 5));
      console.error(error.message);
    }
  };

  const addLike = async (blog) => {
    try {
      const updatedBlog = await blogService.updateBlog(blog);
      setBlogs(blogs.map((e) => (e.id === blog.id ? updatedBlog : e)));
      dispatch(
        showNotification(
          `${updatedBlog.title} now has ${updatedBlog.likes} likes`,
          5
        )
      );
    } catch (error) {
      dispatch(showError('Failed to update likes', 5));
      console.error(error.message);
    }
  };

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog);
      setBlogs(blogs.filter((e) => e.id !== blog.id));
      dispatch(showNotification(`${blog.title} was successfully removed`, 5));
    } catch (error) {
      dispatch(showError('Failed to remove blog', 5));
      console.error(error.message);
    }
  };

  useEffect(() => {
    const getAndSetBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        dispatch(showError('Failed to fetch blogs from the server', 5));
        console.error('Failed to fetch blogs from the server');
      }
    };
    getAndSetBlogs();
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');

    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      setUser(loggedInUser);
      blogService.setToken(loggedInUser.token);
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
      <h2>Blogs</h2>
      <Notification />
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>Logout</button>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            user={user}
            blog={blog}
            deleteBlog={deleteBlog}
            addLike={addLike}
          />
        ))}
      <Togglable buttonLabel="New Note" ref={newBlogFormRef}>
        <NewBlogForm addBlog={addBlog} onChangeMaker={onChangeMaker} />
      </Togglable>
    </div>
  );
};

export default App;
