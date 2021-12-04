import React, { useState }  from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './Cart.css'
import Route from '../Route/Route'

function Cart({ email, idToken, cartItems }) {
    
    const [routeItems, setRouteItems] = useState(null);
    const [page, setPage] = useState(null);
    
    const updateRoute = async (userEmail, userIdToken) => {
     const config = {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": idToken
      },
      params: {
        'user_id': email,
        'lat':40.77,
        'lon':-73.98,
        'route_option':'CHEAP'
      }
    };

    const url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/planRoute';
    await axios.get(url, config)
      .then(res => {
        console.log(res.data);
        setRouteItems(res.data);
        setPage("Route");
      })
      .catch((error) => {
        console.log(error);
      });
  }
    
    const routeButtonClick = async (e) => {
    console.log(email);
    console.log(idToken);
    updateRoute(email, idToken)
        
  };
    
    
  return (
    <>
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
    <Button variant="contained" type="submit" onClick={routeButtonClick}>Plan Route</Button>

    {routeItems && page === "Route" &&
        <div className="searchResultContainer">
          <Route routeItems={routeItems} />
        </div>
      }
    </>
  );
}

export default Cart;