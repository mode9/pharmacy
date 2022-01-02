import styled from "styled-components";
import {theme} from "../../styles/theme";

const Wrapper = styled.div`
  width: 500px;
  height: 500px;
  max-width: calc(100vw - 50px);
  background: #fff;
  z-index: ${theme.zIndex.high};
`


const InfoWindow = () => {
    return <Wrapper>adsfasdf</Wrapper>
}

export default InfoWindow;