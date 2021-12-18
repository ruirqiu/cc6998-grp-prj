import React from 'react'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './Route.css'


function Route({ routeItems }) {

   var summary_text = "Total Price: " + routeItems.total_price_dollar + "    | Total Distance: " + routeItems.total_distance_mile + "     | Total Travel Time: " + routeItems.total_duration_min

   //var origin = routeItems.geo_list[0][0] + "," + routeItems.geo_list[0][1];
   //var destination = routeItems.geo_list[0][0] + "," + routeItems.geo_list[0][1];
   //var waypoints = routeItems.geo_list[1][0] + "," + routeItems.geo_list[1][1]
   //for (let i = 2; i < routeItems.geo_list.length; i++) {
   //   waypoints += "|" + routeItems.geo_list[i][0] + "," + routeItems.geo_list[i][1];
   //}

   //console.log(origin)
   //console.log(waypoints)
   var map_url = [];
   for (let i = 0; i < routeItems.geo_list.length-1; i++) {
       var origin = routeItems.geo_list[i][0] + "," + routeItems.geo_list[i][1];
       var destination = routeItems.geo_list[i+1][0] + "," + routeItems.geo_list[i+1][1];
       map_url.push("<iframe width='800' height='600' frameborder='0' style='border:0' src = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyD1UW22TBdaFcgSdVY70_cyYA_OXIQ-sFo&origin=" + origin + "&destination=" + destination + "&mode=transit' allowfullscreen></iframe>");
   }
    
    // go back home
   var origin = routeItems.geo_list[routeItems.geo_list.length-1][0] + "," + routeItems.geo_list[routeItems.geo_list.length-1][1];
   var destination = routeItems.geo_list[0][0] + "," + routeItems.geo_list[0][1];
   map_url.push("<iframe width='800' height='600' frameborder='0' style='border:0' src = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyD1UW22TBdaFcgSdVY70_cyYA_OXIQ-sFo&origin=" + origin + "&destination=" + destination + "&mode=transit' allowfullscreen></iframe>");
  console.log(map_url)


   return (
      <>
         <div>{summary_text}</div>
         <Box className='routeResult'style={{marginBottom: "10px" }}>
            <nav aria-label="secondary mailbox folders">
               <List>
                  {routeItems.route_details.map(function (d, idx) {
                     var idx_text = "Stop " + (idx + 1) + ":     " + (d.brand_name);
                     var name_text = "Store Location: " + (d.store_name);
                     var street_text = "Street Address: "+ routeItems.html_instruction_data[idx].end_address
                     var geo_text = "Latittude: " + (d.lat) + "     Longitutde: " + (d.lon);
                     return (
                        <React.Fragment key={`listitem-${idx}`}>
                           <ListItem disablePadding>
                              <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                 <ListItemText style={{ marginRight: '50px' }} primary={idx_text} />
                                 <ListItemText secondary={name_text} />
                                 <ListItemText secondary={street_text} />
                                 <ListItemText primary="The following items are purchased here:" />
                                 {d.purchased_here.map(function (i, idx_i) {
                                    var idx_i_text = "Item " + (idx_i + 1) + ":    " + (i.item_id) + "    $" + i.price;
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

        <Box className='routeResult'style={{marginBottom: "10px" }}>
            <nav aria-label="secondary mailbox folders">
               <List>
                  {routeItems.html_instruction_data.map(function (in_, idx_in) {
                     var Description_text = "From "
                     if (idx_in === 0 ){
                       Description_text += "Home" + " (" + (in_.start_address) + ") "
                     } else {
                       Description_text += routeItems.route_details[idx_in-1].brand_name + " (" + (in_.start_address) + ") "
                     }
                     
                        
                     if (idx_in === routeItems.route_details.length){
                       Description_text += " To " + "Home" + " (" + (in_.end_address) + ") "
                     } else {
                       Description_text += " To " + routeItems.route_details[idx_in].brand_name +" (" + (in_.end_address) + ")";
                     }
                     
 
                     var summary_distance = "Leg distance: " + (in_.distance);
                     var summary_duration = " Leg duration: "+ (in_.duration);
                     return (
                        <React.Fragment key={`listitem-${idx_in}`}>
                           <ListItem disablePadding>
                              <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                 <ListItemText style={{ marginRight: '50px' }} primary={Description_text} />
                                 <ListItemText secondary={summary_distance} />
                                 <ListItemText secondary={summary_duration} />
                                 <ListItemText primary="Detailed Steps:" />
                                 {in_.sub_instructions.map(function (sub_in, idx_sub) {
                                    var step_text = "Step "+(idx_sub+1)+": "+(sub_in) + " for " + (in_.sub_durations[idx_sub]);
                                    return (
                                       <React.Fragment key={`listitem-${idx_sub}`}>
                                          <small> {step_text} </small>
                                          <Divider />
                                       </React.Fragment>
                                    )
                                 })}
                              </ListItemButton>
                           </ListItem>
                            <div dangerouslySetInnerHTML={{ __html: map_url[idx_in] }} />
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