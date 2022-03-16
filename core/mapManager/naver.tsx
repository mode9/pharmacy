import {renderToString} from "react-dom/server";
import MarkerCluster from "../../components/map/markerClustering";
import React from "react";
import {mapInterface, MarkerOption} from "./map.interface";
import Marker from "../../components/map/marker";
import initMarkerClustering from "../../components/map/markerClustering/clustering";
import {LatLngInterface, NaverBounds} from "./types";
import InfoWindow from "../../components/map/infoWindow";

const clusterHtml = renderToString(<MarkerCluster/>);

export class NaverMap implements mapInterface {
    module: any;
    mapDiv: HTMLDivElement | null;
    map: any;
    markers: any[];
    markerCluster: any;
    controls: any[];

    constructor() {
        this.module = null;
        this.mapDiv = null;
        this.markers = [];
        this.controls = [];
    }

    getInitOptions = () => {
        const coords = [126.96072340180352, 37.54425411510226];
        return {
            center: this.getLatLng(coords[0], coords[1]),
            zoom: 14,
            useStyleMap: true,
            zoomControl: false,
            // zoomControlOptions: {
            //     style: this.module.maps.ZoomControlStyle.SMALL,
            //     position: this.module.maps.Position.LEFT_CENTER
            // },
            tileSpare: 1,
        }
    }

    getMarkerHtml = (disabled?: boolean, label?: string): string => {
        return renderToString(<Marker disabled={disabled} label={label}/>);
    }

    getMarkerClusterHtml = () => {
        return clusterHtml;
    }

    getMarkerClusterIcon = () => {
        return {
            content: this.getMarkerClusterHtml(),
            // size: this.module.maps.Size(40, 40),
            // anchor: this.module.maps.Point(10, 20)
        }
    }

    init = (module: any, mapDiv: HTMLDivElement) => {
        this.module = module;
        this.mapDiv = mapDiv;
        // @ts-ignore
        this.map = new this.module.maps.Map(this.mapDiv, this.getInitOptions());
    }

    insertCustomControl = (controlHtml: string, options: { position: number, hidden?: boolean }, onClick: () => void): any => {
        if (!this.module || !this.map) {
            throw new Error('mapManager not initialized yet.');
        }
        const control = new this.module.maps.CustomControl(controlHtml, options);
        control.setMap(options.hidden ? null : this.map);
        if (onClick) {
            this.module.maps.Event.addDOMListener(control.getElement(), 'click', onClick.bind(control));
        }
        this.controls.push(control);
        return control;
    }

    insertMarker = (props: MarkerOption) => {
        // @ts-ignore
        const marker = new this.module.maps.Marker({
            map: this.map,
            position: props.latLng,
            zIndex: 100,
            icon: {
                content: this.getMarkerHtml(props.disabled, props.label),
                anchor: new this.module.maps.Point(10, 20),
                // size: new this.module.maps.Size(18, 18)
            },
            title: props.label
        })
        marker.disabled = props.disabled;
        if (props.onClick) {
            this.module.maps.Event.addListener(marker, 'click', props.onClick.bind(marker));
        }
        this.markers.push(marker);
    }

    clearMarkers = () => {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i]?.setMap(null);
        }
        this.markers = [];
    }

    removeMarker = (marker: any) => {
        marker.setMap(null);
        this.markers = this.markers.filter((row) => (!row.getPosition().equals(marker.getPosition())));
    }

    setMarkerClustering = () => {
        this.markerCluster = initMarkerClustering(this.module, {
            minClusterSize: 2,
            maxZoom: 15,
            map: this.map,
            markers: this.markers,
            disableClickZoom: false,
            gridSize: 120,
            icons: [this.getMarkerClusterIcon()],
            indexGenerator: [10, 100, 200, 500, 1000],
            stylingFunction: function (clusterMarker: any, count: number | string, members: any[]) {
                const allDisabled = members.every((member: any) => member.disabled);
                let markerNode: HTMLElement = clusterMarker.getElement().firstElementChild.firstElementChild;

                if (allDisabled) {
                    markerNode.style.background = '#8D8D8D';
                }
                markerNode.innerText = count.toString();
            }
        })
    }

    updateMarkerClustering = (markers: any[]) => {
        this.markerCluster.setMarkers(markers);
    }

    getLatLng = (x: number, y: number): LatLngInterface => {
        return new this.module.maps.LatLng(y, x)
    }

    getBounds = (): NaverBounds => {
        return this.map.getBounds();
    }

    getCenter = (): LatLngInterface => {
        return this.map.getCenter();
    }

    addListenerOnce = (evt: string, callback: (value?: any) => void) => {
        this.module.maps.Event.once(this.map, evt, callback);
    }

    getZoom = (): number => {
        return this.map.getZoom();
    }

    setZoom = (zoom: number): Promise<null> => {
        return new Promise((resolve) => {
            this.addListenerOnce('idle', resolve);
            // @ts-ignore
            this.map.setZoom(zoom, true);
        })
    }

    panTo = (latlng: any): Promise<null> => {
        return new Promise((resolve) => {
            this.addListenerOnce('idle', resolve);
            this.map.panTo(latlng);
        });
    }

    getInfoWindowHtml = (marker: any): string => {
        return renderToString(<InfoWindow />);
    }

    createInfoWindow = (marker: any) => {
        return new this.module.maps.InfoWindow({content: this.getInfoWindowHtml(marker)});
    }

    clearInfoWindow = (infoWindow: any) => {
        infoWindow?.close();
    }
}