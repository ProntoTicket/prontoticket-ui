import type { AppProps } from 'next/app';
import '../styles/style.css'; // Make sure the path is correct based on your directory structure

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
