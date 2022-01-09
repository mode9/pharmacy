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
    const [center, setCenter] = useState(null);
    const { data, NAVER_KEY, isHoliday } = props;
    const pharmacies: Pharmacy[] = data.map(row => new Pharmacy(row));
    const mapRef = React.useRef<FooType>(null);
    const findNearestButtonHidden = useState(false);

    function handleInitialize(pharmacies: Pharmacy[], center: any) {
        console.log(pharmacies)
        setPharmsInBounds(pharmacies);
        setCenter(center);
    }

    return (
        <Wrapper>
            {/*{loading && <ProgressLoaderComponent value={value} />}*/}
            <BottomPanel data={pharmsInBounds} center={center} isHoliday={isHoliday} />
            {/*<Header />*/}
            <Main>
                <Sidebar id="sidebar" />
                <Content >
                    {/*<Nav />*/}
                    <MapComponent data={pharmacies} naverKey={NAVER_KEY} filterInBounds={true} disableClosed={true} isHoliday={isHoliday} ref={mapRef} onIdle={handleInitialize} />
                </Content>
            </Main>
        </Wrapper>
    )


}
