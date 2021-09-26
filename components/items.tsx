import React, {Component} from "react";
import {List, Skeleton} from "antd";
import {MehOutlined} from "@ant-design/icons";
import gsap, { Circ } from "gsap";

import Pharmacy from "../core/pharmacies";
import {PharmacyData, PharmacyItemType} from '../core/types';
import {isUndefined} from "util";


interface PharmacyProps {
    list: Pharmacy[],
    loaded: boolean,
}

export default class PharmacyItems extends Component<PharmacyProps> {
    bounceAnimation(item: PharmacyItemType | PharmacyData) {
        const markerNode: HTMLElement = item.marker.fa;
        const tl = gsap.timeline();
        tl.add('start')
            .to(markerNode, {
                y: -20,
                duration: .15,
                ease: Circ.easeOut,
            })
            .to(markerNode, {
                y: 0,
                duration: .2,
                ease: Circ.easeIn,
            })
            .to(markerNode, {
                // y: 0,
                scaleY: 0.7,
                duration: .1,
                transformOrigin: 'center bottom',
                borderBottomLeftRadius: '40%',
                borderBottomRightRadius: '40%',
                ease: Circ.easeIn
            }, '-=.01')
            .to(markerNode, {
                y: -10,
                scaleY: 1,
                duration: .1,
                transformOrigin: 'center center',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                ease: Circ.easeOut
            }, )
            .to(markerNode, {
                y: 0,
                duration: .1,
                ease: Circ.easeIn
            })
    }
    render() {
        let { list, loaded } = this.props;
        const loading = !loaded && list.length < 1;
        const onclickFunc = this.bounceAnimation;
        list = loaded ? list : new Array(20).fill({});
        function isEmpty (obj: any): boolean {
            return Object.keys(obj).length === 0;
        }
        return (
            <div className="infinite-container">
                <List 
                    className="infinite-item"
                    itemLayout="horizontal"
                    dataSource={list}
                    renderItem={(item: PharmacyItemType|PharmacyData, idx: number) => (
                        <List.Item
                            key={`pharmacy-${idx}`}
                            style={{ paddingLeft: '1rem', paddingRight: '1rem', opacity: !isEmpty(item) && item.isOpen() ? 1 : .5}}
                            onClick={() => {
                                // TODO: panTo coords
                                if (!isEmpty(item)) {
                                    onclickFunc(item);
                                }
                            }}
                        >
                            <Skeleton avatar title={false} loading={loading} active>
                                <List.Item.Meta
                                    avatar={<MehOutlined style={{ fontSize: '1.75em', marginTop: '8px' }} />}
                                    title={item ? item.name : false}
                                    description={item ? item.phone : false}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                >
                </List>
            </div>
        )
    }
}