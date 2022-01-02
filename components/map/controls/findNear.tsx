import styled from "styled-components";
import {Redo} from "css.gg/icons/all";

const Root = styled.div`
  transform: translateY(-9rem);
  //margin-bottom: 9rem;
`

const Button = styled.button`
  background: #fff;
  width: 160px;
  height: 40px;
  border: none;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, .16);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  cursor: pointer;
  color: #000;
`;

const RedoIcon = styled(Redo)`
  width: 12px;
  height: 12px;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

const FindNear = ({hidden}: {hidden?: boolean}) => {
    return (
        <Root id="find-near-container">
            <Button>
                <RedoIcon/>
                <Label>현 위치에서 검색</Label>
            </Button>
        </Root>
    );
}

export default FindNear;