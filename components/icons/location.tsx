import {Svg} from "../map/controls/_base";
import {StyledProps} from "styled-components";


export const Location = ({width, height, ...attr}: StyledProps<any>) => {
    console.log(attr)
    return (
        <Svg aria-hidden="true" role="img" viewBox="0 0 24 24" width={width} height={height} fill="currentColor" {...attr}>
            <path d="M12 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
            <path fillRule="evenodd"
                  d="M19.071 3.429C15.166-.476 8.834-.476 4.93 3.429c-3.905 3.905-3.905 10.237 0 14.142l.028.028 5.375 5.375a2.359 2.359 0 003.336 0l5.403-5.403c3.905-3.905 3.905-10.237 0-14.142zM5.99 4.489A8.5 8.5 0 0118.01 16.51l-5.403 5.404a.859.859 0 01-1.214 0l-5.378-5.378-.002-.002-.023-.024a8.5 8.5 0 010-12.02z"/>
        </Svg>
    );
}