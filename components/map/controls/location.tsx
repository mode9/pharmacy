import {Container, ControlButton, Label} from "./_base";
import Spinner from "../../spinner";
import {NaverMap} from "../../../core/mapManager/naver";
import {Location} from "../../icons/location";

const LocationControl = () => (
    <Container id="geolocation-container">
        <ControlButton>
            <Location style={{marginRight: '3px'}} />
            <Label>내 주변 찾기</Label>
        </ControlButton>
        <Spinner hidden={true} />
    </Container>
)

export class GeolocationHandler {
    mapManager: NaverMap;
    defaultZoom: number;
    constructor(mapManager: any) {
        this.mapManager = mapManager;
        this.defaultZoom = 16;
        this.geoSuccess = this.geoSuccess.bind(this);
    }

    geoSuccess (position: GeolocationPosition) {
        const y = position.coords.latitude;
        const x = position.coords.longitude;
        const mapManager = this.mapManager;
        const pos = mapManager.getLatLng(x, y);
        const zoom = this.defaultZoom;

        const zoomEqual = mapManager.getZoom() === zoom;
        const posEqual = pos.equals(mapManager.getCenter());

        if (zoomEqual && posEqual) {
            return Promise.all([]);
        } else if (zoomEqual) {
            return mapManager.panTo(pos);
        } else if (posEqual) {
            return mapManager.setZoom(zoom);
        }
        return mapManager.panTo(pos)
            .then(() => mapManager.setZoom(zoom));
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
    }

    getPosition = (): Promise<GeolocationPosition> => {
        const defaultOption = {
            maximumAge: 1000 * 3600,
            timeout: 1000 * 5,
        }
        return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
                reject('지원하지 않는 브라우저입니다.');
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, defaultOption);
        });
    }

    moveTo = () => {
        const geoSuccess = this.geoSuccess;
        const geoError = this.geoError;
        return this.getPosition()
            // @ts-ignore
            .then((position) => geoSuccess(position))
            .catch((error: GeolocationPositionError) => geoError(error))

    }
}

export default LocationControl;