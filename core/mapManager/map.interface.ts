export type MarkerOption = {
    latLng: any,
    label: string | undefined,
    disabled?: boolean,
    onClick?: () => any,
}

export interface mapInterface {
    module: any;
    mapDiv: HTMLDivElement | null;
    map: any;
    markers: any[];
    markerCluster: any;

    getInitOptions: () => { [key: string]: any };
    init: (module: any, mapDiv: HTMLDivElement) => void;

    getMarkerHtml: () => string;
    getMarkerClusterHtml: () => string;

    insertMarker: (props: MarkerOption) => void;
    insertCustomControl: (controlHtml: string, options: { position: number }, onClick: () => void) => any;
    clearMarkers: () => void;
    removeMarker: (marker: any) => void;
    setMarkerClustering: () => void;
    updateMarkerClustering: (markers: any[]) => void;
    getInfoWindowHtml: (marker: any) => string;
    createInfoWindow: (marker: any) => void;
    clearInfoWindow: (infoWindow: any) => void;
}