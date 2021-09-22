import {Button, Tooltip} from "antd";
import { RedoOutlined } from '@ant-design/icons';
import { Component, MouseEventHandler } from 'react';


interface FindNearestProps {
    boundsChanged: boolean;
    event: MouseEventHandler;
}

export default class FindNearest extends Component<FindNearestProps> {
    render() {
        const { boundsChanged, event } = this.props;
        return (
            <Tooltip title="현 위치 인근의 약국을 검색합니다.">
                <Button
                    id="findnearest"
                    type="primary"
                    shape="round"
                    icon={<RedoOutlined />}
                    size="large"
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '45%',
                        zIndex: 10000,
                        display: boundsChanged ? 'inline-block' : 'none',
                    }}
                    onClick={event}
                >
                    현 위치에서 검색
                </Button>
            </Tooltip>
        )
    }
}
