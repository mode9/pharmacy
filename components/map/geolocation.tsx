import {Button, Tooltip} from "antd";
import {AimOutlined} from "@ant-design/icons";
import React, {Component} from "react";


interface GeolocationProps {
    kakao: any,
    map: any
}

export default class Geolocation extends Component<GeolocationProps> {
    state = {
        loading: false,
    }
    onClickGeoLocation(kakao: any, map: any, callback: () => void) {
        function geoSuccess (position: GeolocationPosition) {
            const x = position.coords.latitude;
            const y = position.coords.longitude;
            const pos = new kakao.maps.LatLng(x, y);
            map?.setCenter(pos);
            callback();
        }
        function geoError (error: GeolocationPositionError) {
            /**
             *  @param error geolocation failed object:
             *  error.code can be:
             *   0: unknown error
             *   1: permission denied
             *   2: position unavailable (error response from location provider)
             *   3: timed out
             */
            console.log('Error occurred. Error code: ' + error.code);
            if (error.code === 1) {
                alert('내 위치 확인을 허용해주세요.')
            }
            callback();
        }
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        } else {
            alert('지원하지 않는 브라우저입니다.');
        }
    }
    render() {
        const { loading } = this.state;
        const { kakao, map } = this.props;
        const cls = this;
        return (
            <Tooltip title="현재 위치">
                <Button
                    id="geolocation"
                    shape="circle"
                    loading={loading}
                    onClick={() => {
                        cls.setState({loading: true});
                        cls.onClickGeoLocation(kakao, map, () => {
                            cls.setState({loading: false})
                        })
                    }}
                    icon={<AimOutlined style={{fontSize: '20px'}} />} size="large" style={{
                        position: 'absolute',
                        bottom: '3%',
                        right: '3%',
                        width: '60px',
                        height: '60px',
                        zIndex: 10000,
                    }}
                />
            </Tooltip>
        )
    }

}
