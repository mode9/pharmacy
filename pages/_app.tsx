import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider } from "styled-components";
import {theme} from "../styles/theme";
import {GlobalStyle} from "../styles/global-styles";  // @ts-ignore
import Head from "next/head";

import reduxWrapper from "../core/store";

declare global {
  interface Window {
    naver: any,
  }
}

const WrappedApp = ({Component, pageProps}: AppProps) => {
    return (
        <>
            <Head>
                <title>심야약국</title>
                <meta name='viewport' content='initial-scale=1, viewport-fit=cover' />
                <meta name='description' content='휴일이나 심야에 영업 중인 약국을 보여드려요' />
                <meta name='keywords' content='심야약국,문 연 약국,주말약국,주말 약국,심야 약국,약국' />
                <meta property='og:title' content='심야약국' />
                <meta property='og:url' content='https://getdrug.co' />
                <meta property='og:description' content='휴일이나 심야에 영업 중인 약국을 보여드려요' />
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
export default reduxWrapper.withRedux(WrappedApp);
