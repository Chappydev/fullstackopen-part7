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
    <nav className="navbar">
      <Link to="/">Blogs</Link>
      <Link to="/users">Users</Link>
      <p>
        {user.name} is logged in <button onClick={handleLogout}>Logout</button>
      </p>
    </nav>
  );
};

export default Navbar;
