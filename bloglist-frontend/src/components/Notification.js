import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification.isShown) {
    return null;
  }

  if (notification.isError) {
    return <div className="error">{notification.message}</div>;
  }
  return <div className="success">{notification.message}</div>;
};

export default Notification;
