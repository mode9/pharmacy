// import React, {Component} from 'react';
// import {Layout, Menu, Typography, Select, Switch, Row, Col, Dropdown, Button, Checkbox, Spin} from 'antd';
// import {FilterOutlined} from '@ant-design/icons';
//
// import PharmacyItems from "../components/items";
// import GeolocationButton from "../components/map/geolocation";
// import FindNearest from '../components/map/findNearest';
// import {PharmacyAPIResult} from './api/pharmacies';
// import {PharmacyItemType} from '../core/types';
// import Pharmacy from "../core/pharmacies";
// const { Header, Content, Sider } = Layout;
// const { Title } = Typography;
// const { Option } = Select;
//
//
// interface HomeState {
//     x: number;
//     y: number;
//     boundsChanged: boolean;
//     data: Pharmacy[];
//     list: PharmacyItemType[];
//     listLoaded: boolean;
//     markers: Array<any>;
//     map: any;
//     kakao: any;
//     holiday: boolean;
//     displayClosed: boolean;
//     findButtonDisabled: boolean
// }
//
// export default class Home extends Component<{}, HomeState> {
//     // seoul coords
//     state = {
//         x: 126.96072340180352,
//         y: 37.54425411510226,
//         boundsChanged: false,
//         data: [],
//         list: [],
//         listLoaded: false,
//         markers: [],
//         map: null,
//         kakao: null,
//         holiday: false,
//         displayClosed: false,
//         findButtonDisabled: false,
//         // initLoading: true,
//     }
//     fetchData = (callback: (data: PharmacyAPIResult) => void) => {
//         fetch(`http://localhost:3000/api/pharmacies`)
//             .then(res => res.json())
//             .then(jsonResponse => {
//                 if (jsonResponse.meta.status != 200) {
//                     console.error(jsonResponse);
//                 }
//                 callback(jsonResponse);
//             })
//     }
//     initMap(kakao: any, kakaoMap: any) {
//         const coords = new kakao.maps.LatLng(this.state.y, this.state.x); // 지도의 중심좌표
//         const options = {
//             center: coords,
//             level: 7,
//         };
//         const map = new kakao.maps.Map(kakaoMap, options);
//         // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
//         const mapTypeControl = new kakao.maps.MapTypeControl();
//         // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
//         const zoomControl = new kakao.maps.ZoomControl();
//         map.relayout();
//         map.addControl(
//             mapTypeControl,
//             kakao.maps.ControlPosition.TOPRIGHT
//         );
//         map.addControl(
//             zoomControl,
//             kakao.maps.ControlPosition.RIGHT
//         );
//         return map;
//     }
//     initFindNearestButton(kakao: any, map: any) {
//         if (kakao && map) {
//             const _this = this;
//             let newState = {
//                 boundsChanged: false,
//                 findButtonDisabled: false,
//             }
//             kakao.maps.event.addListener(map, 'bounds_changed', () => {
//                 newState.findButtonDisabled = false;
//
//                 if (!_this.state.boundsChanged) {
//                     newState.boundsChanged = true;
//                 }
//                 if (map.getLevel() > 8) {
//                     newState.findButtonDisabled = true;
//                 }
//                 _this.setState(newState);
//             })
//         }
//     }
//     clearMarkers() {
//         this.state.markers.forEach((marker: any) => {
//             marker.setMap(null);
//         })
//     }
//     distance (lat1: number, lng1: number, lat2:number, lng2:number): number {
//         var radlat1 = Math.PI * lat1 / 180;
//         var radlat2 = Math.PI * lat2 / 180;
//         var theta = lng1 - lng2;
//         var radtheta = Math.PI * theta / 180;
//         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//         dist = Math.acos(dist);
//         dist = dist * 180 / Math.PI;
//         dist = dist * 60 * 1.1515;
//         dist = dist * 1.609344;
//         return dist;
//     };
//     findPharmacyInBounds(kakao: any, map: any) {
//         // TODO:
//         //  2. 영업 중/중료 flag 추가
//         //  3. 오늘 공휴일인지 확인
//         let markers: typeof kakao.maps.Marker[] = [];
//         const { data } = this.state;
//         const bounds = map.getBounds();
//         const centerCoords = map.getCenter();
//         const centerLng = centerCoords.getLng();
//         const centerLat = centerCoords.getLat();
//         const compareDistance = this.distance;
//         this.clearMarkers();
//         let list = data.filter((pharmacy: PharmacyItemType) => {
//             const coords = new kakao.maps.LatLng(pharmacy.y, pharmacy.x);
//             return bounds.contain(coords);
//         }).sort((a: PharmacyItemType, b: PharmacyItemType): number => {
//             const aDistance = compareDistance(centerLat, centerLng, a.y, a.x);
//             const bDistance = compareDistance(centerLat, centerLng, b.y, b.x);
//             // const aOpen = a.isOpen(this.state.holiday) ? -10000 : 0;
//             // const bOpen = b.isOpen(this.state.holiday) ? -10000 : 0;
//             return (aDistance) - (bDistance) ;
//         });
//
//         if (!this.state.displayClosed) {
//             list = list.filter((pharmacy: PharmacyItemType) => {
//                 return pharmacy.isOpen(this.state.holiday);
//             })
//         }
//         for (let i=0; i < list.length; i++) {
//             let pharmacy: PharmacyItemType = list[i];
//             const coords = new kakao.maps.LatLng(pharmacy.y, pharmacy.x);
//             let marker = new kakao.maps.Marker({
//                 map: map,
//                 position: coords,
//                 opacity: pharmacy.isOpen(this.state.holiday) ? 1 : .5,
//             });
//             pharmacy.marker = marker;
//             // kakao.maps.event.addListener(marker, 'mouseover', () => {
//             //
//             // })
//             markers.push(marker);
//         }
//         this.setState({markers});
//         return list;
//     }
//     componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<HomeState>, snapshot?: any) {
//         if (prevState.displayClosed !== this.state.displayClosed) {
//             let list = this.findPharmacyInBounds(this.state.kakao, this.state.map);
//             this.setState({list, boundsChanged: false});
//         }
//     }
//
//     componentDidMount() {
//         const { kakao } = window as any;
//         const kakaoMap = document.getElementById('map');
//         const map = this.initMap(kakao, kakaoMap);
//         const cls = this;
//
//         function fetchCallback (response: PharmacyAPIResult) {
//             cls.setState({
//                 data: response.data.map(row => new Pharmacy(row)),
//                 holiday: response.meta.holiday || false,
//             });
//             const list = cls.findPharmacyInBounds(kakao, map);
//             cls.setState({listLoaded: true, list});
//         }
//         this.fetchData(fetchCallback);
//         this.initFindNearestButton(kakao, map);
//         this.setState({
//             map: map,
//             kakao: kakao,
//         });
//         window.kakaoMap = map;
//     }
//     render() {
//         const { list, boundsChanged, map, kakao, holiday, findButtonDisabled } = this.state;
//         const siderStyle = { height: '100%', backgroundColor: '#fff', boxShadow: '0 1px 6px 0 rgb(32 33 36 / 28%)' };
//         const fullHeightStyle = { height: '100%' };
//         const mapStyle = {
//             width: 'calc(100vw - 400px)',
//             height: '100vh',
//         };
//         const cls = this;
//         return (
//
//             // <Layout style={fullHeightStyle}>
//             //     {/*<Header className="header">*/}
//             //     {/*    <div className="logo" />*/}
//             //     {/*    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>*/}
//             //     {/*        <Menu.Item key="1">nav 1</Menu.Item>*/}
//             //     {/*        <Menu.Item key="2">nav 2</Menu.Item>*/}
//             //     {/*        <Menu.Item key="3">nav 3</Menu.Item>*/}
//             //     {/*    </Menu>*/}
//             //     {/*</Header>*/}
//             //         <Sider theme='light' width={400} className="site-layout-background" style={siderStyle}>
//             //             <div style={{padding: '3rem 1.5rem 0'}}>
//             //                 <Title level={4} style={{textAlign: 'center', marginBottom: '2rem'}}>MEDI-LIVE</Title>
//             //                 <Row align='middle'>
//             //                     {/*<Col span={8} offset={10}>*/}
//             //                     {/*    <Select style={{width: '100px'}} defaultValue='0'>*/}
//             //                     {/*        <Option value='0'>거리 순</Option>*/}
//             //                     {/*        <Option value='1'>이름 순</Option>*/}
//             //                     {/*    </Select>*/}
//             //                     {/*</Col>*/}
//             //                     <Col span={6}>
//             //
//             //                         <Dropdown
//             //                             trigger={['click']}
//             //                             overlay={
//             //                                 <Menu style={{borderRadius: '10px'}}>
//             //                                     <Menu.Item key={1}>
//             //                                         <Checkbox onChange={(e) => {
//             //                                             cls.setState({displayClosed: e.target.checked})
//             //                                         }}>영업시간외 약국보기</Checkbox>
//             //                                     </Menu.Item>
//             //                                 </Menu>
//             //                         }>
//             //                             <Button shape='round' icon={<FilterOutlined />}>Filters</Button>
//             //                         </Dropdown>
//             //                     </Col>
//             //                 </Row>
//             //
//             //                 <PharmacyItems list={list} holiday={holiday} loaded={this.state.listLoaded} map={map} />
//             //             </div>
//             //         </Sider>
//             //         <Content style={fullHeightStyle}>
//             //             <div id="map" style={mapStyle}>
//             //                 <FindNearest disabled={findButtonDisabled} boundsChanged={boundsChanged} event={() => {
//             //                     const newList = cls.findPharmacyInBounds(kakao, map);
//             //                     cls.setState({
//             //                         list: newList,
//             //                         boundsChanged: false,
//             //                     });
//             //                 }} />
//             //                 <GeolocationButton kakao={kakao} map={map} />
//             //             </div>
//             //         </Content>
//             // </Layout>
//         )
//     }
// }


