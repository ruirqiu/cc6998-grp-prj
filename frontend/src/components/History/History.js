import React from 'react'
import axios from 'axios';
import Box from '@mui/material/Box';

function History({ email }) {

  return (
    <Box style={{ width: '500px', height: '500px' }}>
      <p>HISTORY FOR {email}</p>
    </Box >
  );
}

export default History;