import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {onMarkerCLick} from '../actions/index';
import {getDrivers} from '../actions/index';
import {getOrders} from '../actions/index';
const MapComponent = withScriptjs(withGoogleMap((props) => {
  function createMapOptions() {
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: true,
      styles: [{ elementType: 'geometry', stylers: [{ color: '#f5f5f5'}]},
        { elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
        { elementType: 'labels.text.fill', stylers: [{color: '#616161'}]},
        { elementType: 'labels.text.stroke', stylers: [{color: '#f5f5f5'}]},
        { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
        {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#eeeeee'}]},
        {featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: '#757575'}]},
        {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#e5e5e5'}]},
        {featureType: 'poi.park', elementType: ' labels.text.fill', stylers: [{color: '#9e9e9e'}]},
        {featureType: 'road', elementType: 'geometry', stylers: [{color: '#ffffff'}]},
        {featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{color: '#757575'}]},
        {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#dadada'}]},
        {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{color: '#616161'}]},
        {featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{color: '#9e9e9e'}]},
        {featureType: 'transit.line', elementType: 'geometry', stylers: [{color: '#e5e5e5'}]},
        {featureType: 'transit.station', elementType: 'geometry', stylers: [{color: '#eeeeee'}]},
        {featureType: 'water', elementType: 'geometry', stylers: [{color: '#c9c9c9'}]},
        {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#9e9e9e'}]}]
    };
  }
  
  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={props.location}
      options={createMapOptions()}
    >
      {
        props.drivers && props.drivers.map((driver, index) => {
          if (driver) {
            return (
              <Marker
                key={index}
                onClick={() =>{props.getOrders(driver);
                  props.onMarkerClick(driver)}}
                position={{ lat: Number(driver.lat), lng: Number(driver.lng) }}
                icon={{
                  path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759,c3.116,0,5.644-2.527,' +
                  '5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z,M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z,M32.618,10.773c-1.016,' +
                  '3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713,' +
                  'v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,' +
                  '40.882l2.218-3.336,h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z',
                  fillColor: 'black',
                  fillOpacity: 0.8,
                  strokeWeight: 0,
                  anchor: { x: 15, y: 80 },
                  scale: 0.5,
                  origin: { x: 0, y: 0 },
                  rotation: Number(driver.rotation),
                }}
              />
            );
          }
          
        })}
      
      {
        (props.markers || []).map((marker, index) => {
          return (
            <Marker
              key={index}
              position={{ lat:Number(marker.lat), lng:Number( marker.lng) }}
              icon={{
                path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759,c3.116,0,5.644-2.527,' +
                '5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z,M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z,M32.618,10.773c-1.016,' +
                '3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713,' +
                'v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,' +
                '40.882l2.218-3.336,h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z',
                fillColor: 'blue',
                fillOpacity: 0.8,
                strokeWeight: 0,
                anchor: { x: 15, y: 80 },
                scale: 0.5,
                origin: { x: 0, y: 0 },
                rotation: Number(marker.rotation),
              }}
            />
          );
        })}
    </GoogleMap>
  )
}));
const MapsApiKey = 'AIzaSyCvGrttld5OSQ6FYjlzZOa977VoMPBa2Io';
const location = {
  lat: 34.1479130,
  lng: -118.2491390,
};

class Map extends Component {
  componentWillMount() {
    this.props.getDrivers();
    
  }
  render() {
    return (
      
      <MapComponent
        isMarkerShown
        location={location}
        drivers={this.props.drivers}
        markers={this.props.markers}
        onMarkerClick={(driver) => this.props.onMarkerClick(driver)}
        getOrders={(driver) => this.props.getOrders(driver)}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${MapsApiKey}`}
        loadingElement={<div  style={{ height: '100%', width: '100%'  }} />}
        containerElement={<div  style={{ height: '100%', width: '100%'
            , position:'absolute',top:0+'px', left: 0+'px'
        }} />}
        mapElement={<div  style={{ height: '100%', width: '100%' ,position:'absolute',overflow:'auto'}} />}
      />
    );
  }
}
function mapSteteToProps(state) {
  return {
    drivers: state.drivers,
    markers:state.markers,
  };
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({onMarkerClick:onMarkerCLick, getDrivers,getOrders:getOrders},dispatch);
}
export default connect(mapSteteToProps,mapDispatchToProps)(Map);
