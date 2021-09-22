import React, {Component} from "react";
import {List, Skeleton} from "antd";
import {MehOutlined} from "@ant-design/icons";

import Pharmacy from "../core/pharmacies";


type PharmacyItemType = Pharmacy & { loading?: boolean };

interface PharmacyProps {
    list: Pharmacy[],
}

export default class PharmacyItems extends Component<PharmacyProps> {
    render() {
        let { list } = this.props;
        const loading = list.length < 1;
        list = list.length ? list : new Array(20).fill({});
        return (
            <div className="infinite-container">
                <List 
                    className="infinite-item"
                    itemLayout="horizontal"
                    dataSource={list}
                    renderItem={(item: PharmacyItemType|undefined, idx: number) => (
                        <List.Item
                            key={`pharmacy-${idx}`}
                            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
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