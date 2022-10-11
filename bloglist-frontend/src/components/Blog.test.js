import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const addLike = jest.fn();
  const deleteBlog = jest.fn();
  const user = {
    name: 'Name...',
    username: 'username',
    id: 12345
  };
  const blog = {
    title: 'Title...',
    author: 'Author...',
    url: 'www.website...',
    likes: 0,
    user
  };

  beforeEach(() => {
    render(
      <Blog addLike={addLike} deleteBlog={deleteBlog} user={user} blog={blog} />
    );
  });

  test('renders only the title and author by default', () => {
    const url = screen.queryByText(blog.url);
    const likes = screen.queryByText(`likes: ${blog.likes} `);
    expect(url).toBeNull();
    expect(likes).toBeNull();

    const titleAndAuthor = screen.getByText('Title... Author...');
    expect(titleAndAuthor).toBeDefined();
  });

  test('shows url and # of likes after view button is clicked', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('View');
    await user.click(viewButton);

    const url = screen.getByText(blog.url);
    const likes = screen.queryByText(`likes: ${blog.likes} `);
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });

  test('calls the "addLike" prop after clicking like button', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('View');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);
    expect(addLike.mock.calls).toHaveLength(2);
  });
});