import React, { useState } from 'react'
import SearchBar from './SearchBar'
import SearchResult from './SearchResult'
import { Auth } from 'aws-amplify';
import axios from 'axios';

function Search() {

  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState("searchBar");

  const onChange = e => {
    setQuery(e.target.value);
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      setUser(user);
    })
      .catch(err => console.log(err));
  }

  const onClick = async (e) => {
    e.preventDefault();
    console.log(query);

    if (user) {
      const idToken = user["signInUserSession"]["idToken"]["jwtToken"];
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

  };

  return (
    <>
      {page === "searchBar" &&
        <div className="searchBarContainer">
          <SearchBar onChange={onChange} onClick={onClick} />
        </div>
      }
      {items && page === "searchResult" &&
        <div className="searchResultContainer">
          <SearchBar onChange={onChange} onClick={onClick} />
          <SearchResult itemList={items} />
        </div>}
    </>
  )
}

export default Search;