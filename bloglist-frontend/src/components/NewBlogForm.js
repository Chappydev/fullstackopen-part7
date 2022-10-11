import { useState } from 'react';
import PropTypes from 'prop-types';

const NewBlogForm = ({
  addBlog,
  onChangeMaker
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = async e => {
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

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleCreateBlog}>
          title:
        <input
          className='title-input'
          type="text"
          value={title}
          name="title"
          onChange={onChangeMaker(setTitle)}
        />
          author:
        <input
          className='author-input'
          type="text"
          value={author}
          name="author"
          onChange={onChangeMaker(setAuthor)}
        />
          url:
        <input
          className='url-input'
          type="text"
          value={url}
          name="url"
          onChange={onChangeMaker(setUrl)}
        />
        <button id="submit-note" type="submit">Create</button>
      </form>
    </div>
  );
};

NewBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  onChangeMaker: PropTypes.func.isRequired
};

export default NewBlogForm;