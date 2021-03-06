import React from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import './Search.css'

function SearchResult({ email, idToken, itemList }) {
    // add descriptions to items without description
    for (let i = 0; i < itemList.length; i++) {
        if (!itemList[i].hasOwnProperty('description')){
            itemList[i]['description'] = ["No descriptions"]
        }
        if (!itemList[i].hasOwnProperty('title')){
            itemList[i]['title'] = "No titles"
        }
        if (!itemList[i].hasOwnProperty('price')){
            itemList[i]['price'] = "No price"
        }
        if (!itemList[i].hasOwnProperty('price_range')){
            itemList[i]['price_range'] = "No price range"
        }

    }
    console.log(itemList)
    


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

  const CartButton = styled(Button)(() => ({
    color: 'white',
    backgroundColor: '#F39C12',
    '&:hover': {
      backgroundColor: '#D68910',
    },
  }));

  return (
    <Box className='searchResult'>
      <nav aria-label="secondary mailbox folders">
        <List>
          {itemList.map(function (d, idx) {
            var store_text = "Available at: "
              for (let i = 0; i < d.store_list.length-1; i++) {
                  store_text += d.store_list[i] +", "
              }  
              store_text += d.store_list[d.store_list.length-1]
            return (
              <React.Fragment key={`listitem-${idx}`}>
                <ListItem style={{ display: 'flex', alignItems: 'flex-start' }} disablePadding>
                  <ListItemButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
                    <ListItemText style={{ marginRight: '50px' }} disableTypography
                      primary={<Typography style={{ fontWeight: 'bold' }}>{d.title}</Typography>} />
                    <ListItemText primary={`Price range: ${d.price_range}`} />
                    <ListItemText secondary={store_text} />
                    <div style={{ marginTop: '5px', marginBottom: '10px' }}>
                      {d.description
                        .map(function (dest, di) {
                          return (<span key={di} style={{ color: '#2471A3', lineHeight: '16pt' }}>{dest}</span>)
                        })
                        .reduce((prev, curr) => [prev, '. ', curr])
                      }
                    </div>
                  </ListItemButton>
                  <div className="searchItemButtonContainer">
                    <img className="imageContainer" src={d.image_url} alt={d.keyword}></img>
                    <CartButton className="searchItemButton" type="submit" variant="contained" onClick={() => onClick(d)}>
                      Add to Cart
                    </CartButton>
                  </div>
                </ListItem>
                <Divider />
              </React.Fragment>
            )
          })}
        </List>
      </nav>
    </Box >
  );
}

export default SearchResult;