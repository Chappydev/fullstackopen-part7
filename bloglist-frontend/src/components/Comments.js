const Comments = ({ blog }) => {
  if (blog.comments.length === 0 || !blog.comments) {
    return <div>This blog currently has no comments</div>;
  }

  return (
    <ul>
      {blog.comments.map((comment, index) => {
        return <li key={index}>{comment}</li>;
      })}
    </ul>
  );
};

export default Comments;
