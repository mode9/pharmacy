import React, {useEffect, useRef, useState} from "react";
import {animated, config, useSpring} from "@react-spring/web";
import {useGesture} from "@use-gesture/react";

import styled from "styled-components";

import {theme} from "../styles/theme";
import Pharmacy, {filterPharmacies} from "../core/pharmacies";
import {FormatLineHeight} from "css.gg/icons/all";
import {useSelector, useStore} from "react-redux";
import {State} from "../core/reducers/types";
import {RootState} from "../core/reducers";
import {activatePharmacy, selectPharmacy} from "../core/reducers/selector";
import {Location} from "./icons/location";
import {HoverContainer} from "./icons/base";

const HEIGHT = 500;
const MIN_HEIGHT = 92;
const INITIAL_Y = 0;

type gestureOptions = {
    last: boolean;
    velocity: [number, number];
    direction: [number, number];
    movement: [number, number];
    event: any;
}

const AnimatedPanel = styled(animated.div)`
  width: 100%;
  height: 100vh;
  align-self: center;
  background: #fff;
  position: fixed;
  border-radius: 16px;
  bottom: calc(-100vh + ${MIN_HEIGHT}px );
  z-index: 10000;
  touch-action: none;
  font-family: 'Noto Sans KR', sans-serif;
  ${theme.media.large} {
    display: none;
  }
`;

const PinchBar = styled.span`
  width: 40px;
  height: 5px;
  background: #dddbda;
  border-radius: 15px;
  display: inline-block;
  vertical-align: middle;
`;

const Grid = styled.div`
  display: flex;
  width: 100%;

  flex-direction: column;
`;


const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1rem 24px 1rem;
  border-bottom: 1px solid #dddbda;
`;

const GridHeaderAction = styled.div`
  width: 60px;
`;

const SortIcon = styled(FormatLineHeight)`
  display: inline-block;
  height: 9px;
  width: 12px;
  margin: 0 4px;
`;

const Label = styled.span`
  font-size: 12px;
`;

const Title = styled.h4`
  margin: 0;
`;

const GridBody = styled.div< { scrollable: boolean } >`
  width: 100%;
  //padding: 1rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  height: 50vh;
  overflow-y: ${ ({ scrollable }) => scrollable ? 'scroll' : 'unset' }
  //overscroll-behavior: none;
`;

const GridRow = styled.div<{isOpen: boolean}>`
  width: 100%;
  //margin-bottom: 0.625rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #dddbda;
  cursor: pointer;
  display: flex;
  background: ${props => props.isOpen ? 'transparent' : '#f0f0f0'};
  opacity: ${props => props.isOpen ? 1 : .65};
  &:last-of-type {
    margin-bottom: 2rem;
    border-bottom: unset;
  }
`;

const ContentColumn = styled.div`
    width: 80%;
`;

const ContentTitle = styled.h5`
  margin: 0;
`;

const ContentDescription = styled.div`
  color: #6B6B6B;
  margin: 0;
  font-size: 12px;
`;

const ContentDescriptionAddress = styled.p`
  width: 100%;
`

const ActionColumn = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const AccentDescription = styled.span`
  color: #000;
  font-weight: bold;
  vertical-align: middle;
