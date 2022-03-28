import styled from "styled-components";

export const HoverContainer = styled.button`
  appearance: none;
  background: transparent;
  border: unset;
  position: relative;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    left: -3px;
    top: -8px;
    width: 35px;
    height: 35px;
    display: block;
    border-radius: 50%;
    background: none;
    opacity: 0;
    transform: scale(0);
    box-sizing: border-box;
    transition-property: transform, opacity;
    transition-duration: .15s;
    transition-timing-function: cubic-bezier(0.4,0,0.2,1);
  }
  
  & > svg {
    opacity: 0.75;
  }
  &:hover > svg {
    opacity: 1;
  }
  &:hover::before {
    opacity: 1;
    transform: scale(1);
    background-color: rgba(32,33,36,0.059);
  }
`;