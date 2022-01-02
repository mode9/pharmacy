import React, {useEffect, useState} from "react";
import styled from "styled-components";

import BottomPanel from "../components/bottomPanel";
import MapComponent from "../components/map";
import Pharmacy from "../core/pharmacies";
import {PharmacyData} from "../core/types";

export async function getServerSideProps () {
    const {NAVER_KEY} = process.env;
    const { data, meta } = await fetch('http://localhost:3000/api/pharmacies')
        .then(res => res.json());
    return { props: { data, NAVER_KEY, isHoliday: meta.holiday } }
}

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

const Sidebar = styled.div`
  width: 500px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #000;
  display: none;
  @media screen and (min-width: 1136px) {
    display: block;
  }
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

type FooType = {
    hasModuleLoaded: () => boolean;
    getPharmaciesInBounds: () => Pharmacy[],
}

export default function Home (props: HomeSSRProps): JSX.Element {
    const [pharmsInBounds, setPharmsInBounds] = useState<Pharmacy[]>([]);
    const { data, NAVER_KEY, isHoliday } = props;
    const pharmacies: Pharmacy[] = data.map(row => new Pharmacy(row));
    const mapRef = React.useRef<FooType>(null);
    const findNearestButtonHidden = useState(false);

    function distance (lat1: number, lng1: number, lat2:number, lng2:number): number {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lng1 - lng2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }

    function handleInitialize(pharmacies: Pharmacy[]) {
        console.log(pharmacies)
        setPharmsInBounds(pharmacies);
    }


    return (
        <Wrapper>
            {/*{loading && <ProgressLoaderComponent value={value} />}*/}
            <BottomPanel data={pharmsInBounds} />
            {/*<Header />*/}
            <Main>
                <Sidebar id="sidebar" />
                <Content >
                    {/*<Nav />*/}
                    <MapComponent data={pharmacies} naverKey={NAVER_KEY} filterInBounds={true} disableClosed={true} isHoliday={isHoliday} ref={mapRef} onLoaded={handleInitialize} />
                </Content>
            </Main>
        </Wrapper>
    )


}
