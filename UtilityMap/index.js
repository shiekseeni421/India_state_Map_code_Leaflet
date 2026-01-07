"use client";

import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
import "leaflet/dist/leaflet.css";

const indiaBounds = [
  [6.0, 68.0],
  [36.0, 98.0],
];

const utilityData = {
  electricity: {
    "Andhra Pradesh": 85,
    "Arunachal Pradesh": 45,
    Assam: 60,
    Bihar: 52,
    Gujarat: 95,
    Karnataka: 88,
    Kerala: 99,
    Maharashtra: 92,
    Orissa: 65,
    "Tamil Nadu": 98,
    "Uttar Pradesh": 70,
    "West Bengal": 82,
    Rajasthan: 75,
    "Madhya Pradesh": 68,
    Punjab: 90,
    Haryana: 89,
  },
  water: {
    "Andhra Pradesh": 70,
    Gujarat: 80,
    Karnataka: 75,
    Kerala: 95,
    Maharashtra: 85,
    Orissa: 50,
    "Tamil Nadu": 90,
    "West Bengal": 60,
  },
};

const getColor = (value) => {
  return value > 80
    ? "#7c1608ff"
    : value > 60
    ? "#c47916ff"
    : value > 40
    ? "#1821acff"
    : value > 20
    ? "#2781d4ff"
    : "#183488ff";
};

export default function IndiaMap({ indiaGeoJson }) {
  const [utility, setUtility] = useState("electricity");
  const geoJsonRef = useRef();

  const style = (feature) => {
    const stateName = feature.properties.NAME_1;
    const value = utilityData[utility][stateName] || 0;
    return {
      fillColor: getColor(value),
      weight: 1.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.NAME_1;
    const value = utilityData[utility][stateName] || 0;

    // This adds the percentage label that appears on hover
    layer.bindTooltip(
      `<div style="text-align:center;">
        <strong>${stateName}</strong><br/>
        <span style="font-size: 1.2em; color: #08306b;">${value}%</span>
      </div>`,
      { sticky: true, direction: "top", opacity: 0.9 }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 3, color: "#333", fillOpacity: 0.9 });
        l.bringToFront();
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
        p: 2,
        border: "1px solid #eaeaea",
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Utility Statistics</InputLabel>
          <Select
            value={utility}
            label="Utility Statistics"
            onChange={(e) => setUtility(e.target.value)}
          >
            <MenuItem value="electricity">Electricity Coverage</MenuItem>
            <MenuItem value="water">Tap Water Access</MenuItem>
          </Select>
        </FormControl>

        {/* Legend Box */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {[0, 20, 40, 60, 80].map((val) => (
            <Box
              key={val}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  bgcolor: getColor(val + 1),
                  borderRadius: "2px",
                }}
              />
              <Typography variant="caption">{val}%+</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          height: "600px",
          width: "100%",
          bgcolor: "#f8f9fa",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          minZoom={4.5}
          maxBounds={indiaBounds}
          maxBoundsViscosity={1.0}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

          <GeoJSON
            data={indiaGeoJson}
            style={style}
            onEachFeature={onEachFeature}
            ref={geoJsonRef}
          />
        </MapContainer>
      </Box>
    </Paper>
  );
}
