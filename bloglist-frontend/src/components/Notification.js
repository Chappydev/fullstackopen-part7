import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification.isShown) {
    return null;
  }

  if (notification.isError) {
    return <Alert severity="error">{notification.message}</Alert>;
  }
  return <Alert severity="success">{notification.message}</Alert>;
};

export default Notification;
