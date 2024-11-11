import { Alert, Box } from '@mui/material'
import React from 'react'

const AlertBox = (props) => {
  return (
    <>
    <Box
          display="flex"
          position="absolute"
          width="full"
          sx={{marginBottom:30}}
        >
          <Alert variant="filled" severity={props.severity}>
            {props.text}
          </Alert>
        </Box>
    </>
  )
}

export default AlertBox