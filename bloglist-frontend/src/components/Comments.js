import { List, ListItem, ListItemText } from '@mui/material';

const Comments = ({ blog }) => {
  if (blog.comments.length === 0 || !blog.comments) {
    return <div>This blog currently has no comments</div>;
  }

  return (
    <List>
      {blog.comments.map((comment, index) => {
        return (
          <ListItem key={index}>
            <ListItemText secondary={comment} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default Comments;
