import styled from "styled-components";

const Root = styled.div`
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const AnchorContainer = styled.div`
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const OuterAnchor = styled.div`
  background: ${(props: {disabled?: boolean}) => props.disabled ? "#8D8D8D" : "#000"};
  width: 18px;
  height: 18px;
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

  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  transform-origin: bottom;
`;

const InnerAnchor = styled.div`
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
`;

const Needle = styled.div`
  width: 4px;
  height: 4px;
  background: ${(props: {disabled?: boolean}) => props.disabled ? "#8D8D8D" : "#000"};
  border: 1px solid #000;
  border-top: none;
  //box-shadow: rgba(0,0,0,.16) 0 4px 16px;
  opacity: .8;
`;

const Label = styled.div`
  color: #000;
  font-size: 12px;
  font-weight: bold;
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
  white-space: nowrap;
  position: absolute;
  bottom: -16px;
`;

const Marker = ({disabled, label}: {disabled?: boolean, label?: string}) => {
    return (
        <Root className="marker__root">
            <AnchorContainer className="marker__anchor_container">
                <OuterAnchor className="marker__outer_anchor" disabled={disabled} >
                    <InnerAnchor />
                </OuterAnchor>
            </AnchorContainer>
            <Needle disabled={disabled} />
            <Label className="marker__label">{label}</Label>

        </Root>
    )
}
export default Marker;