import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
  test('calls "addBlog" prop when new blog is created', async () => {
    const addBlog = jest.fn();
    const onChangeMaker = (callback) => ({ target }) => callback(target.value);

    const { container } = render(
      <NewBlogForm addBlog={addBlog} onChangeMaker={onChangeMaker} />
    );

    const user = userEvent.setup();
    const titleInput = container.querySelector('.title-input');
    const authorInput = container.querySelector('.author-input');
    const urlInput = container.querySelector('.url-input');
    const submitButton = screen.getByText('Create');
    await user.type(titleInput, 'Title...');
    await user.type(authorInput, 'Author...');
    await user.type(urlInput, 'Url...');
    await user.click(submitButton);

    expect(addBlog.mock.calls).toHaveLength(1);
    expect(addBlog.mock.calls[0][0]).toEqual({
      title: 'Title...',
      author: 'Author...',
      url: 'Url...'
    });
  });
});