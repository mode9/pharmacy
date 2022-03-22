import {PharmacyData} from "../types";
import {LatLngInterface} from "./types";

export function distance (lat1: number, lng1: number, lat2:number, lng2:number): number {
    // in Kilometers
    let radlat1 = Math.PI * lat1 / 180;
    let radlat2 = Math.PI * lat2 / 180;
    let theta = lng1 - lng2;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return dist;
}

export function humanizeDistance (lat1: number, lng1: number, lat2:number, lng2:number): string {
    const dist = distance(lat1, lng1, lat2, lng2);
    if (dist > 1) {
        return dist.toFixed(1) + 'km';
    } else {
        return (Math.ceil((dist * 1000) / 100) * 100).toString() + 'm';
    }
}

export const sortWithDistance = (pharmacies: PharmacyData[], center: LatLngInterface) => {
    return pharmacies.sort((a, b) => {
        const aDistance = distance(a.x, a.y, center.x, center.y);
        const bDistance = distance(b.x, b.y, center.x, center.y);
        return aDistance > bDistance ? 1 : aDistance < bDistance ? -1 : 0;
    });
}