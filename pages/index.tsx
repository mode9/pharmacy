import React, {Component} from 'react';
import {Layout, Menu} from 'antd';

import PharmacyItems from "../components/items";

const { Header, Content, Sider } = Layout;

export default class Home extends Component {
  // seoul coords
  state = {
    x: 126.96072340180352,
    y: 37.54425411510226,
    map: null,
    kakao: null,
  }
  componentDidMount() {
    const { kakao } = window as any;
    const kakaoMap = document.getElementById('map');
    const coords = new kakao.maps.LatLng(this.state.y, this.state.x); // 지도의 중심좌표
    const options = {
      center: coords,
      level: 7,
    };
    const _this = this;


    function geoSuccess (position: GeolocationPosition) {
      const x = position.coords.latitude;
      const y = position.coords.longitude;
      const pos = new kakao.maps.LatLng(x, y);
      map.setCenter(pos);
      _this.setState({x, y})
    }
    function geoError (error: GeolocationPositionError) {
      console.log('Error occurred. Error code: ' + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    }
    const map = new kakao.maps.Map(kakaoMap, options);
    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    const mapTypeControl = new kakao.maps.MapTypeControl();
    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    const zoomControl = new kakao.maps.ZoomControl();
    map.relayout();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      map.setCenter(coords);
    }
    map.addControl(
      mapTypeControl,
      kakao.maps.ControlPosition.TOPRIGHT
    );
    map.addControl(
      zoomControl,
      kakao.maps.ControlPosition.RIGHT
    );
    window.kakaoMap = map;
    this.setState({map, kakao});
  }

  render() {
    const siderStyle = { height: '100%', backgroundColor: '#fff'};
    const mapStyle = {
      width: 'calc(100vw - 400px)',
      height: 'calc(100vh - 64px)',
    };
    return (
      <Layout style={{ height: "100%" }}>
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
              <PharmacyItems map={this.state.map} kakao={this.state.kakao} />
          </Sider>
          <Layout>
            <Content style={{ height: "100%" }}>
              <div id="map" style={mapStyle} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
