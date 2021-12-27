export interface LatLngInterface {

    new (lat: number, lng: number): this;
    lat: () => number;
    lng: () => number;
    clone: () => this;
    destinationPoint: (angle: number, meter: number) => this;
    equals: (latLng: this) => boolean;
    toString: () => string;

    toPoint: () => "Point";
}
