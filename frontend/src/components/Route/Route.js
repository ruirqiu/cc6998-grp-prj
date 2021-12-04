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

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Route({ routeItems }) {
  var summary_text = "Total Price: "+routeItems.total_price_dollar+"    | Total Distance: "+routeItems.total_distance_mile + "     | Total Travel Time: "+ routeItems.total_duration_min

  const render = (status: Status) => {
      return <h1>{status}</h1>;
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
    </>
  );
}

export default Route;