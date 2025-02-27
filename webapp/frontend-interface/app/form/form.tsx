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
import { ethers } from 'ethers';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

// Initialize position state with default values to avoid uncontrolled/controlled warnings
const DEFAULT_POSITION = { lat: '', lng: '' };

export default function Form({setGlobalIpfsLink, setIsThereFire, position = DEFAULT_POSITION, setPosition}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [isPaid, setIsPaid] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const RECIPIENT_WALLET = '0xEcf8a1e7C5f43b4316DEa596Bd06952172d6e94e'; 
  const REQUIRED_AMOUNT = '0.001'; 
  const ACCEPTED_CHAINS = {
    80002: 'Polygon Amoy Testnet'
  };


  const getNetworkName = (chainId) => {
    return ACCEPTED_CHAINS[chainId] || 'Unknown Network'; 
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const connectWallet = async () => {
    // Check for MetaMask or other web3 providers 
    if (typeof window.ethereum === 'undefined' && 
        typeof window.web3 === 'undefined' && 
        !window.ethereum && 
        !window.web3) {
      showSnackbar('Please install MetaMask to continue', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check which network user is connected to
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const decimalChainId = parseInt(chainId, 16);
      
      if (!ACCEPTED_CHAINS[decimalChainId]) {
        showSnackbar(`Please switch to Polygon Amoy Testnet in MetaMask`, 'warning');
        
        // Prompt user to add Polygon Amoy if not available
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x13882', // 80002 in hex
              chainName: 'Polygon Amoy Testnet',
              nativeCurrency: {
                name: 'POL',
                symbol: 'POL',
                decimals: 18
              },
              rpcUrls: ['https://rpc-amoy.polygon.technology/'],
              blockExplorerUrls: ['https://amoy.polygonscan.com/']
            }]
          });
          showSnackbar('Added Polygon Amoy Testnet to MetaMask. Please switch networks.', 'info');
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      } else {
        showSnackbar(`Connected to ${getNetworkName(decimalChainId)}`, 'success');
      }
      
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showSnackbar('Failed to connect wallet', 'error');
    } finally {
      setIsLoading(false);
    }
    
    window.ethereum.on('chainChanged', (chainId) => {
      const decimalChainId = parseInt(chainId, 16);
      if (ACCEPTED_CHAINS[decimalChainId]) {
        showSnackbar(`Switched to ${getNetworkName(decimalChainId)}`, 'success');
      } else {
        showSnackbar(`Please switch to Polygon Amoy Testnet`, 'warning');
      }
    });
  };

  const sendPayment = async () => {
    if (!account) {
      showSnackbar('Please connect your wallet first', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      let provider;
      if (window.ethereum) {
        // Check if using ethers v6
        if (ethers.BrowserProvider) {
          provider = new ethers.BrowserProvider(window.ethereum);
        } 
        // Fallback for ethers v5
        else if (ethers.providers && ethers.providers.Web3Provider) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
          throw new Error("Incompatible ethers version");
        }
      } else if (window.web3) {
        // Check if using ethers v6
        if (ethers.BrowserProvider) {
          provider = new ethers.BrowserProvider(window.web3.currentProvider);
        }
        // Fallback for ethers v5
        else if (ethers.providers && ethers.providers.Web3Provider) {
          provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        } else {
          throw new Error("Incompatible ethers version");
        }
      } else {
        throw new Error("No Ethereum browser extension detected");
      }
      
      // Check which network user is connected to
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      
      if (!ACCEPTED_CHAINS[chainId]) {
        showSnackbar(`Please switch to Polygon Amoy Testnet before paying`, 'error');
        setIsLoading(false);
        return;
      }
      
      const signer = await provider.getSigner();
      
      // Handle both ethers v5 and v6
      const amount = ethers.parseEther ? 
        ethers.parseEther(REQUIRED_AMOUNT) : 
        ethers.utils.parseEther(REQUIRED_AMOUNT);
      
      // Create transaction
      const tx = await signer.sendTransaction({
        to: RECIPIENT_WALLET,
        value: amount
      });
      
      showSnackbar('Processing payment...', 'info');
      
      const receipt = await tx.wait();
      
      setIsPaid(true);
      showSnackbar(`Payment of ${REQUIRED_AMOUNT} POL successful on ${getNetworkName(chainId)}!`, 'success');
    } catch (error) {
      console.error('Payment failed:', error);
      showSnackbar('Payment failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // New function to send tweet when fire is detected
  const sendTweet = async (lat, lng) => {
    try {
      const tweetText = `${lat}, ${lng}. Tweet about information about this location and fire history.`;
      console.log('tweet being sent');
      const response = await axios.post(
        'https://autonome.alt.technology/fyreport-aixdmk/8fda1a98-e9e2-026b-94ef-b31d7d41d7d7/message',
        {
          text: tweetText
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ZnlyZXBvcnQ6ZWlrYW1ZeFpsRA=='
          }
        }
      );
      
      console.log('Tweet sent successfully:', response.data);
      showSnackbar('Fire alert tweet sent successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Failed to send tweet:', error);
      showSnackbar('Failed to send fire alert tweet', 'error');
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // stop default refresh
    
    if (!isPaid) {
      showSnackbar('Please make a payment before submitting', 'warning');
      return;
    }
    
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    let lat = data.get("lat");
    let long = data.get("long");
    
    try {
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
      const isThereFire = ipfsResp.data.isThereFire;
      setIsThereFire(isThereFire);
      
      // If fire is detected, send a tweet
      if (isThereFire) {
        await sendTweet(lat, long);
      }
      
      // Reset payment status after successful request
      setIsPaid(false);
    } catch (error) {
      console.error('Request failed:', error);
      showSnackbar('Failed to fetch fire data', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualChange = (event) => {
    let currPos = { ...position }; // Clone current position to avoid mutation
    
    if(event.name === "lat"){
      currPos.lat = event.value;
    }
    else{
      currPos.lng = event.value;
    }
    
    setPosition(currPos);
    
  };

  return (
    <Card variant="outlined" sx={{marginTop: "5%"}}>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Active Fire Query:
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
            value={position?.lat || ''}
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
            value={position?.lng || ''}
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={'primary'}
            onChange={(e) => handleManualChange(e.target)}
          />
        </FormControl>
        
        <Stack direction="column" spacing={1} width="100%">
          {!account ? (
            <Button
              onClick={connectWallet}
              fullWidth
              variant="outlined"
              disabled={isLoading}
            >
              Connect Wallet
            </Button>
          ) : !isPaid ? (
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </Typography>
              <Button
                onClick={sendPayment}
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isLoading}
              >
                Pay {REQUIRED_AMOUNT} POL to continue
              </Button>
            </Box>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              Find out
            </Button>
          )}
        </Stack>
      </Box>
      
      {isLoading ? (<LinearProgress />) : (<></>)}
    </Card>
  );
}