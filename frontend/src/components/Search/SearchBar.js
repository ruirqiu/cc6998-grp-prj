import React from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import './Search.css'

function SearchBar({ onClick, onChange }) {

  return (
    <Paper
      component="form"
      className='searchBar'
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <InputBase
        onChange={onChange}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Product Name"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <Divider sx={{ height: 36, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={onClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;