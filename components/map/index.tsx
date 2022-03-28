import {renderToString} from "react-dom/server";
import React, {useEffect, useRef, useState} from "react";
import {Info} from "css.gg/icons/tsx/Info";
import styled from "styled-components";
import Script from "next/script";
import Pharmacy, {filterPharmacies} from "../../core/pharmacies";
import InfoControl from "./controls/info";
import LocationControl, {GeolocationHandler} from "./controls/location";
import FindNear from './controls/findNear';
import Spinner from "../spinner";
import {NaverMap} from "../../core/mapManager/naver";
import {useTransition} from '@react-spring/web';
import Modal from "../modal";
import {useSelector, useStore} from "react-redux";
import {State, pharmacyFilterType, SelectorState} from "../../core/reducers/types";
import {filterChanged} from "../../core/reducers/pharmacies";
import {selectPharmacy} from "../../core/reducers/selector";
import {RootState} from "../../core/reducers";
import PharmacyDetailModal from "./PharmacyDetail";
import InfoWindowModal from "./infoWindow";

const infoControlHtml = renderToString(<InfoControl />);
const locationControlHtml = renderToString(<LocationControl />)
const nearControlHtml = renderToString(<FindNear />);

interface MapOptions {
    // data: Pharmacy[];
    naverKey: string | undefined;
    filterInBounds: boolean;
    disableClosed: boolean;
    // isHoliday?: boolean;
    // onIdle: (pharmacies: Pharmacy[], center: any) => void;
}



