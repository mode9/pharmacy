import React, {Component} from "react";
import {Button, List, Skeleton} from "antd";
import {MehOutlined} from "@ant-design/icons";
import {PharmacyAPIResult} from '../pages/api/pharmacies';

import Pharmacy from "../core/pharmacies";


type PharmacyItemType = Pharmacy & { loading?: boolean };

interface PharmacyProps {
    map: any;
    kakao: any;
}

interface PharmacyState {
    data: Pharmacy[];
    initLoading: boolean;
    // [key: string]: any;
}

export default class PharmacyItems extends Component<PharmacyProps, PharmacyState> {
    state = {
        data: new Array(20).fill({}),
        initLoading: true,
    }
    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                initLoading: false,
                data: res.data,
            })
        })

    }
    fetchData = (callback: (data: PharmacyAPIResult) => void) => {
        fetch(`http://localhost:3000/api/pharmacies`)
            .then(res => res.json())
            .then(jsonResponse => {
                
                if (jsonResponse.meta.status != 200) {
                    console.error(jsonResponse);    
                }
                callback(jsonResponse);
            })

    }

    render() {
        const { initLoading } = this.state;
        const { map, kakao } = this.props;
        let { data } = this.state;

        if (kakao && !initLoading) {
            const bounds = map.getBounds();
            data = data.filter((pharmacy: PharmacyItemType) => {
                const coords = new kakao.maps.LatLng(pharmacy.y, pharmacy.x);
                const inBound = bounds.contain(coords);
                if (inBound) {
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coords,
                    });
                }
                return inBound;
            })
        }
        return (
            <div className="infinite-container">
                <List 
                    className="infinite-item"
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item: PharmacyItemType|undefined, idx: number) => (
                        <List.Item
                            key={`pharmacy-${idx}`}
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                        >
                            <Skeleton avatar title={false} loading={initLoading} active>
                                <List.Item.Meta
                                    avatar={
                                      <MehOutlined style={{ fontSize: '1.75em', marginTop: '8px' }} />
                                    }
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