import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  return (
    <div className="blog-container">
      <p>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </p>
    </div>
  );
};

export default Blog;