const MapComponent = ((props: MapOptions): React.ReactElement=> {
    const mapRef = useRef<HTMLDivElement>(null);
    const store = useStore();
    const [mapLoading, setMapLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const [moduleLoaded, setModuleLoaded] = useState(false);
    const [mapManager] = useState<NaverMap>(new NaverMap());
    const [modalVisible, setModalVisible] = useState(false);

    const state = useSelector<RootState, State>(state => state.pharmacies);
    const selectorState = useSelector<RootState, SelectorState>(state => state.selector);
    const selectedPharmacy = selectorState.selected ? new Pharmacy(selectorState.selected) : undefined;
    const pharmacies = state.pharmacies;
    const pharmaciesInBounds = filterPharmacies(pharmacies.map(row => new Pharmacy(row)), state.filters);
    const isHoliday = state.filters.isHoliday || false;
    const selectTransitions = useTransition(selectedPharmacy , {
        from: { opacity: 0, transform: "translateY(-40px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-40px)" }
    });

    if (!props.naverKey) throw new Error();

    function handleModuleOnLoad (): void {
        console.log('module loaded')
        setModuleLoaded(true);
    }
    function handleModuleOnError (): void {
        alert('module loaded failed');
    }
    function hasModuleLoaded (): boolean {
        return moduleLoaded && window?.naver;
    }

    function updateMarkers (): void {
        // let pharmaciesInBounds: Pharmacy[] = [];

        mapManager.clearMarkers();
        for (let i=0; i < pharmaciesInBounds.length; i++) {
            const pharmacy = pharmaciesInBounds[i];
            const latlng = mapManager.getLatLng(pharmacy.x, pharmacy.y);
            mapManager.insertMarker({
                latLng: latlng,
                label: pharmacy.name,
                disabled: !pharmacy.isOpen(state.filters.isHoliday),
                id: pharmacy.id,
                onClick: handleClickMarker,
            })
        }
        // pharmaciesInBounds = pharmaciesInBounds.sort((a, b) => {
        //     const center = mapManager.getCenter();
        //     const aDistance = distance(a.x, a.y, center.x, center.y);
        //     const bDistance = distance(b.x, b.y, center.x, center.y);
        //     return aDistance > bDistance ? 1 : aDistance < bDistance ? -1 : 0;
        // });`
        // setPharms(pharmaciesInBounds);
        // props.onIdle && props.onIdle(pharmaciesInBounds, mapManager.getCenter());
    }

    function handleClickMarker (this: any): void {
        clearActiveMarkers();
        const outerAnchorNode = this.getElement().firstElementChild;
        outerAnchorNode.classList.add('active');
        handleSelectPharmacy(this.id);
        // if (this.infoWindow) {
        //     if (this.infoWindow.getMap()) {
        //         this.infoWindow.close();
        //     } else {
        //         this.infoWindow.open(this.getMap(), this);
        //     }
        // } else {
        //     this.infoWindow = mapManager.createInfoWindow(this);
        //     this.infoWindow.open(this.getMap(), this);
        // }
    }

    function handleClickNear (this: any): void{
        // const findNearContainerNode = this.getElement().firstElementChild;
        // findNearContainerNode?.classList.remove('active');
        this.setMap(null);
        updateFilters({bounds: mapManager.getBounds()});
        updateMarkers();

        mapManager.updateMarkerClustering(mapManager.markers);
        mapManager.markerCluster._redraw();
    }

    function handleClickGeolocation (this: any): void {
        const geolocationHandler = new GeolocationHandler(mapManager);
        const containerNode = this.getElement().firstElementChild;

        if (containerNode?.classList.contains('loading')) return;
        containerNode?.classList.add('loading');
        geolocationHandler.moveTo()
            .then(() => {
                console.log('geolocation ended');
                containerNode?.classList.remove('loading');
                const _findNearController = mapManager.controls.find(control => control.name === 'findNear');
                _findNearController?.getElement().firstElementChild.click();

            });
    }

    function handleSelectPharmacy(pharmacyId: number) {
        store.dispatch(selectPharmacy(pharmacies.find(row => row.id === pharmacyId) || null));

    }

    function clearSelectedPharmacy() {
        // if (!selectedPharmacy) return;
        setModalVisible(false);
        // setSelectedPharmacy(null);
        store.dispatch(selectPharmacy(null));
    }

    function handleClickInfo (this: any) {
        setModalVisible(true);
    }

    function clearActiveMarkers () {
        document.querySelectorAll('.marker__root.active').forEach((el) => {
            el.classList.remove('active');
        });
        clearSelectedPharmacy();
    }

    function handleInitMap () {
        const _findNearController = mapManager.insertCustomControl(nearControlHtml, {position: mapManager.module.maps.Position.BOTTOM_CENTER, hidden: true}, handleClickNear);
        const _infoController = mapManager.insertCustomControl(infoControlHtml, {position: mapManager.module.maps.Position.TOP_LEFT}, handleClickInfo);
        const _locController = mapManager.insertCustomControl(locationControlHtml, {position: mapManager.module.maps.Position.TOP_LEFT}, handleClickGeolocation);
        _findNearController.name = 'findNear';
        _infoController.name = 'info';
        _locController.name = 'geolocation';
        // updateMarkers();

        window.naver.maps.Event.addListener(mapManager.map, 'click', clearActiveMarkers);
        window.naver.maps.Event.addListener(mapManager.map, 'bounds_changed', handleBoundsChanged.bind(_findNearController));
        window.naver.maps.Event.addListener(mapManager.map, 'idle', handleIdle);
        mapManager.setMarkerClustering();
        setMapLoading(false);
        const bounds = mapManager.getBounds();
        updateFilters({bounds});
    }

    function handleBoundsChanged (this: any) {
        const displayFindNearThrottle = 14;
        const zoom = mapManager.map.getZoom();
        if (!this.getMap()) this.setMap(mapManager.map)
        // this.setMap(zoom >= displayFindNearThrottle ? mapManager.map : null);
        clearActiveMarkers();
        // if ()
        // findNearContainerNode.classList.toggle('active', zoom >= displayFindNearThrottle);
    }
    function updateFilters (filters: pharmacyFilterType) {
        console.log('updating filter', filters);
        store.dispatch(filterChanged(filters));
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
    }, [moduleLoaded, initialized]);

    useEffect(() => {
        if (!mapLoading) {
            updateMarkers();
            mapManager.updateMarkerClustering(mapManager.markers);
            mapManager.markerCluster._redraw();
        }

    }, [state.filters])

    return (
        <>
            <Script
                src={`//openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${props.naverKey}&submodules=drawing`}
                strategy="lazyOnload"
                onLoad={handleModuleOnLoad}
                onError={handleModuleOnError}
            />
            {mapLoading && <Spinner />}
            <div id="map" ref={mapRef} >
                <InfoWindowModal visible={modalVisible} onClose={() => setModalVisible(false)} />
                <PharmacyDetailModal pharmacy={selectedPharmacy} isHoliday={isHoliday} onClose={clearSelectedPharmacy} />
            </div>


        </>
    )
})
// MapComponent.displayName = "MapComponent";

export default MapComponent;