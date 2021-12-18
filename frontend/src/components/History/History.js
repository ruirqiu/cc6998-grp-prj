import React from 'react'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './History.css'

function History({ email, historyItems }) {
   var summary_text = "Total Price: " + historyItems.total_price_dollar + "    | Total Distance: " + historyItems.total_distance_mile + "     | Total Travel Time: " + historyItems.total_duration_min


   return (
      <>
         <div>History For {email}</div>
         <div>Last Updated at {historyItems.time_stamp}</div>
         <div>{summary_text}</div>
         <Box className='historyResult'>
            <nav aria-label="secondary mailbox folders">
               <List>
                  {historyItems.route.map(function (d, idx) {
                     var idx_text = "Stop " + (idx + 1) + ":     " + (d.brand_name);
                     var name_text = "Store Location: " + (d.store_name);
                     var geo_text = "Latittude: " + (d.lat) + "     Longitutde: " + (d.lon);
                     return (
                        <React.Fragment key={`listitem-${idx}`}>
                           <ListItem disablePadding>
                              <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                 <ListItemText style={{ marginRight: '50px' }} primary={idx_text} />
                                 <ListItemText secondary={name_text} />
                                 <ListItemText secondary={geo_text} />
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

         <Box className='historyResult' style={{ marginBottom: "10px" }}>
            <nav aria-label="secondary mailbox folders">
               <List>
                  {historyItems.instructions.map(function (in_, idx_in) {
                     var Description_text = "From " + (in_.start_address) + " To " + (in_.end_address);
                     var summary_distance = "Leg distance: " + (in_.distance);
                     var summary_duration = " Leg duration: " + (in_.duration);
                     return (
                        <React.Fragment key={`listitem-${idx_in}`}>
                           <ListItem disablePadding>
                              <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                 <ListItemText style={{ marginRight: '50px' }} primary={Description_text} />
                                 <ListItemText secondary={summary_distance} />
                                 <ListItemText secondary={summary_duration} />
                                 <ListItemText primary="Detailed Steps:" />
                                 {in_.sub_instructions.map(function (sub_in, idx_sub) {
                                    var step_text = "Step " + (idx_sub + 1) + ": " + (sub_in) + " for " + (in_.sub_durations[idx_sub]);
                                    return (
                                       <React.Fragment key={`listitem-${idx_sub}`}>
                                          <small> {step_text} </small>
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

export default History;