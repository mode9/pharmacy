import '../styles/globals.css';
// import 'css'
import type { AppProps } from 'next/app'
import React from 'react';
import {Provider as StyletronProvider} from "styletron-react";
import {LightTheme, BaseProvider} from 'baseui';
import {styletron} from "../core/styletron";
import {QueryClient, QueryClientProvider, Hydrate} from "react-query";



declare global {
  interface Window {
      kakaoMap: any,
      google: any,
  }
}

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient())

    return (
        <StyletronProvider value={styletron}>
            <BaseProvider theme={LightTheme}>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <Component {...pageProps} />
                    </Hydrate>
                </QueryClientProvider>
            </BaseProvider>
        </StyletronProvider>
      )
}
export default MyApp
