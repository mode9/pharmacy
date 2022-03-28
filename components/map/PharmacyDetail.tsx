import React, {createElement, useState} from "react";
import Pharmacy from "../../core/pharmacies";
import styled from "styled-components";
import {animated, useTransition} from "@react-spring/web";
import Modal from "../modal";
import {ChevronLeft} from "../chevron";


const Header = styled.h2`
  margin-bottom: .25rem;
`;

const OpeningStatusComponent = styled.span<{isOpen: boolean}>`
  color: ${props => props.isOpen ? 'green' : '#ff3141'};
  font-size: 12px;
  vertical-align: middle;
  margin-left: 5px;
  font-weight: 600;
`;

const OpeningStatusSign = styled.span<{isOpen: boolean}>`
  background-color: ${props => props.isOpen ? 'green' : '#ff3141'};
  width: 5px;
  height: 5px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 2px;
  margin-bottom: 2px;
`;

function OpeningStatus ({isOpen}: {isOpen: boolean}) {
    return (
        <OpeningStatusComponent isOpen={isOpen}>
            <OpeningStatusSign isOpen={isOpen} />
            {isOpen ? '영업 중' : '영업 종료'}
        </OpeningStatusComponent>
    )
}

function PharmacyDetailBody ({pharmacy, isHoliday, onNext}: { pharmacy?: Pharmacy, isHoliday: boolean, onNext: () => void }) {
    return pharmacy ? (
        <>
            {/*<Header>{pharmacy.name}</Header>*/}
            <OpeningStatus isOpen={pharmacy.isOpen(isHoliday)} />
            {/*<h4>세부사항</h4>*/}
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>영업시간</span>
                    <a href="#" onClick={onNext}
                       style={{marginLeft: 'auto', fontSize: '11px', color: 'blue', alignSelf: 'center'}}>자세히보기 &gt;</a>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.todayOpeningHour(isHoliday).humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>주소</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.address_road || pharmacy.address}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>연락처</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.phone}</div>
            </div>
        </>
    ) : <></>
}

function PharmacyHoursDetail ({pharmacy, isHoliday, onPrev}: { pharmacy?: Pharmacy, isHoliday: boolean, onPrev: () => void }) {
    return pharmacy ? (
        <>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>월요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.monday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>화요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.tuesday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>수요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.wednesday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>목요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.thursday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>금요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.friday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>토요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.saturday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>일요일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.sunday.humanizeWorkingHours()}</div>
            </div>
            <div style={{margin: '15px 0'}}>
                <div style={{margin: '.5rem 0', display: 'flex'}}>
                    <span>공휴일</span>
                </div>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '.625rem 1rem',
                    borderRadius: '18px'
                }}>{pharmacy.holiday.humanizeWorkingHours()}</div>
            </div>
        </>
    ) : <></>
}

const modalBodies = [PharmacyDetailBody, PharmacyHoursDetail];

export default function PharmacyDetailModal ({pharmacy, isHoliday, onClose}: { pharmacy?: Pharmacy, isHoliday: boolean, onClose: () => void }) {
    const [index, setIndex] = useState<number>(0);
    const selectTransitions = useTransition(pharmacy , {
        from: { opacity: 0, transform: "translateY(-40px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-40px)" }
    });
    const bodyTransitions = useTransition(index, {
        initial: null,
        config: {duration: 120},
        from: (item) => ({ opacity: 0, transform: `translate3d(${item ? '' : '-'}100%, 0 ,0)` }),
        enter: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
        leave: (item) => ({ opacity: 0, transform: `translate3d(${item ? '': '-'}65%, 0, 0)` }),
    });
    function handleNext () {
        setIndex(1);
    }
    function handlePrev () {
        setIndex(0);
    }
    function handleClose () {
        onClose();
        setTimeout(handlePrev, 300);
    }
    return selectTransitions( ( styles, item ) =>
            item && (
                <Modal
                    style={styles}
                    size="mini"
                    closeModal={handleClose}
                    title={!index ? <Header>{pharmacy?.name}</Header> : <Header><ChevronLeft onClick={handlePrev} />영업시간</Header>}
                    body={
                        bodyTransitions((style, index) => (
                            <animated.div style={style}>
                                { createElement(modalBodies[index], {pharmacy: pharmacy, isHoliday: isHoliday, onNext: handleNext, onPrev: handlePrev }) }
                            </animated.div>
                        ))
                    }
                    allowOverflow={!!index}
                />
            )
    )
}
