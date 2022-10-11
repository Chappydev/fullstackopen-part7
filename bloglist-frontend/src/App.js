import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isError, setIsError] = useState(false);

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
      setIsError(false);
      setNotificationMessage(`Successfully logged in user ${user.name}`);
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
    } catch (exception) {
      setIsError(true);
      setNotificationMessage('Wrong username or password');
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
      console.error('Wrong username or password');
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();

    window.localStorage.removeItem('loggedInUser');
    setUser(null);
    setIsError(false);
    setNotificationMessage('Successfully logged out');
    setTimeout(() => {
      setNotificationMessage('');
    }, 5000);
  };

  const addBlog = async (blogObj) => {
    newBlogFormRef.current.toggleVisibility();

    try {
      const blog = await blogService.addBlog(blogObj);
      setBlogs(blogs.concat(blog));
      setIsError(false);
      setNotificationMessage(
        `The new blog "${blog.title}" by ${
          blog.author || 'author undefined'
        } was added`
      );
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
    } catch (error) {
      setIsError(true);
      setNotificationMessage('Failed to add blog');
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
      console.error(error.message);
    }
  };

  const addLike = async (blog) => {
    try {
      const updatedBlog = await blogService.updateBlog(blog);
      setBlogs(blogs.map((e) => (e.id === blog.id ? updatedBlog : e)));
      setIsError(false);
      setNotificationMessage(
        `${updatedBlog.title} now has ${updatedBlog.likes} likes`
      );
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
    } catch (error) {
      setIsError(true);
      setNotificationMessage('Failed to update likes');
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
      console.error(error.message);
    }
  };

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog);
      setBlogs(blogs.filter((e) => e.id !== blog.id));
      setIsError(false);
      setNotificationMessage(`${blog.title} was successfully removed`);
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
    } catch (error) {
      setIsError(true);
      setNotificationMessage('Failed to remove blog');
      setTimeout(() => {
        setNotificationMessage('');
      }, 5000);
      console.error(error.message);
    }
  };

  useEffect(() => {
    const getAndSetBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        setIsError(true);
        setNotificationMessage('Failed to fetch blogs from the server');
        setTimeout(() => {
          setNotificationMessage('');
        }, 5000);
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
        <Notification isError={isError} message={notificationMessage} />
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
      <Notification isError={isError} message={notificationMessage} />
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
