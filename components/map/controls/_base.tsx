import styled, {keyframes} from "styled-components";

export const Svg = styled.svg`
  display:inline-block;
  user-select:none;
  vertical-align:middle;
  overflow:visible;
  margin-right: 3px;
`;


export const Container = styled.div`
  display: flex;
  margin-top: 13px;
  margin-left: 13px;
`;

export const ControlButton = styled.button`
  border: none;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  font-size: 14px;
  background: #fff;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, .26);
  border-radius: 8px;
  //margin-right: 10px;
  //min-width: 120px;
  text-align: left;
`;

export const Label = styled.span`
  margin-left: 5px;
  vertical-align: middle;
  font-weight: 500;
`;

