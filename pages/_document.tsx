import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

    render() {
        const kakaoKey = "3b475a194f92641ce4f9a013230e1774";
        return (
            <Html lang="ko">
                <Head>
                     <script
                        type="text/javascript"
                        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services,clusterer,drawing`}
                      />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}