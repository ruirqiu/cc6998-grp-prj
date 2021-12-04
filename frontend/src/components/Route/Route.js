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

function Route({ routeItems }) {
    
  return (
    <>
    <Box className='routeResult'>
       <nav aria-label="secondary mailbox folders">
          <List>
             {routeItems.route_details.map(function (d, idx) {
             return (
             <React.Fragment key={`listitem-${idx}`}>
                <ListItem disablePadding>
                   <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                   <ListItemText style={{ marginRight: '50px' }} primary={d.brand_name} />
                   <ListItemText primary={d.store_name} />
                   <ListItemText primary={d.lat} />
                   <ListItemText primary={d.lon} />
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