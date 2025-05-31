import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './map.css'

function MAP({coordinates}) {

  const mapRef = useRef()
  const mapContainerRef = useRef()
  
  useEffect(() => {
    if (!coordinates?.long || !coordinates?.lat) return;
    mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', 
      center: [coordinates.long, coordinates.lat], // starting position [lng, lat]
      zoom: 10
    });
    
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat([coordinates.long, coordinates.lat])
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<p>Exact Location will be provide after booking!</p>`)) 
.addTo(mapRef.current);

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id='map-container'  ref={mapContainerRef}></div>
  
    </>
  )
}

export default MAP