import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addComment,
  incrementLikes,
  removeBlog
} from '../reducers/blogReducer';
import { showError, showNotification } from '../reducers/notificationReducer';
import Comments from './Comments';

const BlogDetails = ({ blogToDisplay }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const handleLike = (e) => {
    e.preventDefault();

    try {
      dispatch(incrementLikes(blogToDisplay));
      dispatch(
        showNotification(
          `${blogToDisplay.title} now has ${blogToDisplay.likes + 1} likes`,
          5
        )
      );
    } catch (error) {
      dispatch(showError('Failed to update likes', 5));
      console.error(error.message);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();

    const confirmationMessage = `Are you sure you want to remove ${blogToDisplay.title} by ${blogToDisplay.author}?`;

    if (window.confirm(confirmationMessage)) {
      try {
        dispatch(removeBlog(blogToDisplay));
        navigate('/');
        dispatch(
          showNotification(`${blogToDisplay.title} was successfully removed`, 5)
        );
      } catch (error) {
        dispatch(showError('Failed to remove blog', 5));
        console.error(error.message);
      }
    }
  };

  const handleComment = (e) => {
    e.preventDefault();

    try {
      dispatch(addComment(blogToDisplay, comment));
      setComment('');
      dispatch(showNotification('Comment added!'));
    } catch (error) {
      dispatch(showError('Failed to add comment'));
      console.error(error);
    }
  };

  if (!blogToDisplay) {
    return null;
  }

  return (
    <div>
      <h2>
        &quot;{blogToDisplay.title}&quot; by {blogToDisplay.author}
      </h2>
      <p>
        <a href={blogToDisplay.url} target="_blank" rel="noreferrer">
          {blogToDisplay.url}
        </a>
      </p>
      <p>
        {blogToDisplay.likes} likes
        <button onClick={handleLike}>like</button>
      </p>
      <p>Added by {blogToDisplay.user.name}</p>
      {user.username === blogToDisplay.user.username && (
        <button onClick={handleRemove}>Remove</button>
      )}
      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Add Comment</button>
      </form>
      <Comments blog={blogToDisplay} />
    </div>
  );
};

export default BlogDetails;
