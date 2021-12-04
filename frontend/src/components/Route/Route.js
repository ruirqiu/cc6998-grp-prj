import React from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './Route.css'
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Route({ routeItems }) {
  var summary_text = "Total Price: "+routeItems.total_price_dollar+"    | Total Distance: "+routeItems.total_distance_mile + "     | Total Travel Time: "+ routeItems.total_duration_min

  var map_url = "<iframe width='800' height='600' frameborder='0' style='border:0' src = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyD1UW22TBdaFcgSdVY70_cyYA_OXIQ-sFo&origin=40.777523,-73.987952&destination=40.777523,-73.987952&waypoints=40.758052,-73.985552|40.729552,-73.996552&mode=walking' allowfullscreen></iframe>"
  const handleApiLoaded = (map, maps) => {
      
  // use map and maps objects
};
    
    
  return (
    <>
    <div>{summary_text}</div>  
    <Box className='routeResult'>
       <nav aria-label="secondary mailbox folders">
          <List>
             {routeItems.route_details.map(function (d, idx) {
              var idx_text="Stop "+(idx+1)+":     "+ (d.brand_name);
              var name_text="Store Location: "+ (d.store_name);
              var geo_text="Latittude: "+ (d.lat) + "     Longitutde: "+ (d.lon);
             return (
             <React.Fragment key={`listitem-${idx}`}>
                <ListItem disablePadding>
                   <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                   <ListItemText style={{ marginRight: '50px' }} primary={idx_text} />
                   <ListItemText secondary={name_text} />
                   <ListItemText secondary={geo_text} />
                   <ListItemText primary="The following items are purchased here:" />
                     {d.purchased_here.map(function (i, idx_i) {
                        var idx_i_text="Item "+(idx_i+1)+":    "+ (i.item_id)+ "    $"+i.price;
                        return (
                        <React.Fragment key={`listitem-${idx_i}`}>
                                           <small> {idx_i_text} </small>
                                        <Divider />
                                     </React.Fragment>
                                     )
                                     })}
                   </ListItemButton>
                </ListItem>
                <Divider />
             </React.Fragment>
             )
             })}
          </List>
       </nav>
    </Box>

    <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key:"AIzaSyD-osKueFGsLcxLXohmn8YR9UaujpvZn1g" }}
          defaultCenter={[40.777523,-73.987952]}
          defaultZoom={10}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          <AnyReactComponent
            lat={40.777523}
            lng={-73.987952}
            text="My Marker"
          />
        </GoogleMapReact>
    </div>
    </>
  );
}

export default Route;