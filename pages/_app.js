import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Common/Navbar';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Common/Loader";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '60px' }}>
        {loading && <Loader />}
        <Component {...pageProps} />
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}
