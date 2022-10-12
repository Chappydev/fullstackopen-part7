const Comments = ({ blog }) => {
  if (blog.comments.length === 0 || !blog.comments) {
    return <div>This blog currently has no comments</div>;
  }

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment, index) => {
          return <li key={index}>{comment}</li>;
        })}
      </ul>
    </div>
  );
};

export default Comments;
