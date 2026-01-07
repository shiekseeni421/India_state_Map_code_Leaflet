"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import { Box, Paper, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";

// Precise bounds to crop everything except India
const indiaBounds = [
  [6.5, 68.0],
  [36.0, 97.5],
];

// Data with 2025 state names
const utilityData = {
  utility: {
    "Andhra Pradesh": { value: 85, color: "#f36709ff" },
    Telangana: { value: 45, color: "#f1cb20ff" },
    Karnataka: { value: 88, color: "#57d80cff" },
    Kerala: { value: 99, color: "#c7a708ff" },
    "Tamil Nadu": { value: 98, color: "#0b46a0ff" },
    Puducherry: { value: 92, color: "#0b82a0ff" },
    Lakshadweep: { value: 95, color: "#c70909ff" },
    "Jammu and Kashmir": { value: 70, color: "#1cac23ff" },
    Ladakh: { value: 65, color: "#e91147ff" },
    "Himachal Pradesh": { value: 82, color: "#11a6e9ff" },
    Punjab: { value: 91, color: "#9ae260ff" },
    Haryana: { value: 89, color: "#25678dff" },
    Uttarakhand: { value: 78, color: "#14b99eff" },
    "Uttar Pradesh": { value: 72, color: "#bb2166ff" },
    Delhi: { value: 98, color: "#5611e9ff" },
    Chandigarh: { value: 96, color: "#11e988ff" },
    Rajasthan: { value: 75, color: "#e98d11ff" },
    Gujarat: { value: 95, color: "#155196ff" },
    Maharashtra: { value: 92, color: "#0eb47dff" },
    Goa: { value: 97, color: "#e9e911ff" },
    "Dadra and Nagar Haveli and Daman and Diu": {
      value: 88,
      color: "#11e911ff",
    },
    "Madhya Pradesh": { value: 68, color: "#e91111ff" },
    Chhattisgarh: { value: 64, color: "#1172e9ff" },
    Bihar: { value: 52, color: "#88e911ff" },
    Jharkhand: { value: 55, color: "#11e9a6ff" },
    Odisha: { value: 65, color: "#e9119dff" },
    "West Bengal": { value: 82, color: "#11d5e9ff" },
    "Andaman and Nicobar Islands": { value: 76, color: "#e9b011ff" },
    Sikkim: { value: 81, color: "#4711e9ff" },
    "Arunachal Pradesh": { value: 45, color: "#11e972ff" },
    Assam: { value: 60, color: "#e911ccff" },
    Nagaland: { value: 58, color: "#2de911ff" },
    Manipur: { value: 55, color: "#113ce9ff" },
    Mizoram: { value: 62, color: "#e95b11ff" },
    Tripura: { value: 67, color: "#11e92dff" },
    Meghalaya: { value: 59, color: "#b011e9ff" },
  },
};

export default function IndiaMap({ indiaGeoJson }) {
  const [utility] = useState("utility"); // Hardcoded based on your object structure
  const geoJsonRef = useRef();
  const mapRef = useRef();

  // Resize logic: Ensures map refits whenever the container or window resizes
  useEffect(() => {
    if (!mapRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        mapRef.current.fitBounds(indiaBounds);
      }
    });

    const mapContainer = document.querySelector(".leaflet-container");
    if (mapContainer) resizeObserver.observe(mapContainer);

    return () => resizeObserver.disconnect();
  }, []);

  const style = (feature) => {
    const stateName = feature.properties.shapeName || feature.properties.NAME_1;
    const stateEntry = utilityData[utility][stateName];

    return {
      fillColor: stateEntry ? stateEntry.color : "#cccccc",
      weight: 1,
      opacity: 1,
      color: "#999999",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.shapeName || feature.properties.NAME_1;
    const stateEntry = utilityData[utility][stateName];
    const value = stateEntry ? stateEntry.value : "N/A";

    layer.bindTooltip(
      `<div style="font-family: sans-serif;">
        <strong>${stateName}</strong><br/>
        Value: ${value}%
      </div>`,
      { sticky: true, direction: "top" }
    );

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: "#ffffff",
          fillOpacity: 0.9,
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        geoJsonRef.current.resetStyle(e.target);
      },
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 },
        bgcolor: "#e6ebf1ff",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          // Fluid height based on screen size
          height: { xs: "450px", sm: "600px", md: "700px" },
          width: "100%",
          bgcolor: "#ffffff",
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid #d1d9e2",
        }}
      >
        <MapContainer
          bounds={indiaBounds}
          zoomSnap={1}
          dragging={true} // Enabled for mobile touch panning
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          style={{ height: "100%", width: "100%", background: "transparent" }}
          ref={mapRef}
        >
          {indiaGeoJson && (
            <GeoJSON
              data={indiaGeoJson}
              style={style}
              onEachFeature={onEachFeature}
              ref={geoJsonRef}
            />
          )}
        </MapContainer>

        {/* Optional Title Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 15,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            India Utility Distribution
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
