import React from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './Search.css'

function SearchResult({ email, idToken, itemList }) {

  const onClick = async (item) => {
    console.log(email);
    console.log(idToken);

    // NOT SURE HOW TO POST WITH AXIOS, NEEDS FIX!!!!
    // Dec. 3rd Claire Luo: Fixed. remove headers, change method to get, add headers in lambda
    const config = {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": idToken
      },
      params: {
        'user_id': email,
        'tcin': item.id
      }
    };

    const url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/addToCart';
    await axios.get(url, config)
      .then(res => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className='searchResult'>
      <nav aria-label="secondary mailbox folders">
        <List>
          {itemList.map(function (d, idx) {
            return (
              <React.Fragment key={`listitem-${idx}`}>
                <ListItem disablePadding>
                  <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText style={{ marginRight: '50px' }} primary={d.title} />
                    <ListItemText primary={d.price} />
                    <Button type="submit" variant="contained" onClick={() => onClick(d)}>Add to Cart</Button>
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

export default SearchResult;