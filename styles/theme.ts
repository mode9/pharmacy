import { DefaultTheme } from "styled-components";

interface MediaTheme {
    small: string;
    medium: string;
    large: string;
}

interface MyTheme extends DefaultTheme {
    media: MediaTheme;
}

export const theme: MyTheme = {
    media: {
        small: "@media screen and (min-width: 320px)",
        medium: "@media screen and (min-width: 600px)",
        large: "@media screen and (min-width: 1136px)"
    }
}
