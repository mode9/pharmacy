import styled from "styled-components";

export const ChevronLeft = styled.span`
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  &:before {
    border-style: solid;
    border-width: 0.1em 0.1em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    //left: 0.15em;
    position: relative;
    top: 0.3em;
    right: 0.3em;
    transform: rotate(225deg);
    vertical-align: top;
    width: 0.45em;
    transition: transform 100ms ease-in-out;
  }
`;

interface ChevronRightProps {
    $open: boolean;
}

export const ChevronRight = styled.span<ChevronRightProps>`
  display: inline-block;
  margin-left: auto;
  &:before {
    border-style: solid;
    border-width: 0.1em 0.1em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    //left: 0.15em;
    position: relative;
    top: 0.3em;
    right: 0.3em;
    transform: ${props => props.$open ? 'rotate(135deg)' : 'rotate(45deg)'};
    vertical-align: top;
    width: 0.45em;
    transition: transform 100ms ease-in-out;
  }
`;