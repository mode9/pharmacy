import {renderToString} from "react-dom/server";
import React, {useEffect, useRef, useState} from "react";
import Script from "next/script";
import Pharmacy from "../../core/pharmacies";
import styled from "styled-components";

import {SpinnerTwoAlt} from "css.gg/icons/all";
import InfoControl from "./controls/info";
import LocationControl, {GeolocationHandler, moveToCurrentPosition} from "./controls/location";
import Marker from "./marker";
import initMarkerClustering from "./markerClustering/clustering";
import MarkerCluster from "./markerClustering";
import FindNearest from './controls/findNearest';

const infoControlHtml = renderToString(<InfoControl />);
const locationControlHtml = renderToString(<LocationControl />)
const nearestControlHtml = renderToString(<FindNearest />);
const clusterHtml = renderToString(<MarkerCluster />);

type MarkerOption = {
    latLng: any,
    label: string|undefined,
    disabled?: boolean,
    onClick?: () => any,
}

interface MapOptions {
    data: Pharmacy[];
    naverKey: string | undefined;
    filterInBounds: boolean;
    disableClosed: boolean;
    isHoliday?: boolean;
}

interface mapInterface {
    module: any;
    mapDiv: HTMLDivElement|null;
    map: any;
    markers: any[];
    markerCluster: any;

    getInitOptions: () => {[key: string]: any};
    init: (module: any, mapDiv: HTMLDivElement) => void;

    getMarkerHtml: () => string;
    getMarkerClusterHtml: () => string;

    insertMarker: (props: MarkerOption) => void;
    insertCustomControl: (controlHtml: string, options: {position: string}, onClick: () => void) => any;
    clearMarkers: () => void;
    removeMarker: (marker: any) => void;
    setMarkerClustering: () => void;
    updateMarkerClustering: (markers: any[]) => void;
}

class NaverMap implements mapInterface {
    module: any;
    mapDiv: HTMLDivElement | null;
    map: any;
    markers: any[];
    markerCluster: any;

    constructor() {
        this.module = null;
        this.mapDiv = null;
        this.markers = [];
        // this.getLatLng = this.getLatLng.bind(this);
        // this.setZoom = this.setZoom.bind(this);
        // this.addListenerOnce = this.addListenerOnce.bind(this);
        // this.panTo = this.panTo.bind(this);
    }

    getInitOptions = () => {
        const coords = [126.96072340180352, 37.54425411510226];
        return {
            center: this.module.maps.LatLng(coords[1], coords[0]),
            zoom: 14,
            useStyleMap: true,
            zoomControl: true,
            zoomControlOptions: {
                style: this.module.maps.ZoomControlStyle.SMALL,
                position: this.module.maps.Position.LEFT_CENTER
            },
            tileSpare: 1,
        }
    }

    getMarkerHtml = (disabled?: boolean, label?: string): string => {
        return renderToString(<Marker disabled={disabled} label={label} />);
    }

    getMarkerClusterHtml = () => {
        return clusterHtml;
    }

    getMarkerClusterIcon = () => {
        return {
            content: this.getMarkerClusterHtml(),
            size: this.module.maps.Size(40, 40),
            anchor: this.module.maps.Point(10, 20)
        }
    }

    init = (module: any, mapDiv: HTMLDivElement) => {
        this.module = module;
        this.mapDiv = mapDiv;
        // @ts-ignore
        this.map = new this.module.maps.Map(this.mapDiv, this.getInitOptions());
    }

