import {mapboxgl} from 'mapbox-gl'
export const displayMap = locations => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiamFuaXNobmVoeWFuMDMiLCJhIjoiY2t0YXlpdWZlMWs1bjJ1cGMxZDltN3hzeiJ9.pBorchZzN28cBWovhnm_xQ';
  
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/janishnehyan03/cktdnr4xz1igs18swz37mwb47',
      scrollZoom: true
      // center: [-118.113491, 34.111745],
      // zoom: 10,
      // interactive: false
    });
  
    const bounds = new mapboxgl.LngLatBounds();
  
    locations.forEach(loc => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker';
  
      // Add marker
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(loc.coordinates)
        .addTo(map);
  
      // Add popup
      new mapboxgl.Popup({
        offset: 30
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
  
      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });
  
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  };