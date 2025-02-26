"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from "axios";
import LinearProgress from '@mui/material/LinearProgress';
import Card from "./card";
import InteractiveMap from './map';

export default function Form({setGlobalIpfsLink, setIsThereFire, position, setPosition}) {

  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();  // stop default refresh
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    let lat = data.get("lat");
    let long = data.get("long");
    let url = `http://localhost:4003/task/execute?lat=${lat}&long=${long}&time=${Date.now() / 1000}`;
    let resp = await axios.post(url);
    console.log(resp.data);
    // get ipfs hash from response, axios resp -> data becomes othentic custom resp
    // othentic custom resp -> data is object we want
    // object we want -> proofOfTask is what we want
    let ipfsHash = resp.data.data.proofOfTask;
    let ipfsLink = `https://ipfs.io/ipfs/${ipfsHash}`;
    setGlobalIpfsLink(ipfsLink);
    let ipfsResp = await axios.get(ipfsLink);
    setIsThereFire(ipfsResp.data.isThereFire);
    setIsLoading(false);
  };

  const handleManualChange = (event) => {
    console.log(event);
    let currPos = {};
    if(event.name == "lat"){
        currPos.lat = event.value;
        currPos.lng = position.lng;
    }
    else{
        currPos.lat = position.lat;
        currPos.lng = event.value;
    }
    setPosition(currPos);
  };
  return (
    <Card variant="outlined" sx={{marginTop: "5%"}}>
        <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
            Is there a fire here?
        </Typography>
        <InteractiveMap setPosition={setPosition} position={position}/>
        <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
        }}
        >
        <FormControl>
            <TextField
                id="lat"
                name="lat"
                placeholder="lattitude"
                value={position == null ? null : position.lat}
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={'primary'}
                onChange={(e) => handleManualChange(e.target)}
            />
            <TextField
                id="long"
                name="long"
                placeholder="longitude"
                value={position == null ? null : position.lng}
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={'primary'}
                onChange={(e) => handleManualChange(e.target)}
            />
        </FormControl>
        <Button
            type="submit"
            fullWidth
            variant="contained"
        >
            Find out
        </Button>
        </Box>
        {isLoading ? (<LinearProgress />) : (<></>)}
    </Card>
  );
"use client"}

