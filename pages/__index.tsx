import {styled, useStyletron, withStyle} from "baseui";
import {useEffect, useState} from "react";
import * as React from "react";
import {StyletronComponent} from "styletron-react";

interface HomeProps {
    props: {
        kakaoKey: string|undefined;
    }
}

export async function getStaticProps(context: { locales: any, locale: any, defaultLocale: any }): Promise<HomeProps> {
    return {
        props: {
            kakaoKey: process.env.KAKAO_KEY,
        }, // will be passed to the page component as props
    }
}

// @ts-ignore
const SelectableCard: StyletronComponent<any> = styled('div', ({$theme}) => ({
    backgroundColor: $theme.colors.backgroundPrimary,
    width: '220px',
    height: '220px',
    boxShadow: $theme.lighting.shadow500
}))

const FlexBox: StyletronComponent<any> = styled('div', ({$theme}) => ({
    display: 'flex',
}))

const ColumnFlexBox: StyletronComponent<any> = styled('div', ({$theme}) => ({
    display: 'flex',
    flexDirection: 'column',
}))

const Wrapper = withStyle(FlexBox, ({$theme}) => ({
    backgroundColor: $theme.colors.backgroundPrimary,
    flex: 1,
    width: '100%',
    height: '100%',
}))

const Container = withStyle(FlexBox, ({$theme}) => ({
    backgroundColor: $theme.colors.backgroundPrimary,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}))

export default function Home (props: HomeProps['props']) {
    const [css, theme] = useStyletron();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // let script = document.createElement('script');
        // script.type = "text/javascript";
        // script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${props.kakaoKey}&libraries=services,clusterer,drawing`;
        // script.async = true;
        //
        // document.body.appendChild(script);
        // script.addEventListener("load", () => setLoading(false));
        // script.addEventListener("error", () => alert('error'));
    }, []);

    return (
        <Wrapper>
            <Container>
                <SelectableCard />
                <SelectableCard />
            {/*{loading && <StyledSpinnerNext />}*/}
            </Container>
        </Wrapper>
    )
}
