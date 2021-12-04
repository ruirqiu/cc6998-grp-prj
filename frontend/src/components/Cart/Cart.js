import React from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './Cart.css'

function Cart({ cartItems }) {
  return (
    <Box className='cartResult'>
      <nav aria-label="secondary mailbox folders">
        <List>
          {cartItems.item_details.map(function (d, idx) {
            return (
              <React.Fragment key={`listitem-${idx}`}>
                <ListItem disablePadding>
                  <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText style={{ marginRight: '50px' }} primary={d.title} />
                    <ListItemText primary={d.price} />
                    
                  </ListItemButton>
                  <img className="imageContainer" src={d.image_url} alt={d.keyword}></img>
                </ListItem>
                <Divider />
              </React.Fragment>
            )
          })}
        </List>
      </nav>
    </Box>
  );
}

export default Cart;