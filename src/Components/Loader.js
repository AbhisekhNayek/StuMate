import React from 'react'
import { Spinner } from 'react-bootstrap'

// Defining the Loader component
export const Loader = () => {
    // Rendering a loading spinner centered on the screen
    return (
        <div style={{display:"flex",justifyContent:"center", alignItems:"center", width:"100vw", height:"100vh", size:"5em"}}>
            <Spinner animation="border" />
        </div>
    )
}
