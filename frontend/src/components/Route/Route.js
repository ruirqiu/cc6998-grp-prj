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
import { Wrapper, Status } from "@googlemaps/react-wrapper";


function Route({ routeItems }) {
  var summary_text = "Total Price: "+routeItems.total_price_dollar+"    | Total Distance: "+routeItems.total_distance_mile + "     | Total Travel Time: "+ routeItems.total_duration_min

  
  var origin = routeItems.geo_list[0][0]+","+routeItems.geo_list[0][1];
  var destination = routeItems.geo_list[0][0]+","+routeItems.geo_list[0][1];
  var waypoints = routeItems.geo_list[1][0]+","+routeItems.geo_list[1][1]
    for (let i = 2; i < routeItems.geo_list.length; i++) {
        waypoints += "|"+routeItems.geo_list[i][0]+","+routeItems.geo_list[i][1];
    }
    
  console.log(origin)
  console.log(waypoints)
  var map_url = "<iframe width='800' height='600' frameborder='0' style='border:0' src = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyD1UW22TBdaFcgSdVY70_cyYA_OXIQ-sFo&origin="+origin+"&destination="+destination+"&waypoints="+waypoints+"&mode=driving' allowfullscreen></iframe>";
   
    
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
    <div dangerouslySetInnerHTML={{ __html: map_url}} />
    </>
  );
}

export default Route;