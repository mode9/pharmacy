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
    const { data, NAVER_KEY, isHoliday } = props;
    const pharmacies: Pharmacy[] = data.map(row => new Pharmacy(row));
    const mapRef = React.useRef<FooType>(null);
    const findNearestButtonHidden = useState(false);

    useEffect(() => {
        if (!mapRef || !mapRef.current) return;

        // const isHoliday = data.meta.holiday;
        // const pharmacies = data.data;

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
    // function findPharmacyInBounds(kakao: any, map: any) {
    //     // TODO:
    //     //  2. 영업 중/중료 flag 추가
    //     //  3. 오늘 공휴일인지 확인
    //     let markers: typeof kakao.maps.Marker[] = [];
    //     const { data } = this.state;
    //     const bounds = map.getBounds();
    //     const centerCoords = map.getCenter();
    //     const centerLng = centerCoords.getLng();
    //     const centerLat = centerCoords.getLat();
    //     const compareDistance = this.distance;
    //     this.clearMarkers();
    //     let list = data.filter((pharmacy: PharmacyItemType) => {
    //         const coords = new kakao.maps.LatLng(pharmacy.y, pharmacy.x);
    //         return bounds.contain(coords);
    //     }).sort((a: PharmacyItemType, b: PharmacyItemType): number => {
    //         const aDistance = compareDistance(centerLat, centerLng, a.y, a.x);
    //         const bDistance = compareDistance(centerLat, centerLng, b.y, b.x);
    //         // const aOpen = a.isOpen(this.state.holiday) ? -10000 : 0;
    //         // const bOpen = b.isOpen(this.state.holiday) ? -10000 : 0;
    //         return (aDistance) - (bDistance) ;
    //     });
    //
    //     if (!this.state.displayClosed) {
    //         list = list.filter((pharmacy: PharmacyItemType) => {
    //             return pharmacy.isOpen(this.state.holiday);
    //         })
    //     }
    //     for (let i=0; i < list.length; i++) {
    //         let pharmacy: PharmacyItemType = list[i];
    //         const coords = new kakao.maps.LatLng(pharmacy.y, pharmacy.x);
    //         let marker = new kakao.maps.Marker({
    //             map: map,
    //             position: coords,
    //             opacity: pharmacy.isOpen(this.state.holiday) ? 1 : .5,
    //         });
    //         pharmacy.marker = marker;
    //         // kakao.maps.event.addListener(marker, 'mouseover', () => {
    //         //
    //         // })
    //         markers.push(marker);
    //     }
    //     this.setState({markers});
    //     return list;
    // }


        //         function fetchCallback (response: PharmacyAPIResult) {
//             cls.setState({
//                 data: response.data.map(row => new Pharmacy(row)),
//                 holiday: response.meta.holiday || false,
//             });
//             const list = cls.findPharmacyInBounds(kakao, map);
//             cls.setState({listLoaded: true, list});
//         }
    }, [])


    return (
        <Wrapper>
            {/*{loading && <ProgressLoaderComponent value={value} />}*/}
            <BottomPanel />
            {/*<Header />*/}
            <Main>
                <Sidebar id="sidebar" />
                <Content >
                    {/*<Nav />*/}
                    <MapComponent data={pharmacies} naverKey={NAVER_KEY} filterInBounds={true} disableClosed={true} isHoliday={isHoliday} ref={mapRef} />
                </Content>
            </Main>
        </Wrapper>
    )


}
