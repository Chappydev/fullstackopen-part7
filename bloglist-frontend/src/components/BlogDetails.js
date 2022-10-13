import { Button, Card, CardContent, TextField } from '@mui/material';
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

  const divSpacing = {
    marginTop: 8
  };

  if (!blogToDisplay) {
    return null;
  }

  return (
    <div>
      <Card raised={true}>
        <CardContent>
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
            <Button color="secondary" onClick={handleLike}>
              like
            </Button>
          </p>
          <p>Added by {blogToDisplay.user.name}</p>
          {user.username === blogToDisplay.user.username && (
            <Button variant="outlined" color="error" onClick={handleRemove}>
              Remove
            </Button>
          )}
        </CardContent>
      </Card>
      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <div style={divSpacing}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div style={divSpacing}>
          <Button variant="contained" color="primary" type="submit">
            Add Comment
          </Button>
        </div>
      </form>
      <Comments blog={blogToDisplay} />
    </div>
  );
};

export default BlogDetails;
