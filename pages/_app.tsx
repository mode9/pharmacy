import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider } from "styled-components";
import {theme} from "../styles/theme";
import {GlobalStyle} from "../styles/global-styles";
import Head from "next/head";



declare global {
  interface Window {
    naver: any,
  }
}

function MyApp({ Component, pageProps }: AppProps) {
    // const [queryClient] = React.useState(() => new QueryClient())

    return (
        <>
            <Head>
                <title>MEDI-LIVE</title>
                <meta name='viewport' content='initial-scale=1, viewport-fit=cover' />
            </Head>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Component {...pageProps} />
        </ThemeProvider>
        </>
      )
}
export default MyApp
