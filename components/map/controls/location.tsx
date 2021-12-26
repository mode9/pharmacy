import {Container, ControlButton, Label, Svg} from "./_base";

const Location = () => {
    return (
        <Svg aria-hidden="true" role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            <path fillRule="evenodd" d="M19.071 3.429C15.166-.476 8.834-.476 4.93 3.429c-3.905 3.905-3.905 10.237 0 14.142l.028.028 5.375 5.375a2.359 2.359 0 003.336 0l5.403-5.403c3.905-3.905 3.905-10.237 0-14.142zM5.99 4.489A8.5 8.5 0 0118.01 16.51l-5.403 5.404a.859.859 0 01-1.214 0l-5.378-5.378-.002-.002-.023-.024a8.5 8.5 0 010-12.02z" />
        </Svg>
    );
}

const LocationControl = () => (
    <Container>
        <ControlButton>
            <Location />
            <Label>내 위치 찾기</Label>
        </ControlButton>
    </Container>
)

export class GeolocationHandler {
    mapManager: any;
    defaultZoom: number;
    constructor(mapManager: any) {
        this.mapManager = mapManager;
        this.defaultZoom = 16;
        this.geoSuccess = this.geoSuccess.bind(this);
    }

    geoSuccess (position: GeolocationPosition) {
        const x = position.coords.latitude;
        const y = position.coords.longitude;
        const mapManager = this.mapManager;
        const pos = new mapManager.getLatLng(x, y);
        const zoom = this.defaultZoom;
        function endCenterChanged () {
            mapManager.setZoom(zoom);
        }
        // this.mapManager.module.maps.Manager
        mapManager.addListenerOnce('idle', endCenterChanged)
        mapManager.panTo(pos);
        // setTimeout(() => {
        //     kakao.maps.event.removeListener(map, 'idle', endCenterChanged);
        // }, 1000);
        // callback();
    }

    geoError (error: GeolocationPositionError) {
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
        // callback();
    }

    moveTo = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
        } else {
            alert('지원하지 않는 브라우저입니다.');
        }
    }
}

export const moveToCurrentPosition = (mapManager: any) => {
    const locationHandler = new GeolocationHandler(mapManager);
    return () => {

    }
}


export default LocationControl;