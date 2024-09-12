import { useState } from 'react';
import './App.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import countries from './assets/countries.json'
import UiOverlay from './UiOverlay';

function App() {
  const [countryCodeA, setCountryCodeA] = useState("")
  const [countryCodeB, setCountryCodeB] = useState("")
  const [date, setDate] = useState(new Date())

  const delta = 6
  let startX: number
  let startY: number

  return (
    <div>
      <div id="ui-overlay">
        <UiOverlay date={date} setDate={setDate}/>
      </div>
      <div onMouseDown={(event) => {
        startX = event.pageX;
        startY = event.pageY;
      }}
        onMouseUp={(event) => {
          const diffX = Math.abs(event.pageX - startX);
          const diffY = Math.abs(event.pageY - startY);
          startX = event.pageX;
          startY = event.pageY;
          if (diffX < delta && diffY < delta) {
            setCountryCodeA("")
            setCountryCodeB("")
          }
        }}

      >
        <MapContainer center={[20, 10]} zoom={2.2} id="map" maxBounds={[[-60, -300], [80, 300]]}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            minZoom={2}
            noWrap={true}
          />
          {/* @ts-ignore */}
          <GeoJSON data={countries as GeoJSON.FeatureCollection} style={function (geoJsonFeature: GeoJSON.Feature) {
            if (!geoJsonFeature.properties) {
              throw Error("GeoJSONFeature properties are null")
            }
            let cc = geoJsonFeature.properties.ISO_A3
            return {
              fillColor: cc === countryCodeA ? "#fff" : cc === countryCodeB ? "#000" : "#2c7fb8",
              color: "#f20b0b",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.55
            }
          }}

            onEachFeature={(feature, layer) => {
              layer.on('mouseover', function (e) {
                e.target.setStyle({
                  fillOpacity: 0.8
                });
              });
              layer.on('mouseout', function (e) {
                e.target.setStyle({
                  fillOpacity: 0.55
                });
              });
              layer.on('click', e => {
                let cc = e.target.feature.properties.ISO_A3
                setCountryCodeA(prev => {
                  if (!prev) {
                    return cc;
                  } else if (prev !== cc) {
                    setCountryCodeB(cc);
                  }
                  return prev;
                });
                e.originalEvent.stopPropagation()
              })
              layer.on('mousedown', e => {
                e.originalEvent.stopPropagation()
              })
            }} />
        </MapContainer>
      </div>
    </div>

  );
}

export default App;
