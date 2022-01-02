import { DefaultTheme } from "styled-components";

interface MediaTheme {
    small: string;
    medium: string;
    large: string;
}

interface ZIndex {
    zero: number;
    low: number;
    medium: number;
    high: number;
}

interface MyTheme extends DefaultTheme {
    media: MediaTheme;
    zIndex: ZIndex;
}

export const theme: MyTheme = {
    media: {
        small: "@media screen and (min-width: 320px)",
        medium: "@media screen and (min-width: 600px)",
        large: "@media screen and (min-width: 1136px)"
    },
    zIndex: {
        zero: 0,
        low: 100,
        medium: 1000,
        high: 10000,
    }
}
