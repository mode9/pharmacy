import React, {MouseEventHandler, useEffect, useState} from "react";
import {animated, useTransition} from "@react-spring/web";
import styled from "styled-components";


type ModalComponentType = {
    size: string;
}

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

const ModalComponent = styled(animated.div)<ModalComponentType>`
  width: 100%;
  max-width: ${props => props.size === 'mini' ? '600px' : '800px'};
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
  overflow: hidden;
`;

const Body = styled.div<{allowOverflow: boolean}>`
  font-size: 15px;
  //max-height: 500px;
  overflow-x: hidden;
  overflow-y: ${props => props.allowOverflow ? 'auto' : 'hidden'};
  position: relative;
  width: 100%;
  height: 100%;
  //height: 320px;
  
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
    allowOverflow?: boolean;
    footer?: React.ReactElement|string;
}

const Modal = ({ title, body, style, closeModal, size = 'medium', allowOverflow = false, footer = '닫기' }: ModalProps) => {
    const backdropClick: MouseEventHandler = (event) => {
        // @ts-ignore
        const target: HTMLElement = event.target;
        const isBackdrop = target.classList.contains('modal-backdrop');
        isBackdrop && closeModal && closeModal();
    }
    return (
        <Backdrop className="modal-backdrop" style={{opacity: style.opacity}} onClick={backdropClick}>
            <ModalComponent style={style} className="modal" size={size}>
                <Header>
                    {title}
                </Header>
                <Body allowOverflow={allowOverflow}>
                    {body}
                    {/*<p><small>실제 약국의 영업시간 제보 혹은 최신화를 원하시는 분은 <u>mode9.dev@gmail.com</u> 으로 이메일 주시면 확인 후 반영하도록 하겠습니다.</small></p>*/}
                </Body>
                <Footer>
                <ModalButton className="modal-close-button" onClick={closeModal}>
                    {footer}
                </ModalButton>
                </Footer>
            </ModalComponent>
        </Backdrop>
    )
}

export default Modal;