import Head from 'next/head'; // Import this
import { ThemeProvider } from '../context/ThemeContext';
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
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;