import {renderToString} from "react-dom/server";
import React, {useEffect, useRef, useState} from "react";
import {Info} from "css.gg/icons/tsx/Info";
import styled from "styled-components";
import Script from "next/script";
import Pharmacy from "../../core/pharmacies";
import InfoControl from "./controls/info";
import LocationControl, {GeolocationHandler} from "./controls/location";
import FindNear from './controls/findNear';
import Spinner from "../spinner";
import {NaverMap} from "../../core/mapManager/naver";
import {useTransition} from '@react-spring/web';
import Modal from "../modal";

const infoControlHtml = renderToString(<InfoControl />);
const locationControlHtml = renderToString(<LocationControl />)
const nearControlHtml = renderToString(<FindNear />);

interface MapOptions {
    data: Pharmacy[];
    naverKey: string | undefined;
    filterInBounds: boolean;
    disableClosed: boolean;
    isHoliday?: boolean;
    onLoaded: (pharmacies: Pharmacy[]) => void;
}
const TitleIcon = styled(Info)`
  vertical-align: middle;
  margin-right: 5px;
  display: inline-block;
`;

const Title = styled.h3`
  vertical-align: middle;
  display: inline-block;
  margin: 0;
`

const InfoModalBody = function () {
    return (
        <>
            <h4>약국 방문 전에 확인 전화를 권장드립니다.</h4>
            <p>
                <u>국립중앙의료원</u>에서 제공하는 심야운영약국 데이터를 기반으로 제작되었으며, 실제약국의 영업시간과는 다를 수 있습니다.
            </p>
        </>
    )
}

const MapComponent = React.forwardRef((props: MapOptions, ref): React.ReactElement=> {
    const mapRef = useRef<HTMLDivElement>(null);
    const [pharms, setPharms] = useState<Pharmacy[]>([]);
    const [mapLoading, setMapLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const [moduleLoaded, setModuleLoaded] = useState(false);
    const [mapManager] = useState<NaverMap>(new NaverMap());
    // const [findNearController, setFindNearController] = useState(null);
    // const [locController, setLocController] = useState(null);
    // const [infoController, setInfoController] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const transitions = useTransition(modalVisible, {
        from: { opacity: 0, transform: "translateY(-40px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-40px)" }
    });

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
                    onClick: handleClickMarker,
                })
            }
        }
        setPharms(pharmaciesInBounds);
        props.onLoaded && props.onLoaded(pharmaciesInBounds);
    }

    function handleClickMarker (this: any): void {
        console.log('marker clicked');
        clearActiveMarkers();
        const outerAnchorNode = this.getElement().firstElementChild;
        outerAnchorNode.classList.add('active');
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

    function handleClickInfo (this: any) {
        setModalVisible(true);
    }

    async function clearActiveMarkers () {
        document.querySelectorAll('.marker__root.active').forEach((el) => {
            el.classList.remove('active');
        })
    }

    function handleInitMap (): void {
        const _findNearController = mapManager.insertCustomControl(nearControlHtml, {position: mapManager.module.maps.Position.BOTTOM_CENTER, hidden: true}, handleClickNear);
        const _infoController = mapManager.insertCustomControl(infoControlHtml, {position: mapManager.module.maps.Position.TOP_LEFT}, handleClickInfo);
        const _locController = mapManager.insertCustomControl(locationControlHtml, {position: mapManager.module.maps.Position.TOP_LEFT}, handleClickGeolocation);
        _findNearController.name = 'findNear';
        _infoController.name = 'info';
        _locController.name = 'geolocation';
        updateMarkers();

        window.naver.maps.Event.addListener(mapManager.map, 'click', clearActiveMarkers);
        window.naver.maps.Event.addListener(mapManager.map, 'bounds_changed', handleBoundsChanged.bind(_findNearController));
        window.naver.maps.Event.addListener(mapManager.map, 'idle', handleIdle);
        mapManager.setMarkerClustering();
        setMapLoading(false);
    }

    function handleBoundsChanged (this: any) {
        const displayFindNearThrottle = 14;
        const zoom = mapManager.map.getZoom();
        this.setMap(zoom >= displayFindNearThrottle ? mapManager.map : null);
        clearActiveMarkers();
        // if ()
        // findNearContainerNode.classList.toggle('active', zoom >= displayFindNearThrottle);
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
                {transitions( ( styles, item ) =>
                    item && (
                        <Modal
                            style={styles}
                            closeModal={() => setModalVisible(false)}
                            title={<><TitleIcon /><Title>안내사항</Title></>}
                            body={<InfoModalBody />}
                        />
                    )
                )}
            </div>


        </>
    )
})
MapComponent.displayName = "MapComponent";

export default MapComponent;