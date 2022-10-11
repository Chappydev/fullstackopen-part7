import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const addBlog = async (blogObj) => {
  const config = {
    headers: { Authorization: token }
  };

  try {
    const response = await axios.post(baseUrl, blogObj, config);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

const updateBlog = async (updatedBlog) => {
  try {
    const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

const deleteBlog = async (blogToDelete) => {
  const config = {
    headers: { Authorization: token }
  };

  try {
    await axios.delete(`${baseUrl}/${blogToDelete.id}`, config);
  } catch (error) {
    console.error(error.message);
  }
};

export default { getAll, setToken, addBlog, updateBlog, deleteBlog };