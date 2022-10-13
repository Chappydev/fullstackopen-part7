import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const users = useSelector((state) => state.users);

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Users</TableCell>
              <TableCell>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => {
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <Link to={`/users/${u.id}`}>{u.name}</Link>
                  </TableCell>
                  <TableCell>{u.blogs.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsersList;
