import {Button} from "antd";


type PropType = {
    callback: () => void,
};


function LoadMore(props: PropType) {
    return (
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            <Button onClick={props.callback}>loading more</Button>
        </div>
    )
}

export default LoadMore;