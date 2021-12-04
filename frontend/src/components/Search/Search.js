import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Cart from '../Cart/Cart';
import SearchBar from './SearchBar'
import SearchResult from './SearchResult'
import { Auth } from 'aws-amplify';
import axios from 'axios';

function Search() {

  const [query, setQuery] = useState("");
  const [idToken, setIdToken] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState(null);
  const [page, setPage] = useState("searchBar");
  const [cartItems, setCartItems] = useState(null);

  const onChange = e => {
    setQuery(e.target.value);
  }

// eslint-disable-next-line
  const updateSearch = async (idToken) => {
    const config = {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": idToken
      },
      params: {
        'itemName': query,
      }
    };

    const url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/search';
    await axios.get(url, config)
      .then(res => {
        setItems(res.data);
        setPage("searchResult");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const onClick = async (e) => {
    e.preventDefault();
    console.log(query);

    if (!idToken) {
      await Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user => {
        const user_email = user["attributes"]["email"];
        const user_idToken = user["signInUserSession"]["idToken"]["jwtToken"];
        setIdToken(user_idToken);
        setEmail(user_email);
        updateSearch(user_idToken);
      })
        .catch(err => console.log(err));

    } else {
      updateSearch(idToken);
    }
  };

  const updateCart = async (userEmail, userIdToken) => {
    const config = {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": userIdToken
      },
      params: {
        'userID': userEmail
      }
    };

    const url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/getCart';
    await axios.get(url, config)
      .then(res => {
        console.log(res.data);
        setCartItems(res.data);
        setPage("cart");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  const clearCart = async (userEmail, userIdToken) => {
    const config = {
      headers: {
        "Content-Type": 'application/json',
        "Authorization": userIdToken
      },
      params: {
        'userId': userEmail
      }
    };

    const url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/startNewSearch';
    await axios.get(url, config)
      .then(res => {
        console.log(res.data);
        setPage("searchBar");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  const newCartButtonClick = async (e) => {
    e.preventDefault();

    if (!email) {
      await Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user => {
        const user_email = user["attributes"]["email"];
        const user_idToken = user["signInUserSession"]["idToken"]["jwtToken"];
        setIdToken(user_idToken);
        setEmail(user_email);
        clearCart(user_email, user_idToken);
      })
        .catch(err => console.log(err));

    } else {
      clearCart(email, idToken);
    }

  }

  const cartButtonClick = async (e) => {
    e.preventDefault();

    if (!email) {
      await Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user => {
        const user_email = user["attributes"]["email"];
        const user_idToken = user["signInUserSession"]["idToken"]["jwtToken"];
        setIdToken(user_idToken);
        setEmail(user_email);
        updateCart(user_email, user_idToken);
      })
        .catch(err => console.log(err));

    } else {
      updateCart(email, idToken)
    }

  };

  return (
    <>
      <Button variant="contained" type="submit" onClick={cartButtonClick}>Cart</Button>
      <Button variant="contained" type="submit" onClick={newCartButtonClick}>Start New Cart</Button>
      {email && idToken && cartItems && page === "cart" &&
        <div className="searchResultContainer">
          <SearchBar onChange={onChange} onClick={onClick} />
          <Cart idToken={idToken} email={email} cartItems={cartItems} />
        </div>
      }
      {page === "searchBar" &&
        <div className="searchBarContainer">
          <SearchBar onChange={onChange} onClick={onClick} />
        </div>
      }
      {email && idToken && items && page === "searchResult" &&
        <div className="searchResultContainer">
          <SearchBar onChange={onChange} onClick={onClick} />
          <SearchResult idToken={idToken} email={email} itemList={items} />
        </div>}
    </>
  )
}

export default Search;