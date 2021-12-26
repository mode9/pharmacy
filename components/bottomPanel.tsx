import React, {useState} from "react";
import {animated, config, useSpring} from "@react-spring/web";
import {useGesture} from "@use-gesture/react";
import styled from "styled-components";

import {theme} from "../styles/theme";

type gestureOptions = {
    last: boolean;
    velocity: [number, number];
    direction: [number, number];
    movement: [number, number];
}

function BottomPanel () {
    const height = 500;
    const minHeight = 100;
    const initialY = 0;
    const [{y }, api] = useSpring(() => ({ y: initialY }));
    const [opened, setOpened] = useState(true);

    function open () {
        setOpened(true);
        api.start({ y: minHeight - height, immediate: false, config: config.stiff })
    }
    function close (velocity = 0) {
        setOpened(false)
        api.start({y: initialY, immediate: false, config: {...config.stiff, velocity}})
    }
    const dragHandler = ({ last, velocity: [, vy], direction: [, dy], movement: [, my] }: gestureOptions) => {
        if (last) {
            if (opened) {
                my > (height * 0.5) || (vy > 0.5 && dy > 0) ? close(vy) : open();
            } else {
                my < -(height * 0.3) || (vy > 0.5 && dy < 0) ? open() : close(vy);
            }
        }
        else {
            if (opened) {api.start({y: (minHeight-height) + my, immediate: true})}
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
            drag: { from: () => [0, y.get()], rubberband: true, bounds: { top: minHeight - height } },
            pinch: { from: () => [0, y.get()], rubberband: true, bounds: { top: minHeight - height } }
        }
    )
    const AnimatedPanel = styled(animated.div)`
      width: 100%;
      height: 100vh;
      align-self: center;
      background: #fff;
      position: fixed;
      border-radius: 16px;
      bottom: calc(-100vh + ${minHeight}px );
      z-index: 10000;
      touch-action: none;
      ${theme.media.large} {
        display: none;
      }
    `;

    return (
        <AnimatedPanel style={{y}} {...bind()} />
    )
}

export default BottomPanel;