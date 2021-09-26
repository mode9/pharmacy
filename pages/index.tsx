import React, {Component} from 'react';
import {Layout, Menu} from 'antd';

import PharmacyItems from "../components/items";
import GeolocationButton from "../components/map/geolocation";
import FindNearest from '../components/map/findNearest';
import {PharmacyAPIResult} from './api/pharmacies';
import {PharmacyItemType} from '../core/types';
import Pharmacy from "../core/pharmacies";
const { Header, Content, Sider } = Layout;


export default class Home extends Component {
    // seoul coords
    state = {
        x: 126.96072340180352,
        y: 37.54425411510226,
        boundsChanged: false,
        data: [],
        list: [],
        listLoaded: false,
        markers: [],
        map: null,
        kakao: null,
    }
    fetchData = (callback: (data: PharmacyAPIResult) => void) => {
        fetch(`http://localhost:3000/api/pharmacies`)
            .then(res => res.json())
            .then(jsonResponse => {
                if (jsonResponse.meta.status != 200) {
                    console.error(jsonResponse);
                }
                callback(jsonResponse);
            })
    }
    initMap(kakao: any, kakaoMap: any) {
        const coords = new kakao.maps.LatLng(this.state.y, this.state.x); // 지도의 중심좌표
        const options = {
            center: coords,
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
    initFindNearestButton(kakao: any, map: any) {
        if (kakao && map) {
            const _this = this;
            this.setState({init: false});
            kakao.maps.event.addListener(map, 'bounds_changed', () => {
                if (!_this.state.boundsChanged) _this.setState({boundsChanged: true});
            })
        }
    }
    clearMarkers() {
        this.state.markers.forEach((marker: any) => {
            marker.setMap(null);
        })
    }
    distance (lat1: number, lng1: number, lat2:number, lng2:number): number {
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
    };
    findPharmacyInBounds(kakao: any, map: any) {
        // TODO:
        //  2. 영업 중/중료 flag 추가
        //  3. 오늘 공휴일인지 확인
        let markers: typeof kakao.maps.Marker[] = [];
        const { data } = this.state;
        const bounds = map.getBounds();
        const centerCoords = map.getCenter();
        const centerLng = centerCoords.getLng();
        const centerLat = centerCoords.getLat();
        const compareDistance = this.distance;
        this.clearMarkers();
        const list = data.filter((pharmacy: PharmacyItemType) => {
            const coords = new kakao.maps.LatLng(pharmacy.y, pharmacy.x);
            const inBound = bounds.contain(coords);
            if (inBound) {
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                    opacity: pharmacy.isOpen() ? 1 : .5,
                });
                pharmacy.marker = marker;
                // kakao.maps.event.addListener(marker, 'mouseover', () => {
                //
                // })
                markers.push(marker);
            }
            return inBound;
        }).sort((a: PharmacyItemType, b: PharmacyItemType): number => {
            return compareDistance(centerLat, centerLng, a.y, a.x) - compareDistance(centerLat, centerLng, b.y, b.x);
        });
        this.setState({markers});
        return list;
    }
    componentDidMount() {
        const { kakao } = window as any;
        const kakaoMap = document.getElementById('map');
        const map = this.initMap(kakao, kakaoMap);
        const cls = this;

        function fetchCallback (response: PharmacyAPIResult) {
            cls.setState({
                initLoading: false,
                data: response.data.map(row => new Pharmacy(row)),
            });
            const list = cls.findPharmacyInBounds(kakao, map);
            cls.setState({listLoaded: true, list});
        }
        this.fetchData(fetchCallback);
        this.initFindNearestButton(kakao, map);
        this.setState({
            map: map,
            kakao: kakao,
        });
        window.kakaoMap = map;
    }
    render() {
        const { list, boundsChanged, map, kakao } = this.state;
        const siderStyle = { height: '100%', backgroundColor: '#fff' };
        const fullHeightStyle = { height: '100%' };
        const mapStyle = {
            width: 'calc(100vw - 400px)',
            height: 'calc(100vh - 64px)',
        };
        const cls = this;
        return (
            <Layout style={fullHeightStyle}>
                <Header className="header">
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={400} className="site-layout-background" style={siderStyle}>
                        <PharmacyItems list={list} loaded={this.state.listLoaded} />
                    </Sider>
                    <Content style={fullHeightStyle}>
                        <div id="map" style={mapStyle}>
                            <FindNearest boundsChanged={boundsChanged} event={() => {
                                const newList = cls.findPharmacyInBounds(kakao, map);
                                cls.setState({
                                    list: newList,
                                    boundsChanged: false,
                                });
                            }} />
                            <GeolocationButton kakao={kakao} map={map} />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
