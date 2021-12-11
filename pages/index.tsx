


import {styled, useStyletron} from "baseui";
import {PharmacyAPIResult} from "./api/pharmacies";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {ProgressBar} from "baseui/progress-bar";
import {AppNavBar} from "baseui/app-nav-bar";
import {Alert} from "baseui/icon";
import {useSpring, animated, config} from '@react-spring/web';
import {useGesture} from "@use-gesture/react";
import {InfoIcon, LightBulbIcon, LocationIcon, QuestionIcon} from "@primer/octicons-react";
// @ts-ignore
import {renderToString} from "react-dom/server";
import {FixedMarker, NEEDLE_SIZES, PINHEAD_SIZES_SHAPES} from "baseui/map-marker";

import {Provider as StyletronProvider} from "styletron-react";
import {styletron} from '../core/styletron';


export async function getServerSideProps () {
    const {NAVER_KEY} = process.env;
    const data = await fetch('http://localhost:3000/api/pharmacies')
        .then(res => res.json());
    return { props: { data, NAVER_KEY } }
}

const Wrapper = styled('div', ({$theme}) => ({
    width: '100%',
    height: '100%',
    backgroundColor: $theme.colors.backgroundPrimary,
    display: 'flex'
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
    const FlexWrapper = styled('div', ({$theme}) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: $theme.colors.backgroundPrimary,
        zIndex: 10001
    }));
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
    NAVER_KEY?: string;
}

function sleep(ms: number): Promise<null> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

interface mapInterface {
    module: any;
    mapDiv: any;
    map: any;

    getInitOptions: () => {[key: string]: any};
    init: () => void;
}

class KakaoMap implements mapInterface {
    module: any;
    mapDiv: any;
    map: any;

    constructor(module: any, mapDiv: any) {
        this.module = module;
        this.mapDiv = mapDiv;
    }
    getInitOptions () {
        const coords = [126.96072340180352, 37.54425411510226];  // 기본 좌표
        return {
            center: new this.module.maps.LatLng(coords[1], coords[0]), // 지도의 중심좌표
            zoom: 7,
        }
    }
    init () {
        this.map = new this.module.maps.Map(this.mapDiv, this.getInitOptions());
        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        const mapTypeControl = new this.module.maps.MapTypeControl();
        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        const zoomControl = new this.module.maps.ZoomControl();
        this.map.relayout();
        this.map.addControl(
            mapTypeControl,
            this.module.maps.ControlPosition.TOPRIGHT
        );
        this.map.addControl(
            zoomControl,
            this.module.maps.ControlPosition.RIGHT
        );
    }
}

class NaverMap implements mapInterface {
    module: any;
    mapDiv: any;
    map: any;

    constructor(module: any, mapDiv: any) {
        this.module = module;
        this.mapDiv = mapDiv;
    }

    getInitOptions() {
        const coords = [126.96072340180352, 37.54425411510226];
        return {
            // useStyleMap: true,
            center: this.module.maps.LatLng(coords[1], coords[0]),
            zoom: 14,
            // mapTypeControl: true,
            // mapTypeControlOptions: {
            //     style: this.module.maps.MapTypeControlStyle.BUTTON,
            //     position: this.module.maps.Position.TOP_RIGHT
            // },
            zoomControl: true,
            zoomControlOptions: {
                style: this.module.maps.ZoomControlStyle.SMALL,
                position: this.module.maps.Position.RIGHT_CENTER
            },
        }
    }

    init() {
        this.map = new this.module.maps.Map(this.mapDiv, this.getInitOptions());
    }
}

const CustomMapControl = () => {
    const [, theme] = useStyletron();
    return (
        <div id="medi-custom-control-group" style={{
            background: theme.colors.backgroundPrimary,
            boxShadow: theme.lighting.shadow500,
            borderRadius: theme.borders.radius300,
        }}>
            <button style={{backgroundColor: theme.colors.backgroundPrimary}}>
                <InfoIcon verticalAlign='middle' size={24} />
            </button>
            <button style={{backgroundColor: theme.colors.backgroundPrimary}}>
                <LocationIcon verticalAlign='middle' size={24} />
            </button>
        </div>
    )
}

interface MapOptions {
    onInitialized: () => any,
    moduleLoaded: boolean,
    data: PharmacyAPIResult
}

const Map = React.forwardRef(({onInitialized, moduleLoaded, data}: MapOptions, ref): JSX.Element => {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [css] = useStyletron();
    const isHoliday = data.meta.holiday;
    const [pharms, setPharms] = useState(data.data)


    useEffect(() => {
        if (!moduleLoaded) return;
        const { naver } = window as any;

        const mapInstance = new NaverMap(naver, mapRef.current);
        mapInstance.init();
        // const st

        const customControlButton = new naver.maps.CustomControl(renderToString(<CustomMapControl />), {
            position: naver.maps.Position.TOP_RIGHT
        })

        const mapBounds = mapInstance.map.getBounds();
        for (let i=0; i < pharms.length; i++) {
            const pharmacy = pharms[i];
            const latlng = new naver.maps.LatLng(pharmacy.y, pharmacy.x);

            if (mapBounds.hasLatLng(latlng)) {
                let marker = new naver.maps.Marker({
                    map: mapInstance.map,
                    position: latlng,
                    zIndex: 100,
                    icon: {
                        content: renderToString(
                            <StyletronProvider value={styletron}>
                            <FixedMarker
                                label={pharmacy.name}
                                size={PINHEAD_SIZES_SHAPES.xSmallCircle}
                                needle={NEEDLE_SIZES.none}

                            />
                            </StyletronProvider>
                        ),
                    }
                });
                naver.maps.Event.addListener(marker, 'click', () => {
                    marker.setMap(null);
                    marker = new naver.maps.Marker({
                        map: mapInstance.map,
                        position: latlng,
                        zIndex: 100,
                        // animation: naver.maps.Animation.BOUNCE,
                        icon: {
                            content: renderToString(
                                <StyletronProvider value={styletron}>
                                    <FixedMarker
                                        label={pharmacy.name}
                                        size={PINHEAD_SIZES_SHAPES.small}
                                        needle={NEEDLE_SIZES.none}

                                    />
                                </StyletronProvider>
                            ),
                        }
                    });
                    // setTimeout(() => {
                    //     marker.setAnimation(null)
                    // }, 700)
                })
                // const styles = engine.getStylesheetsHtml();
                // document.head.insertAdjacentHTML('beforeend', styles);

                // markers.push()
                // setMarkers([...markers, marker])
            }
        }


        naver.maps.Event.once(mapInstance.map, 'init_stylemap', () => {
            onInitialized();
            customControlButton.setMap(mapInstance.map)
        })
    }, [moduleLoaded, pharms]);

    return <div id="map" className={css({width: '100%', height: '100%'})} ref={mapRef} />
})
Map.displayName = "Map";



