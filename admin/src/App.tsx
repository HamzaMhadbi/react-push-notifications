import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { NotifierPage } from './containers/NotifierPage';

function App() {
  return (
    <>
      <NotifierPage />
      <ToastContainer toastClassName="toaster-container" />
    </>
  );
}

export default App;
