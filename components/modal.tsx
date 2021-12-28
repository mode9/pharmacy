import {animated} from "@react-spring/web";
import styled from "styled-components";
import {Info} from "css.gg/icons/tsx/Info";
import {MouseEventHandler} from "react";


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
  width: 90%;
  max-width: 800px;
  color: #000;
  background: #fff;
  padding: 40px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, .16);
`;

const Header = styled.div`
  margin: 0;
  overflow: hidden;
`;

const TitleIcon = styled(Info)`
  vertical-align: middle;
  margin-right: 5px;
  display: inline-block;
`;

const Title = styled.h3`
  vertical-align: middle;
  display: inline-block;
  margin: 0;
`

const Body = styled.div`
  font-size: 15px;
  max-height: 300px;
  overflow-y: auto;
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
  //margin-top: auto;
  width: 100%;
  //max-width: 300px;
  align-self: center;
  cursor: pointer;
  transition: background-color 0.1s linear;
`;


const Modal = ({ style, closeModal }: {style: {opacity: any, transform: any}, closeModal: () => void}) => {
    const backdropClick: MouseEventHandler = (event) => {
        // @ts-ignore
        const target: HTMLElement = event.target;
        const isBackdrop = target.classList.contains('modal-backdrop');
        isBackdrop && closeModal && closeModal();
    }
    return (
        <Backdrop className="modal-backdrop" style={{opacity: style.opacity}} onClick={backdropClick}>
            <ModalComponent style={style} className="modal">
                <Header>
                    <TitleIcon />
                    <Title>안내사항</Title>
                </Header>
                <Body>
                    <p><h4>약국 방문 전에 확인 전화를 권장드립니다.</h4></p>
                    <p><u>국립중앙의료원</u>에서 제공하는 심야운영약국 데이터를 기반으로 제작되었으며, 실제
                        약국의 영업시간과는 다를 수 있습니다.</p>
                    {/*<p><small>실제 약국의 영업시간 제보 혹은 최신화를 원하시는 분은 <u>mode9.dev@gmail.com</u> 으로 이메일 주시면 확인 후 반영하도록 하겠습니다.</small></p>*/}
                </Body>
                <Footer>
                <ModalButton className="modal-close-button" onClick={closeModal}>
                    Close
                </ModalButton>
                </Footer>
            </ModalComponent>
        </Backdrop>
    )
}

export default Modal;