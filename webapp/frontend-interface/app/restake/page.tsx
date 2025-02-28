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
    const [stakingSuccessful, setStakingSuccessful] = React.useState(false);
  return (
    <>
      <Navbar />
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SearchContainer direction="column" justifyContent="space-between">
          <Form 
            stakingSuccessful={stakingSuccessful}
            setStakingSuccessful={setStakingSuccessful}
          />
        </SearchContainer>
        <Card variant="outlined">
          {stakingSuccessful ? "Restaking Successful" : ""}
        </Card>
      </AppTheme>
    </>
  );
}

export default Page;