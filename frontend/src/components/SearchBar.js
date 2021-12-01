import React from 'react'
import TextField from '@mui/material/TextField';

function SearchBar () {
  return (
    <>
      <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
        />
    </>

  )
}

export default SearchBar;