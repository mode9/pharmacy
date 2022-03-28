import styled from "styled-components";
import {theme} from "../../styles/theme";
import Modal from "../modal";
import React from "react";
import {useTransition} from "@react-spring/web";
import {Info} from "css.gg/icons/tsx/Info";

const CONTACT_EMAIL = 'mode9.dev@gmail.com';

const Wrapper = styled.div`
  width: 500px;
  height: 500px;
  max-width: calc(100vw - 50px);
  background: #fff;
  z-index: ${theme.zIndex.high};
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
`;

const UnOrderedList = styled.ul`
  & > li {
    margin: 5px 0;
  }
`

const InfoModalBody = function () {

    return (
        <>
            <h4>지금 정말 영업 중인지 방문 전에 확인 전화 해보세요</h4>
            <UnOrderedList>
                <li><b>심야</b> 혹은 <b>주말/공휴일</b>에 영업하는 약국 정보만을 제공드려요</li>
                <li><b>국립중앙의료원</b>의 심야운영약국 데이터를 기반으로 제작되었으며, 약국의 실제 영업시간과는 다를 수 있어요.</li>
            </UnOrderedList>
            <p><small>제보: <a href={`mailto:${CONTACT_EMAIL}?Subject=[심야약국] 문의`}><u>{CONTACT_EMAIL}</u></a> </small></p>
            {/*<p>제보: <a href={`mailto:${CONTACT_EMAIL}`}><u>{CONTACT_EMAIL}</u></a></p>*/}
        </>
    )
}


const InfoWindowModal = ({visible, onClose}: {visible: boolean, onClose: () => void}) => {
    const transitions = useTransition(visible, {
        from: { opacity: 0, transform: "translateY(-40px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-40px)" }
    });
    return transitions( ( styles, item ) =>
            item && (
                <Modal
                    style={styles}
                    closeModal={onClose}
                    title={<><TitleIcon /><Title>안내사항</Title></>}
                    body={<InfoModalBody />}
                />
            )
    )
}

export default InfoWindowModal;