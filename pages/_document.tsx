import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

    render() {
        const kakaoKey = process.env.KAKAO_KEY;
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