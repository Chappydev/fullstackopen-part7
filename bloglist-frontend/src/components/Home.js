import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, removeBlog } from '../reducers/blogReducer';
import { showError, showNotification } from '../reducers/notificationReducer';
import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import Togglable from './Togglable';

const Home = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const onChangeMaker =
    (callback) =>
    ({ target }) =>
      callback(target.value);
  const newBlogFormRef = useRef();

  const addBlog = async (blogObj) => {
    newBlogFormRef.current.toggleVisibility();

    try {
      dispatch(createBlog(blogObj));
      dispatch(
        showNotification(
          `The new blog "${blogObj.title}" by ${
            blogObj.author || 'author undefined'
          } was added`,
          5
        )
      );
    } catch (error) {
      dispatch(showError('Failed to add blog', 5));
      console.error(error.message);
    }
  };

  const deleteBlog = async (blog) => {
    try {
      dispatch(removeBlog(blog));
      dispatch(showNotification(`${blog.title} was successfully removed`, 5));
    } catch (error) {
      dispatch(showError('Failed to remove blog', 5));
      console.error(error.message);
    }
  };

  return (
    <div>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} />
        ))}
      <Togglable buttonLabel="New Note" ref={newBlogFormRef}>
        <NewBlogForm addBlog={addBlog} onChangeMaker={onChangeMaker} />
      </Togglable>
    </div>
  );
};

export default Home;
