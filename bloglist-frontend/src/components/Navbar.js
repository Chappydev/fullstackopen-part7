import { AppBar, Button, Toolbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { showNotification } from '../reducers/notificationReducer';
import { logoutCurrentUser } from '../reducers/userReducer';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(logoutCurrentUser());
    dispatch(showNotification('Successfully logged out', 5));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <div style={{ marginLeft: 'auto ' }}>
          {user.name} is logged in{' '}
          <Button color="inherit" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
