// import React, {Component} from "react";
// import {List, Skeleton} from "antd";
// import gsap, { Circ } from "gsap";
//
// import Pharmacy from "../core/pharmacies";
// import {PharmacyData, PharmacyItemType} from '../core/types';
// import spacetime from "spacetime";
// import {TIMEZONE} from "../core/times";
//
//
// interface PharmacyProps {
//     list: Pharmacy[],
//     loaded: boolean,
//     holiday: boolean,
//     map: any,
// }
//
// function dayNameMapper(weekDay: number): string {
//     return {
//         0: 'monday',
//         1: 'tuesday',
//         2: 'wednesday',
//         3: 'thursday',
//         4: 'friday',
//         5: 'saturday',
//         6: 'sunday',
//     }[weekDay] || 'holiday';
// }
//
// function humanizeDayName(dayName: string): string {
//     return {
//         'monday': '월요일',
//         'tuesday': '화요일',
//         'wednesday': '수요일',
//         'thursday': '목요일',
//         'friday': '금요일',
//         'saturday': '토요일',
//         'sunday': '일요일',
//     }[dayName] || '공휴일';
// }
//
// export default class PharmacyItems extends Component<PharmacyProps> {
//     shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>) {
//         let result = [];
//
//         for (let key in this.props) {
//             // @ts-ignore
//             result.push(nextProps[key] !== this.props[key]);
//         }
//         return result.some((row) => row);
//     }
//     moveToMarker(item: PharmacyItemType | PharmacyData, map: any) {
//         const coords = item.hasOwnProperty('marker') ? item.marker?.getPosition() : null;
//         return coords ? () => {map.panTo(coords)} : () => void 0;
//     }
//
//
//     bounceAnimation(item: PharmacyItemType | PharmacyData) {
//         const markerNode: HTMLElement = item.marker.fa;
//         const tl = gsap.timeline();
//         tl.add('start')
//             .to(markerNode, {
//                 y: -20,
//                 duration: .15,
//                 ease: Circ.easeOut,
//             })
//             .to(markerNode, {
//                 y: 0,
//                 duration: .2,
//                 ease: Circ.easeIn,
//             })
//             .to(markerNode, {
//                 // y: 0,
//                 scaleY: 0.7,
//                 duration: .1,
//                 transformOrigin: 'center bottom',
//                 borderBottomLeftRadius: '40%',
//                 borderBottomRightRadius: '40%',
//                 ease: Circ.easeIn
//             }, '-=.01')
//             .to(markerNode, {
//                 y: -10,
//                 scaleY: 1,
//                 duration: .1,
//                 transformOrigin: 'center center',
//                 borderBottomLeftRadius: '0',
//                 borderBottomRightRadius: '0',
//                 ease: Circ.easeOut
//             }, )
//             .to(markerNode, {
//                 y: 0,
//                 duration: .1,
//                 ease: Circ.easeIn
//             })
//     }
//     render() {
//         let { list, loaded, holiday, map } = this.props;
//         const loading = !loaded && list.length < 1;
//         const bounceEvent = this.bounceAnimation;
//         const moveToMarker = this.moveToMarker;
//         list = loaded ? list : new Array(20).fill({});
//         function isEmpty (obj: any): boolean {
//             return Object.keys(obj).length === 0;
//         }
//         function parseOpeningHours(pharmacy: PharmacyItemType|PharmacyData) {
//             const weekDay: number = holiday ? -1 : spacetime.now(TIMEZONE).day();
//             const dayName = dayNameMapper(weekDay);
//             // @ts-ignore
//             let opening: string = pharmacy[dayName]?.opening;
//             // @ts-ignore
//             let closing: string = pharmacy[dayName]?.closing;
//             if (!opening || !closing) return `${humanizeDayName(dayName)}은 영업하지 않습니다.`;
//             let closingHours = parseInt(closing.split(':')[0]);
//             closing = (closingHours > 23 ? closingHours - 24 : closingHours).toString().padStart(2, '0') + `:${closing.split(':')[1]}`;
//             return `${opening} ~ ${closing}`;
//         }
//         return (
//             <div className="infinite-container">
//                 <List
//                     className="infinite-item"
//                     itemLayout="horizontal"
//                     dataSource={list}
//                     renderItem={(item: PharmacyItemType|PharmacyData, idx: number) => (
//                         <List.Item
//                             key={`pharmacy-${idx}`}
//                             style={{ padding: '1rem', opacity: !isEmpty(item) && item.isOpen(holiday) ? 1 : .5}}
//                             onMouseEnter={() => {
//                                 if (!isEmpty(item)) {
//                                     bounceEvent(item);
//                                 }
//                             }}
//                             onClick={moveToMarker(item, map)}
//                         >
//                             <Skeleton avatar title={false} loading={loading} active>
//                                 <List.Item.Meta
//                                     // avatar={<MehOutlined style={{ fontSize: '1.75em' }} />}
//                                     title={item ? item.name : false}
//                                     description={item ? parseOpeningHours(item) : false}
//                                 />
//                             </Skeleton>
//                         </List.Item>
//                     )}
//                 >
//                 </List>
//             </div>
//         )
//     }
// }