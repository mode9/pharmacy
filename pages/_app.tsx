import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider } from "styled-components";
import {theme} from "../styles/theme";
import {GlobalStyle} from "../styles/global-styles";



declare global {
  interface Window {
    naver: any,
  }
}

function MyApp({ Component, pageProps }: AppProps) {
    // const [queryClient] = React.useState(() => new QueryClient())

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Component {...pageProps} />
        </ThemeProvider>
      )
}
export default MyApp
