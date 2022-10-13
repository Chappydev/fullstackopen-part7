import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';

const NewBlogForm = ({ addBlog, onChangeMaker }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = (e) => {
    e.preventDefault();

    addBlog({
      title,
      author,
      url
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  const divSpacing = {
    marginTop: 8
  };

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div style={divSpacing}>
          <TextField
            label="Title"
            value={title}
            name="title"
            onChange={onChangeMaker(setTitle)}
          />
        </div>
        <div style={divSpacing}>
          <TextField
            label="Author"
            value={author}
            name="author"
            onChange={onChangeMaker(setAuthor)}
          />
        </div>
        <div style={divSpacing}>
          <TextField
            label="Url"
            value={url}
            name="url"
            onChange={onChangeMaker(setUrl)}
          />
        </div>
        <div style={divSpacing}>
          <Button id="submit-note" variant="contained" type="submit">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

NewBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  onChangeMaker: PropTypes.func.isRequired
};

export default NewBlogForm;
