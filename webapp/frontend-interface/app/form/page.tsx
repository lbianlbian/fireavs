"use client"
import * as React from 'react';
import Form from "./form";
import Navbar from "../../components/topbar";
import AppTheme from "./styling/AppTheme";
import CssBaseline from '@mui/material/CssBaseline';
import Card from "./card";
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const SearchContainer = styled(Stack)(({ theme }) => ({
  //height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function Page(props){
  const [position, setPosition] = React.useState(null);
  const [isThereFire, setIsThereFire] = React.useState("not set");  // 3 possible vals, true, false, "not set"
  const [globalIpfsLink, setGlobalIpfsLink] = React.useState();
  return (
    <>
      <Navbar />
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SearchContainer direction="column" justifyContent="space-between">
          <Form 
            position={position} 
            setGlobalIpfsLink={setGlobalIpfsLink}
            setIsThereFire={setIsThereFire}
            setPosition={setPosition}
          />
        </SearchContainer>
        <Card variant="outlined">
          {isThereFire == "not set" ? "Please pick a location" : 
            (<a href={globalIpfsLink} target="_blank">There is {isThereFire ? "" : "not"} a fire here</a>)
          }
          <br></br>
          {
            "Current Query Rate: 0.001 POL / Query "
          }
        </Card>
      </AppTheme>
    </>
  );
}

export default Page;