// import '../styles/globals.css'
import 'antd/dist/antd.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app'
import {isUndefined} from "util";

declare global {
  interface Window {
    kakaoMap: any,
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
