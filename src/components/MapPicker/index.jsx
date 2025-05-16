import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, Image } from "react-bootstrap";
import { uploadprofileimage } from "../../api/upload/uploadSlicer";
import tinntenLogo from "../../assets/char-logo.png"
import { GoogleMap, LoadScript, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';

export default function MapPicker({ lat, lng, radius, onLocationChange }) {
    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
    };

    const containerStyle = { width: '100%', height: '400px' };

    const { isLoaded } = useJsApiLoader({
        id: "script-loader",
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API,
        libraries: ["places"],
    });

    const handleClick = (e) => {
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();
        console.log("Tıklanan koordinat:", clickedLat, clickedLng);
        onLocationChange({ lat: clickedLat, lng: clickedLng, radius });
    };

    if (!isLoaded) return <div>Harita yükleniyor...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={handleClick}
        >
            <Marker position={center}
                draggable={true}
                onDragEnd={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    onLocationChange({ lat, lng, radius });
                }} />

            {/* Radius tanımlıysa ve pozitifse Circle çiz */}
            {radius > 0 && (
                <Circle
                    center={center}
                    radius={radius * 1000}
                    options={{
                        fillColor: '#2196F3',
                        fillOpacity: 0.2,
                        strokeColor: '#2196F3',
                        strokeWeight: 1,
                    }}
                />
            )}
        </GoogleMap>
    );
}