`

function BottomPanel () {
    const [{y }, api] = useSpring(() => ({ y: INITIAL_Y }));
    const [opened, setOpened] = useState(false);
    const gridBodyRef = useRef<HTMLDivElement>(null);
    const [scrollable, setScrollable] = useState(false);
    const state = useSelector<RootState, State>(state => state.pharmacies);
    const center = state.filters.bounds?.getCenter();
    const pharmacies = state.pharmacies;
    const pharmaciesInBounds = filterPharmacies(pharmacies.map(row => new Pharmacy(row)), state.filters);
    const store = useStore();

    function handleClick (pharmacyId: number) {
        store.dispatch(selectPharmacy(pharmacies.find(row => row.id === pharmacyId) || null))
    }

    function handleLocationClick(e: React.MouseEvent<HTMLButtonElement>, pharmacy: Pharmacy) {
        e.stopPropagation();
        close();
        store.dispatch(activatePharmacy(pharmacy.toObject()));
    }

    useEffect(() => {
        if (gridBodyRef.current) {
            const scrollHeight = gridBodyRef.current.scrollHeight;
            const clientHeight = gridBodyRef.current.clientHeight;
            setScrollable(scrollHeight > clientHeight);
        }
    }, [pharmaciesInBounds])

    function open () {
        setOpened(true);
        api.start({ y: MIN_HEIGHT - HEIGHT, immediate: false, config: config.stiff })
    }
    function close (velocity = 0) {
        setOpened(false)
        api.start({y: INITIAL_Y, immediate: false, config: {...config.stiff, velocity}})
    }
    const dragHandler = ({ event, last, velocity: [, vy], direction: [, dy], movement: [, my] }: gestureOptions) => {
        // event.preventDefault();
        // event.stopPropagation();
        if (!gridBodyRef.current) return
        const direction = dy > 0 ? "down" : dy < 0 ? "up" : "none";
        if (scrollable && opened && direction !== 'none') {
            const targetInBody = gridBodyRef.current.contains(event.target);

            if (targetInBody && direction === 'up') {
                return;
            } else if (targetInBody && direction === 'down' && gridBodyRef.current.scrollTop > 0) {
                return;
            }
        }
        if (last) {
            if (opened) {
                my > (HEIGHT * 0.5) || (vy > 0.5 && direction === 'down') ? close(vy) : open();
            } else {
                my < -(HEIGHT * 0.3) || (vy > 0.5 && direction === 'up') ? open() : close(vy);
            }
        } else {
            if (opened) {api.start({y: (MIN_HEIGHT-HEIGHT) + my, immediate: true})}
            else {api.start({y: my, immediate: true})}
        }
    }

    // @ts-ignore
    const bind = useGesture(
        {
            onDrag: dragHandler,
            onPinch: dragHandler,
            // onMouseDown: ({event}) => event.stopPropagation(),
        },
        {
            drag: { from: () => [0, y.get()], rubberband: true, bounds: { top: MIN_HEIGHT - HEIGHT } },
            pinch: { from: () => [0, y.get()], rubberband: true, bounds: { top: MIN_HEIGHT - HEIGHT } },
        }
    )

    return (
        <AnimatedPanel style={{y}} {...bind()} >
            <div style={{textAlign: 'center'}} ><PinchBar /></div>
            <Grid>
                <GridHeader>
                    <div>
                        <Title>영업중인 약국</Title>
                        <span style={{fontSize: '12px', color: '#6B6B6B'}}>{`주변에 ${pharmaciesInBounds.length} 개의 검색결과가 있습니다.`}</span>
                    </div>
                    <GridHeaderAction>
                        {/*<SortIcon />*/}
                        {/*<Label>거리 순</Label>*/}
                    </GridHeaderAction>
                </GridHeader>
                <GridBody ref={gridBodyRef} scrollable={scrollable}>
                    {pharmaciesInBounds.map((row, idx) => (
                        <GridRow key={idx} isOpen={row.isOpen(state.filters.isHoliday)} onClick={() => handleClick(row.id)}>
                            <ContentColumn>
                                <ContentTitle>{row.name}</ContentTitle>
                                <ContentDescription>
                                    <span style={{ width: '35px', display: 'inline-block' }}>{center ? row.humanizedDistance(center) : "알수없음"}</span>
                                    <span className="delimiter" style={{padding: '0 2px'}}>&#8226;</span>
                                    {/*{row.isOpen(props.isHoliday) ? <AccentDescription>영업 중</AccentDescription> : "영업종료"} &#8226;*/}
                                    <span style={{ display: 'inline-block', textAlign: 'left' }}>
                                        {row.isOpen(state.filters.isHoliday) ? row.todayOpeningHour(state.filters.isHoliday).humanizeWorkingHours() : '영업 종료'}
                                    </span>
                                    <ContentDescriptionAddress>{(row.address_road || row.address)?.split(' ').splice(1).join(' ')}</ContentDescriptionAddress>
                                </ContentDescription>
                            </ContentColumn>
                            <ActionColumn>
                                <HoverContainer onClick={(e) => {handleLocationClick(e, row)}}>
                                    <Location style={{color: '#000'}} />
                                </HoverContainer>
                            </ActionColumn>
                        </GridRow>
                    ))}

                </GridBody>
            </Grid>
        </AnimatedPanel>
    )
}

export default BottomPanel;