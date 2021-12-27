import {animated} from "@react-spring/web";
import styled from "styled-components";

const ModalComponent = styled(animated.div)`
  width: 400px;
  height: 250px;
  color: #fff;
  background: #6929c4;
  padding: 40px;
  position: absolute;
  z-index: 90;
  top: calc(50% - 145px);
  left: calc(50% - 220px);
  display: flex;
  flex-direction: column;
`;

const ModalButton = styled.button`
  padding: 16px;
  background-color: #fff;
  color: #6929c4;
  font-size: 1em;
  border: none;
  margin-top: 16px;
  width: 90%;
  align-self: center;
  cursor: pointer;
  transition: background-color 0.1s linear;
`

const Modal = ({ style, closeModal }: {style: Object, closeModal: () => void}) => (
    <ModalComponent style={style} className="modal">
        <h3 className="modal-title">Modal title</h3>
        <p className="modal-content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto dolores
            molestias praesentium impedit. Facere, perferendis voluptate at, amet
            excepturi ratione mollitia nemo ipsum odit impedit doloremque rerum.
            Quisquam, dolorum at?
        </p>
        <ModalButton className="modal-close-button" onClick={closeModal}>
            Close
        </ModalButton>
    </ModalComponent>
);

export default Modal;