function loadKakaoMapModule ({appKey, onAddScript, onLoad, onError}: {appKey: string, onAddScript?: () => any, onLoad?: (e: Event) => any, onError?: (e: Event) => any}) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = `//openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${appKey}&submodules=drawing`;
    script.async = true;

    onLoad && script.addEventListener("load", onLoad);
    onError && script.addEventListener("error", onError);
    document.head.appendChild(script);
    onAddScript && onAddScript();
    // setValue(prevState => prevState + 10);
}

type gestureOptions = {
    last: boolean;
    velocity: [number, number];
    direction: [number, number];
    movement: [number, number];
}

function ExampleDiv () {
    const height = 500;
    const minHeight = 100;
    const initialY = 0;
    const [{y }, api] = useSpring(() => ({ y: initialY }));
    const [opened, setOpened] = useState(false);
    const [css, theme] = useStyletron();

    function open () {
        setOpened(true);
        api.start({ y: minHeight - height, immediate: false, config: config.stiff })
    }
    function close (velocity = 0) {
        setOpened(false)
        api.start({y: initialY, immediate: false, config: {...config.stiff, velocity}})
    }
    const dragHandler = ({ last, velocity: [, vy], direction: [, dy], movement: [, my] }: gestureOptions) => {
        if (last) {
            if (opened) {
                my > (height * 0.5) || (vy > 0.5 && dy > 0) ? close(vy) : open();
            } else {
                my < -(height * 0.3) || (vy > 0.5 && dy < 0) ? open() : close(vy);
            }
        }
        else {
            if (opened) {api.start({y: (minHeight-height) + my, immediate: true})}
            else {api.start({y: my, immediate: true})}
        }
    }

    // @ts-ignore
    const bind = useGesture(
        {
            onDrag: dragHandler,
            onPinch: dragHandler,
        },
        {
            drag: { from: () => [0, y.get()], rubberband: true, bounds: { top: minHeight - height } },
            pinch: { from: () => [0, y.get()], rubberband: true, bounds: { top: minHeight - height } }
        }
    )
    return (
        <animated.div
            className={css({
                width: '100%',
                height: '100vh',
                alignSelf: 'center',
                backgroundColor: theme.colors.backgroundPrimary,
                position: 'fixed',
                borderRadius: theme.borders.radius500,
                bottom: `calc(-100vh + ${minHeight}px )`,
                zIndex: 10000,
                touchAction: 'none',
                [theme.mediaQuery.large]: {
                    display: 'none'
                }
            })}
            style={{y}}
            {...bind()}
        >
        </animated.div>
    )
}



export default function Home (props: HomeSSRProps): JSX.Element {
    const { data, NAVER_KEY } = props;
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [coords, setCoords] = useState([126.96072340180352, 37.54425411510226]);
    const [moduleLoaded, setModuleLoaded] = useState(false);

    useLayoutEffect(() => {
        if (!NAVER_KEY) throw new Error();
        loadKakaoMapModule({
            appKey: NAVER_KEY,
            onAddScript: () => {
                setValue(10);
                console.log('script added')
            },
            onLoad: () => {
                console.log('module loaded')
                setModuleLoaded(true);
                setValue(prevState => Math.min(prevState + 100, 100));
            },
            onError: () => {alert('error')}
        })
    }, []);  // eslint-disable-line

    useEffect(() => {
        if (value >= 100) {
            setLoading(false);
        }
    }, [value])

    useEffect(() => {
        const isHoliday = data.meta.holiday;
        const pharmacies = data.data;



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
//     function findPharmacyInBounds(kakao: any, map: any) {
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
            <ExampleDiv />
            {/*<Header />*/}
            {/*<Nav />*/}
            <Main>
            <Sidebar id="sidebar" />
                <Content >
                    {/*<FixedMarker*/}
                    {/*    label='content'*/}
                    {/*    size={PINHEAD_SIZES_SHAPES.small}*/}
                    {/*    // needle={NEEDLE_SIZES.short}*/}
                    {/*/>*/}
                    <Map
                        onInitialized={() => {
                            console.log('initialized')
                            setValue(prevState => Math.min(prevState + 10, 100));
                        }}
                        moduleLoaded={moduleLoaded}
                        data={data}
                    />
                </Content>

            </Main>
        </Wrapper>
    )


}
