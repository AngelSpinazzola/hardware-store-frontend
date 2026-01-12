import { ToastContainerProps } from 'react-toastify';

export const toastConfig: ToastContainerProps = {
  position: window.innerWidth >= 768 ? 'top-right' : 'top-center',
  autoClose: 2000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'colored',
  icon: false,
  style: {
    marginTop: window.innerWidth >= 768 ? '70px' : '60px',
  },
};
