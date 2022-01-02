import React, {useState} from "react";
import {animated, config, useSpring} from "@react-spring/web";
import {useGesture} from "@use-gesture/react";
import styled from "styled-components";

import {theme} from "../styles/theme";
import Pharmacy from "../core/pharmacies";
import {FormatLineHeight} from "css.gg/icons/all";

const HEIGHT = 500;
const MIN_HEIGHT = 100;
const INITIAL_Y = 0;

type gestureOptions = {
    last: boolean;
    velocity: [number, number];
    direction: [number, number];
    movement: [number, number];
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
  padding: 1rem;
  flex-direction: column;
`;


const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
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
`

function BottomPanel (props: {data: Pharmacy[]}) {
    const [{y }, api] = useSpring(() => ({ y: INITIAL_Y }));
    const [opened, setOpened] = useState(false);

    function open () {
        setOpened(true);
        api.start({ y: MIN_HEIGHT - HEIGHT, immediate: false, config: config.stiff })
    }
    function close (velocity = 0) {
        setOpened(false)
        api.start({y: INITIAL_Y, immediate: false, config: {...config.stiff, velocity}})
    }
    const dragHandler = ({ last, velocity: [, vy], direction: [, dy], movement: [, my] }: gestureOptions) => {
        if (last) {
            if (opened) {
                my > (HEIGHT * 0.5) || (vy > 0.5 && dy > 0) ? close(vy) : open();
            } else {
                my < -(HEIGHT * 0.3) || (vy > 0.5 && dy < 0) ? open() : close(vy);
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
        },
        {
            drag: { from: () => [0, y.get()], rubberband: true, bounds: { top: MIN_HEIGHT - HEIGHT } },
            pinch: { from: () => [0, y.get()], rubberband: true, bounds: { top: MIN_HEIGHT - HEIGHT } }
        }
    )


    return (
        <AnimatedPanel style={{y}} {...bind()} >
            <div style={{textAlign: 'center'}} ><PinchBar /></div>
            <Grid>
                <GridHeader >
                    <div>
                        <Title>영업중인 약국</Title>
                        <span style={{fontSize: '12px', color: '#6B6B6B'}}>{`주변에 ${props.data.length} 개의 검색결과가 있습니다.`}</span>
                    </div>
                    <GridHeaderAction>
                        <SortIcon />
                        <Label>거리 순</Label>
                    </GridHeaderAction>
                </GridHeader>
            </Grid>
        </AnimatedPanel>
    )
}

export default BottomPanel;