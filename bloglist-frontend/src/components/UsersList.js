import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../reducers/notificationReducer';
import { initializeUsers } from '../reducers/usersReducer';

const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  useEffect(() => {
    try {
      dispatch(initializeUsers());
    } catch (error) {
      dispatch(setError('Failed to get user data'));
      console.error(error);
    }
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            return (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
