const User = ({ userToDisplay }) => {
  if (!userToDisplay) {
    return null;
  }

  return (
    <>
      <h2>{userToDisplay.name}</h2>
      <h3>User&apos;s Blogs</h3>
      <ul>
        {userToDisplay.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </>
  );
};

export default User;
