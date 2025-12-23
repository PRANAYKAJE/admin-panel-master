import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import { GlobalProvider } from '../context/GlobalContext';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* These tags belong here so Next.js can manage them per-page */}
        <title>Kirana Hub Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Kirana Hub Admin Panel" />
      </Head>
      <GlobalProvider>
        <ThemeProvider>
          <Component {...pageProps} />
          <Toaster position="top-right" />
        </ThemeProvider>
      </GlobalProvider>
    </>
  );
}

export default MyApp;