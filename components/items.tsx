import React, {Component} from "react";
import {Button, List, Skeleton} from "antd";
import {MehOutlined} from "@ant-design/icons";
import {PharmacyAPIResult} from '../pages/api/pharmacies';

import type {PharmacyData} from "../core/types";
import Pharmacy from "../core/pharmacies";
import LoadMore from './loadMore';
import { savePharmacyData } from '../core/utils';

const http = require('http');


type PharmacyItemType = Pharmacy & { loading?: boolean };

interface PharmacyProps {}

interface PharmacyState {
    data: Pharmacy[];
    list: PharmacyItemType[];
    initLoading: boolean;
    loading: boolean;
    hasMore: boolean;
    page: number;
    kakao: any;
    // [key: string]: any;
}

export default class PharmacyItems extends Component<PharmacyProps, PharmacyState> {
    state = {
        data: [],
        list: [],
        initLoading: true,
        loading: false,
        hasMore: true,
        page: 0,
        kakao: null,
    }
    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                initLoading: false,
                data: res.data,
                list: res.data,
            })
        })
        const { kakao } = window as any;
        this.setState({kakao});
    }
    fetchData = (callback: (data: PharmacyAPIResult) => void) => {
        const pageNum: number = this.state.page + 1;
        fetch(`http://localhost:3000/api/pharmacies?page=${pageNum}`)
            .then(res => res.json())
            .then(jsonResponse => {
                
                if (jsonResponse.meta.status != 200) {
                    console.error(jsonResponse);    
                }
                this.setState({page: jsonResponse.meta.pageNum})
                callback(jsonResponse);
            })

    }
    updateCoords = (id: string, coords: {x: number, y: number}) => {
        const data = JSON.stringify(coords);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/__update_coords/${id}}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }

        }
        const req = http.request(options, (res: any) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', (d: any) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error: any) => {
            console.error(error);
        })
        req.write(data);
        req.end();
    }
    onLoadMore = () => {
        const itemData: Pharmacy[] = this.state.data;
        let arrList = [...new Array(10)].map(() => ({loading: true}));
        this.setState({
            loading: true,
            list: itemData.concat(arrList),
        });
        this.fetchData(res => {
            const data = itemData.concat(res.data);
            this.setState({
                data,
                list: data,
                loading: false,
            },
            () => {
                window.dispatchEvent(new Event('resize'));
            })
        })
    }

    render() {
        const { initLoading, loading, kakao } = this.state;
        const list: PharmacyItemType[] = this.state.list;
        const loadMore = !initLoading && !loading ? <LoadMore callback={this.onLoadMore} /> : null;
        const geocoder = kakao ? new kakao.maps.services.Geocoder() : null;

        if (geocoder && kakao) {
            const arrNonCoords = list.filter((object) => !object.x || !object.y)
            for (let i=0; i < arrNonCoords.length; i++) {
                let item: PharmacyItemType = arrNonCoords[i];
                geocoder.addressSearch(item.address_road, (result: any, status: any) => {
                    const x: number = result[0].x;
                    const y: number = result[0].y;
                    const coords = new kakao.maps.LatLng(y, x);
                    var marker = new kakao.maps.Marker({
                        map: this.props.map,
                        position: coords,
                    });
                    // TODO: updateCoords
                });
            }
        }
        return (
            <div className="infinite-container">
                <List 
                    className="infinite-item"
                    loading={initLoading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={list}
                    renderItem={(item: PharmacyItemType, idx: number) => (
                        <List.Item
                            key={`pharmacy-${idx}`}
                            style={{ paddingLeft: '1rem' }}
                        >
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={
                                      <MehOutlined style={{ fontSize: '1.75em', marginTop: '8px' }} />
                                    }
                                    title={item.name}
                                    description={item.phone}
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