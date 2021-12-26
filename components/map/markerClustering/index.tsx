import styled from "styled-components";

const AnchorContainer = styled.div`
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const OuterAnchor = styled.div`
  background: #000;
  width: 30px;
  height: 30px;
  box-shadow: rgba(0,0,0,.16) 0 4px 16px;
  border: 1px solid #000;
  border-radius: 50%;
  opacity: .8;

  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  justify-content: center;
  align-items: center;

  display: flex;
  flex-direction: column;
  color: #fff;
`;

const MarkerCluster = () => (
    <AnchorContainer>
        <OuterAnchor />
    </AnchorContainer>
);

export default MarkerCluster;