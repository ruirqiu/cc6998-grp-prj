import React, { useState } from 'react'
import SearchBar from './SearchBar'
import { Auth } from 'aws-amplify';

function Search () {

  const [query, setQuery] = useState("")

  const onChange = e => {
    setQuery(e.target.value)
  }

  const onClick = e => {

    // NOTE: JUST FOR TESTING, SHOULD REMOVE LATER
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log(user))
    .catch(err => console.log(err));

    e.preventDefault()
    console.log(query)
  }

  return (
    <>
      <SearchBar onChange={onChange} onClick={onClick} />
    </>

  )
}

export default Search;