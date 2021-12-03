import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './Search.css'

function SearchResult({ itemList }) {

  // const onClick = async (e) => {
  //   e.preventDefault();
  //   console.log(query);

  //   if (user) {
  //     const idToken = user["signInUserSession"]["idToken"]["jwtToken"];
  //     const config = {
  //       headers: {
  //         "Content-Type": 'application/json',
  //         "Authorization": idToken
  //       },
  //       params: {
  //         'itemName': query,
  //       }
  //     };

  //     const url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/search';
  //     await axios.get(url, config)
  //       .then(res => {
  //         setItems(res.data);
  //         setPage("searchResult");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });

  //   }
  // };

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
                    <Button variant="contained">Add to Cart</Button>
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