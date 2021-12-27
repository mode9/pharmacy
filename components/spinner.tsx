import styled from "styled-components";
import {SpinnerTwoAlt} from "css.gg/icons/all";
import React from "react";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F6F6F6;
  position: relative;
`;

const Spinner = (props: {hidden?: boolean}) => {
    return (
        <SpinnerWrapper className="spinner" style={{display: props.hidden ? "none" : "flex"}}>
            <SpinnerTwoAlt />
        </SpinnerWrapper>
    )
}

export default Spinner;