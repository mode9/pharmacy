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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@100;300;400;500;700&display=swap"
                    rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet" />
            </Head>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Component {...pageProps} />
        </ThemeProvider>
        </>
      )
}
export default MyApp
