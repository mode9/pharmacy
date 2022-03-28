import styled, {keyframes} from "styled-components";

export const Svg = styled.svg`
  display:inline-block;
  user-select:none;
  vertical-align:middle;
  overflow:visible;
  width: ${props => {
      if (!props.width) {
          return '18px';
      } else if (typeof props.width === 'number') {
          return `${props.width}px`;
      } 
      return props.width;
  }};
  height: ${props => {
      if (!props.width) {
          return '18px';
      } else if (typeof props.width === 'number') {
          return `${props.width}px`;
      }
      return props.width;
  }};
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
  text-align: left;
  color: #000;
`;

export const Label = styled.span`
  margin-left: 5px;
  vertical-align: middle;
  font-weight: 500;
`;

