import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementLikes } from '../reducers/blogReducer';
import { showError, showNotification } from '../reducers/notificationReducer';

const Blog = ({ blog, deleteBlog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = (e) => {
    e.preventDefault();

    try {
      dispatch(incrementLikes(blog));
      dispatch(
        showNotification(`${blog.title} now has ${blog.likes + 1} likes`, 5)
      );
    } catch (error) {
      dispatch(showError('Failed to update likes', 5));
      console.error(error.message);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();

    const confirmationMessage = `Are you sure you want to remove ${blog.title} by ${blog.author}?`;

    if (window.confirm(confirmationMessage)) {
      deleteBlog(blog);
    }
  };

  if (visible) {
    return (
      <div className="blog-container">
        <p>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>Hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          likes: {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>Added by {blog.user.name}</p>
        {user.username === blog.user.username && (
          <button onClick={handleRemove}>Remove</button>
        )}
      </div>
    );
  }

  return (
    <div className="blog-container">
      <p>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>View</button>
      </p>
    </div>
  );
};

export default Blog;
