import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
    },
    setBlogs(state, action) {
      return [...action.payload];
    }
  }
});

export const { appendBlog, setBlogs, updateBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObj) => {
  return async (dispatch) => {
    const newBlog = await blogService.addBlog(blogObj);
    dispatch(appendBlog(newBlog));
  };
};

export const incrementLikes = (blogObj) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.updateBlog({
      ...blogObj,
      likes: blogObj.likes + 1
    });
    dispatch(updateBlog(updatedBlog));
  };
};

export default blogSlice.reducer;
