export interface LatLngInterface {

    new (lat: number, lng: number): this;
    lat: () => number;
    lng: () => number;
    clone: () => this;
    destinationPoint: (angle: number, meter: number) => this;
    equals: (latLng: this) => boolean;
    toString: () => string;
    x: number;
    y: number;

    toPoint: () => "Point";
}

export type LatLngObjectLiteral = {
    lat: number;
    lng: number;
}

export type NaverBounds = {
    sw: LatLngInterface;
    ne: LatLngInterface;

    hasLatLng: (latlng: LatLngInterface|LatLngObjectLiteral) => boolean;
    getCenter: () => LatLngInterface;
    equals: (bounds: NaverBounds) => boolean;
}
