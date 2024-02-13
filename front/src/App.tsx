import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProfilePage } from './containers/ProfilePage';

function App() {
  return (
    <>
      <ProfilePage />
      <ToastContainer toastClassName="notifications-container" />
    </>
  );
}

export default App;