import {styled, useStyletron} from "baseui";
import {PharmacyAPIResult} from "./api/pharmacies";
import React, {useEffect, useRef, useState} from "react";
import {ProgressBar} from "baseui/progress-bar";
import {AppNavBar} from "baseui/app-nav-bar";
import {Alert} from "baseui/icon";
import {useSpring, animated, config, a} from '@react-spring/web';
import {useDrag} from "@use-gesture/react";
import {Button} from "baseui/button";


export async function getServerSideProps () {
    const {KAKAO_KEY} = process.env;
    const data = await fetch('http://localhost:3000/api/pharmacies')
        .then(res => res.json());
    return { props: { data, KAKAO_KEY } }
}

const Wrapper = styled('div', ({$theme}) => ({
    width: '100%',
    height: '100%',
    backgroundColor: $theme.colors.backgroundPrimary,
}))

const Header = styled('header', ({$theme}) => ({
    width: '100%',
    minHeight: '60px',
    maxHeight: '200px',
    backgroundColor: $theme.colors.backgroundPrimary,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`
}))

const Nav = (props: any) => {
    const [css, theme] = useStyletron();
    return (
        <nav
            className={css({
                display: 'block',
                [theme.mediaQuery.large]: {
                    display: 'none'
                }
            })}
        >
            <AppNavBar
                title="MEDI-LIVE"
                mainItems={[
                    {
                        icon: Alert,
                        label: "INFO"
                    },
                ]}
            />
        </nav>
    )
}

const Main = styled('main', ({$theme}) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: $theme.colors.backgroundPrimary,
}))

const Sidebar = styled('section', ({$theme}) => ({
    width: '500px',
    height: '100%',
    backgroundColor: $theme.colors.backgroundPrimary,
    borderRight: `1px solid #000`,
    display: 'none',
    [$theme.mediaQuery.large]: {
        display: 'block'
    }
}))

