import {Container, ControlButton, Label} from "./_base";
import Spinner from "../../spinner";
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

export default LocationControl;