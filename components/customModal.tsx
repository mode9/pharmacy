import React, {MouseEventHandler, useEffect, useState} from "react";
import {animated, useTransition} from "@react-spring/web";
import styled from "styled-components";

const Backdrop = styled(animated.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba( 0, 0, 0, 0.6 );
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalComponent = styled(animated.div)`
  width: 100%;
  max-width: 600px;
  color: #000;
  background: #fff;
  padding: 40px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, .16);
  height: 100%;
  max-height: 1080px;
`;

const Header = styled.div`
  margin-bottom: .5rem;
`;

const Body = styled.div`
  font-size: 15px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  width: 100%;
  height: 100%;
  
  & > div {
    will-change: transform, opacity;
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

const Footer = styled.div`
  text-align: right;
  margin-top: auto;
`;

const ModalButton = styled.button`
  padding: 16px;
  background-color: #000;
  color: #fff;
  font-size: 1em;
  border: none;
  width: 100%;
  align-self: center;
  cursor: pointer;
  transition: background-color 0.1s linear;
`;

type ModalProps = {
    title?: React.ReactElement|string;
    body: React.ReactElement|string;
    style: {opacity: any, transform: any};
    closeModal: () => void, size?: string;
}

const CustomModal = ({ title, body, style, closeModal }: ModalProps) => {
    const backdropClick: MouseEventHandler = (event) => {
        // @ts-ignore
        const target: HTMLElement = event.target;
        const isBackdrop = target.classList.contains('modal-backdrop');
        isBackdrop && closeModal && closeModal();
    }
    return (
        <Backdrop className="modal-backdrop" style={{opacity: style.opacity}} onClick={backdropClick}>
            <ModalComponent style={style} className="modal">
                <Header>{title}</Header>
                <Body>{body}</Body>
                <Footer>
                    <ModalButton className="modal-close-button" onClick={closeModal}>닫기</ModalButton>
                </Footer>
            </ModalComponent>
        </Backdrop>
    )
}

export default CustomModal;