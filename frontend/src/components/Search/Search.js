import React, { useState } from 'react'
import SearchBar from './SearchBar'

function Search () {

  const [query, setQuery] = useState("")

  const onChange = e => {
    setQuery(e.target.value)
  }

  const onClick = e => {
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