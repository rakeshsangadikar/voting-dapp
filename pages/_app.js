import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar/navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '60px' }}>
        <Component {...pageProps} />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
