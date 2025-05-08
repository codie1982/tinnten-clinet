import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, Image } from "react-bootstrap";
import { uploadprofileimage } from "../../api/upload/uploadSlicer";
import tinntenLogo from "../../assets/char-logo.png"
import { GoogleMap, LoadScript, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';

export default function MapPicker({ lat, lng, radius, onLocationChange }) {
    const dispatch = useDispatch();
    const center = { lat, lng };
    const containerStyle = { width: '100%', height: '400px' };
    const { isLoaded } = useJsApiLoader({
        id: "google-maps-script", // default
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API,
        libraries: ["places"], // daima sabit
    });

    const handleClick = (e) => {
        onLocationChange({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            radius
        });
    };
    console.log("isLoaded", isLoaded)
    if (!isLoaded) return <div>Harita yükleniyor...</div>;

    return (
        <LoadScript googleMapsApiKey={"AIzaSyCwnvGupv6Qy6fd_fC6gm3y_Qugl_sV8yE"}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onClick={handleClick}
            >
                <Marker position={center} />
                <Circle
                    center={center}
                    radius={radius * 1000}
                    options={{
                        fillColor: '#2196F3',
                        fillOpacity: 0.2,
                        strokeColor: '#2196F3',
                        strokeWeight: 1
                    }}
                />
            </GoogleMap>
        </LoadScript >
    );
};