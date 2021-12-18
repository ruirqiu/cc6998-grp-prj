import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import './Cart.css'
import Route from '../Route/Route'

function Cart({ email, idToken, cartItems }) {

  const [routeItems, setRouteItems] = useState(null);
  const [page, setPage] = useState(null);
  const [routeSwitch, setRouteSwitch] = useState(true);
  const [pos, setPos] = useState({ 'lat': 40, 'lng': -73 })

  useEffect(() => {
    const defaultPos = { 'lat': 40, 'lng': -73 }
    if (pos['lat'] === defaultPos['lat']) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          console.log('setting location on entry')
          setPos({ 'lat': position.coords.latitude, 'lng': position.coords.longitude })

        }, () => {
          // Browser supports geolocation, but user has denied permission
          console.log("Browser supports geolocation, but user has denied permission")
        });
      } else {
        // Browser doesn't support geolocation
        console.log("Browser doesn't support geolocation")
      }
    }
  }, [pos])

  const updateRoute = async () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('update route setting location')
        setPos({ 'lat': position.coords.latitude, 'lng': position.coords.longitude })

      }, () => {
        // Browser supports geolocation, but user has denied permission
        console.log("Browser supports geolocation, but user has denied permission")
      });
    } else {
      // Browser doesn't support geolocation
      console.log("Browser doesn't support geolocation")

    }

    var optionText = 'SHORT'
    if (routeSwitch) {
      optionText = 'CHEAP'
    }

    console.log(optionText)

    const config = {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": idToken
      },
      params: {
        'user_id': email,
        'lat': pos['lat'],
        'lon': pos['lng'],
        'route_option': optionText
      }
    };
    console.log("before request")
    console.log(pos)

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
    e.preventDefault()
    console.log(email);
    console.log(idToken);
    updateRoute(email, idToken)

  };

  const handleSwitchChange = async (e) => {
    e.preventDefault()
    setRouteSwitch(e.target.checked);
  };

  var summary_text = "Last Update: " + cartItems.cart_update_time;

  return (
    <>

      <div>{summary_text}</div>
      <Box className='cartResult'>
        <nav aria-label="secondary mailbox folders">
          <List>
            {cartItems.item_details.map(function (d, idx) {
              return (
                <React.Fragment key={`listitem-${idx}`}>
                  <ListItem disablePadding>
                    <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <ListItemText style={{ marginRight: '50px' }} primary={d.title} />
                      <ListItemText primary={d.price_range} />
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
      <Stack style={{ justifyContent: 'center' }} direction="row" spacing={1} alignItems="center">
        <Typography>Shortest Route</Typography>
        <Switch
          checked={routeSwitch}
          onChange={handleSwitchChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <Typography>Cheapest Route</Typography>
      </Stack>
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