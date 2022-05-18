import React from "react";
import styled from "styled-components";
import ReactGA from "react-ga";

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
    const isProduction = process.env.NODE_ENV === 'production';
    store.dispatch(receivePharmacyData(pharmacyAPIRessult.data));
    store.dispatch(filterChanged({
        isHoliday: isHoliday(holidayAPIResult.data),
        bounds: null,
        showClosed: true,
    }));
    return { props: { NAVER_KEY, isProduction } }
});

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

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
    NAVER_KEY?: string;
    isProduction: boolean;
}


export default function Home (props: HomeSSRProps): JSX.Element {
    const { NAVER_KEY, isProduction } = props;

    React.useEffect(() => {
        if (isProduction) {
            ReactGA.initialize('G-GVVZ7B7BY7');
            ReactGA.pageview(window.location.pathname + window.location.search);
        }
    }, [isProduction])

    return (
        <Wrapper>
            <BottomPanel />
            <Main>
                <Sidebar />
                <Content >
                    <MapComponent naverKey={NAVER_KEY} filterInBounds={true} disableClosed={true} />
                </Content>
            </Main>
        </Wrapper>
    )
}
