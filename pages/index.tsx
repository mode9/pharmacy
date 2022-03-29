import React from "react";
import styled from "styled-components";

import BottomPanel from "../components/bottomPanel";
import MapComponent from "../components/map";
import Sidebar from "../components/sidebar";

import {HolidayAPIResult, PharmacyAPIResult, PharmacyData} from "../core/types";
import reduxWrapper from "../core/store";
import {filterChanged, receivePharmacyData} from "../core/reducers/pharmacies";
import {isHoliday} from "../core/utils";


export const getServerSideProps = reduxWrapper.getServerSideProps(store => async () => {
    const {NAVER_KEY, AUTH_KEY} = process.env;
    const options = {headers: {Authorization: AUTH_KEY}};
    // @ts-ignore
    const pharmacyAPIRessult: PharmacyAPIResult = await fetch('http://localhost:3000/api/pharmacies', options)
        .then(res => res.json());
    // @ts-ignore
    const holidayAPIResult: HolidayAPIResult = await fetch("http://localhost:3000/api/holidays", options)
        .then(res => res.json());
    store.dispatch(receivePharmacyData(pharmacyAPIRessult.data));
    store.dispatch(filterChanged({
        isHoliday: isHoliday(holidayAPIResult.data),
        bounds: null,
        showClosed: true,
    }));
    return { props: { NAVER_KEY } }
});

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

// const Wrapper = styled('div', ({$theme}) => ({
//     width: '100%',
//     height: '100%',
//     backgroundColor: $theme.colors.backgroundPrimary,
//     display: 'flex',
//     flexDirection: 'column'
// }))

const Header = styled.div`
  width: 100%;
  min-height: 60px;
  max-height: 200px;
  background: #fff;
  border-bottom: 1px solid #E2E2E2;
`

// const Nav = (props: any) => {
//     return (
//         <nav
//             className={css({
//                 display: 'block',
//                 [theme.mediaQuery.large]: {
//                     display: 'none'
//                 }
//             })}
//         >
//             <AppNavBar
//                 title="MEDI-LIVE"
//                 mainItems={[
//                     {
//                         icon: Alert,
//                         label: "INFO"
//                     },
//                 ]}
//             />
//         </nav>
//     )
// }

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
`;


const Content = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`;

type HomeSSRProps = {
    data: PharmacyData[];
    NAVER_KEY?: string;
    isHoliday: boolean;
}


export default function Home (props: HomeSSRProps): JSX.Element {
    const { NAVER_KEY } = props;

    return (
        <Wrapper>
            {/*{loading && <ProgressLoaderComponent value={value} />}*/}
            <BottomPanel />
            {/*<Header />*/}
            <Main>
                <Sidebar />
                <Content >
                    {/*<Nav />*/}
                    <MapComponent naverKey={NAVER_KEY} filterInBounds={true} disableClosed={true} />
                </Content>
            </Main>
        </Wrapper>
    )
}
