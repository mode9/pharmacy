import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    height: 100%;
    overscroll-behavior: none;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  p {margin: 0}

  * {
    box-sizing: border-box;
  }
  *:focus-visible {outline: none;}

  #__next,
  #__next > div:first-child {
    height: 100%;
  }
  #map {width: 100%; height: 100%;}
  
  #geolocation-container > .spinner {
    position: absolute;
    width: 120px;
    top: 0;
    right: 0;
    background: #fff;
    border-radius: 16px;
  }
  #geolocation-container.loading > .spinner {
    display: flex !important;
  }
  #find-near-container.active { display: block; }

  .marker__root.active .marker__outer_anchor { transform: scale(2) }
`;