    insertCustomControl = (controlHtml: string, options: {position: string}, onClick: (_controller?: any) => void): any => {
        if (!this.module || !this.map) {
            throw new Error('mapManager not initialized yet.');
        }
        const control = new this.module.maps.CustomControl(controlHtml, options);
        control.setMap(this.map);
        onClick && this.module.maps.Event.addDOMListener(control.getElement(), 'click', () => onClick(control));
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
                anchor: new this.module.maps.Point(10, 20)
            },
            title: props.label
        })
        marker.disabled = props.disabled;
        if (props.onClick) {
            this.module.maps.Event.addListener(marker, 'click', props.onClick)
        }
        this.markers.push(marker);
    }

    clearMarkers = () => {
        for (let i=0; i < this.markers.length; i++) {
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
            stylingFunction: function(clusterMarker: any, count: number|string, members: any[]) {
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

    getLatLng = (x: number, y: number): any => {
        return new this.module.maps.LatLng(x, y)
    }

    setZoom = (zoom: number): void => {
        this.map.setZoom(zoom, true);
    }

    addListenerOnce = (evt: string, callback: () => void) => {
        this.module.maps.Event.once(this.map, evt, callback);
    }

    panTo = (latlng: any) => {
        this.map.panTo(latlng);
    }
}

const MapComponent = React.forwardRef((props: MapOptions, ref): React.ReactElement=> {
    const mapRef = useRef<HTMLDivElement>(null);
    const [pharms, setPharms] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const [moduleLoaded, setModuleLoaded] = useState(false);
    const [mapManager, setMapManager] = useState<NaverMap>(new NaverMap());
    const [controller, setController] = useState();

    React.useImperativeHandle(ref, () => ({
        hasModuleLoaded: (): boolean => moduleLoaded,
        getPharmaciesInBounds: () => pharms,
    }))

    if (!props.naverKey) throw new Error();

    function handleModuleOnLoad (): void {
        console.log('module loaded')
        setModuleLoaded(true);
    }
    function handleModuleOnError (): void {
        alert('module loaded failed');
    }

    function handleClickMarker (seq: number): () => void {
        return () => {
            console.log(seq)
            console.log('marker clicked');
            console.log(mapManager.markers[seq]);
        }
    }

    function hasModuleLoaded (): boolean {
        return moduleLoaded && window?.naver;
    }

    function updateMarkers (): void {
        const mapBounds = mapManager.map.getBounds();
        let pharmaciesInBounds: Pharmacy[] = [];

        mapManager.clearMarkers();
        for (let i=0; i < props.data.length; i++) {
            const pharmacy = props.data[i];
            const latlng = new window.naver.maps.LatLng(pharmacy.y, pharmacy.x);
            if (mapBounds.hasLatLng(latlng)) {
                pharmaciesInBounds.push(pharmacy);
                mapManager.insertMarker({
                    latLng: latlng,
                    label: pharmacy.name,
                    disabled: !pharmacy.isOpen(props.isHoliday),
                    onClick: handleClickMarker(mapManager.markers.length),
                })
            }
        }
        setPharms(pharmaciesInBounds);
    }

    function handleClickNearest (_controller: any): void{
        _controller.getElement().firstElementChild.style.display = 'none';
        updateMarkers();
        mapManager.updateMarkerClustering(mapManager.markers);
        mapManager.markerCluster._redraw();
    }

    function handleInitMap (): void {
        const geolocationHandler = new GeolocationHandler(mapManager);
        mapManager.insertCustomControl(infoControlHtml, {position: mapManager.module.maps.Position.TOP_LEFT}, () => {});
        mapManager.insertCustomControl(locationControlHtml, {position: mapManager.module.maps.Position.TOP_LEFT}, geolocationHandler.moveTo);
        const control = mapManager.insertCustomControl(nearestControlHtml, {position: mapManager.module.maps.Position.BOTTOM_CENTER}, handleClickNearest);
        // setController(control);
        // mapManager.module.maps.Event.addListener(mapManager.map, "zoom_changed", (zoom: number) => {
        //
        // })
        updateMarkers();

        window.naver.maps.Event.addListener(mapManager.map, 'bounds_changed', handleBoundsChanged(control));
        window.naver.maps.Event.addListener(mapManager.map, 'idle', handleIdle);
        mapManager.setMarkerClustering();
        setLoading(false);
    }

    function handleBoundsChanged (_controller: any): () => void {
        return () => {
            console.log('bounds changed');
            const displayFindNearestThrottle = 14;
            const zoom = mapManager.map.getZoom();
            if (zoom < displayFindNearestThrottle && controller) {
                _controller.getElement().firstElementChild.style.display = 'none';
            } else {
                _controller.getElement().firstElementChild.style.display = 'block';
            }
        }
    }

    function handleIdle (): void {
        let visibleMarkers = []
        for (let i=0; i < mapManager.markers.length; i++) {
            const pos = mapManager.markers[i].getPosition();
            if (!mapManager.map.getBounds().hasLatLng(pos)) {
                mapManager.markers[i].setMap(null);
            } else {
                mapManager.markers[i].setMap(mapManager.map);
                visibleMarkers.push(mapManager.markers[i])
            }
        }
        mapManager.updateMarkerClustering(visibleMarkers);
    }

    useEffect(() => {
        if (!hasModuleLoaded() || !mapRef.current || initialized) return;
        const { naver } = window as any;

        mapManager.init(naver, mapRef.current);

        naver.maps.Event.once(mapManager.map, 'init_stylemap', handleInitMap)
        setInitialized(true);
    }, [moduleLoaded, pharms, props.isHoliday, props.filterInBounds]);

    const SpinnerWrapper = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F6F6F6;
    `;

    return (
        <>
            <Script
                src={`//openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${props.naverKey}&submodules=drawing`}
                strategy="lazyOnload"
                onLoad={handleModuleOnLoad}
                onError={handleModuleOnError}
            />
            {loading && (
                <SpinnerWrapper>
                    <SpinnerTwoAlt />
                </SpinnerWrapper>
            )}
            <div id="map" ref={mapRef} />

        </>
    )
})
MapComponent.displayName = "MapComponent";

export default MapComponent;