const Content = styled('section', ({$theme}) => ({
    width: '100%',
    height: '100%',
    backgroundColor: $theme.colors.backgroundPrimary,
}))

const ProgressLoaderComponent = (props: {children?: any, value: number}) => {
    const FlexWrapper = styled('div', {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    const value: number = props.value;
    return (
        <FlexWrapper>
            <ProgressBar
                value={value}
                successValue={100}
                infinite
                showLabel
                overrides={{
                    Root: { style: {maxWidth: '500px'} }
                }}
            />
        </FlexWrapper>
    )

}

type HomeSSRProps = {
    data: PharmacyAPIResult;
    KAKAO_KEY?: string;
}

function sleep(ms: number): Promise<null> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function initMap(kakao: any, kakaoMap: any) {
    const coords = [126.96072340180352, 37.54425411510226];  // 기본 좌표
    const options = {
        center: new kakao.maps.LatLng(coords[1], coords[0]), // 지도의 중심좌표
        level: 7,
    };
    const map = new kakao.maps.Map(kakaoMap, options);
    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    const mapTypeControl = new kakao.maps.MapTypeControl();
    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    const zoomControl = new kakao.maps.ZoomControl();
    map.relayout();
    map.addControl(
        mapTypeControl,
        kakao.maps.ControlPosition.TOPRIGHT
    );
    map.addControl(
        zoomControl,
        kakao.maps.ControlPosition.RIGHT
    );
    return map;
}

const Map = React.forwardRef(({onInitialized, moduleLoaded}: {onInitialized: () => any,  moduleLoaded: boolean}, ref): JSX.Element => {
    const [initialized, setInitialized] = useState(false);
    // const [moduleLoaded, setModuleLoaded] = useState(false);

    useEffect(() => {
        if (moduleLoaded) return;
        const { kakao } = window as any;

        kakao.maps.load(() => {
            const kakaoMap = document.getElementById('map');
            const map = initMap(kakao, kakaoMap);
            kakao.maps.event.addListener('idle', () => {
                if (!initialized) {
                    onInitialized();
                    setInitialized(true);
                }
            });

            function fetchCallback (response: PharmacyAPIResult) {
                //
                // cls.setState({
                //     data: response.data.map(row => new Pharmacy(row)),
                //     holiday: response.meta.holiday || false,
                // });
                // const list = cls.findPharmacyInBounds(kakao, map);
                // cls.setState({listLoaded: true, list});
            }
            // this.fetchData(fetchCallback);
            // this.initFindNearestButton(kakao, map);
            // this.setState({
            //     map: map,
            //     kakao: kakao,
            // });
            window.kakaoMap = map;
            // setModuleLoaded(true);
        })
    }, [moduleLoaded, initialized]);

    return <>d</>
})
Map.displayName = "Map";



function loadKakaoMapModule ({appKey, onAddScript, onLoad, onError}: {appKey: string, onAddScript?: () => any, onLoad?: (e: Event) => any, onError?: (e: Event) => any}) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer,drawing?autoload=false`;
    script.async = true;

    document.body.appendChild(script);
    onAddScript && onAddScript();
    // setValue(prevState => prevState + 10);
    onLoad && script.addEventListener("load", onLoad);
    onError && script.addEventListener("error", onError);
}

function ExampleDiv () {
    const componentHeight = 500;
    const [{y }, api] = useSpring(() => ({ y: componentHeight }));

    function open ({ canceled }: {canceled: boolean}) {
        api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
    }
    function close (velocity = 0) {
        api.start({y: componentHeight, immediate: false, config: {...config.stiff, velocity}})
    }
    // @ts-ignore
    const dragHandler = ({ down, last, velocity: [, vy], direction: [, dy], movement: [, my], cancel, canceled }) => {
        // if the user drags up passed a threshold, then we cancel
        // the drag so that the sheet resets to its open position
        // if (my < 250) cancel()
        console.log(my)
        // when the user releases the sheet, we check whether it passed
        // the threshold for it to close, or if we reset it to its open positino
        if (last) {
            if (my > 250 || (vy > 0.5 && dy > 0)) {
                close(vy)
            } else {
                open({ canceled })
            }
        }
            // when the user keeps dragging, we just move the sheet according to
        // the cursor position
        else {

            api.start({y: my, immediate: true})
        }
    }
    // @ts-ignore
    const bind = useDrag(dragHandler, { from: () => [0, y.get()], filterTaps: true, bounds: { top: 0 }, rubberband: true })
    const display = y.to((py) => (py < componentHeight ? 'block' : 'none'))


    // const closedPanelSize = 100;
    // const closedPanelSizeRef = useRef(closedPanelSize);
    // const [drawerOpen, setDrawerOpen] = useState();
    // const maxOpenHeight = 1000;
    // const height = maxOpenHeight - closedPanelSize;
    //
    // const bind = useDrag(({down, last, movement: [mx, my]}) => {
    //     if (last && my <= 500) {
    //
    //     }
    //     set.start({y: down ? my: 0, immediate: down})
    // })
    //
    // if (closedPanelSizeRef.current !== closedPanelSize) {
    //     closedPanelSizeRef.current = closedPanelSize;
    //     if (!drawerOpen) {
    //         api({
    //             y: height,
    //             immediate: false,
    //         })
    //     }
    // }

    return (
        <>
            <Button onClick={open}>asdf</Button>
        <a.div {...bind()} className='sheet' style={{y, width: '100%', height: '600px', backgroundColor: 'red', position: 'fixed', }} />
        </>
    )
}



export default function Home (props: HomeSSRProps): JSX.Element {
    const { data, KAKAO_KEY } = props;
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [coords, setCoords] = useState([126.96072340180352, 37.54425411510226]);

    useEffect(() => {
        if (!KAKAO_KEY) throw new Error();
        loadKakaoMapModule({
            appKey: KAKAO_KEY,
            onAddScript: () => {setValue(10)},
            onLoad: () => {setValue(100);},
            onError: () => {alert('error')}
        })
    }, []);  // eslint-disable-line

    useEffect(() => {
        if (value >= 100) {
            setLoading(false);
        }
    }, [value])





    // @ts-ignore

    const foo = useSpring({to: {opacity: 1}, from: {opacity: 0}, loop: true})
    // useEffect(() => {
    //     sleep(1000)
    //         .then(() => {
    //             setValue((prevState => prevState+5));
    //         })
    // }, [value])
    return (
        <Wrapper>
            {loading
                ? <ProgressLoaderComponent value={value} />
                : <React.Fragment>
                    <ExampleDiv />
                    {/*<Header />*/}
                    {/*<Nav />*/}
                    {/*<Main>*/}
                    {/*<Sidebar id="sidebar" />*/}
                    {/*    <Content >*/}
                    {/*        */}
                    {/*    </Content>*/}

                    {/*</Main>*/}
                  </React.Fragment>
            }


        </Wrapper>
    )


}
