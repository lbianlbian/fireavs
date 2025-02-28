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
import { ethers } from 'ethers';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { Readex_Pro } from 'next/font/google';

const P2PURL = "https://api.p2p.org/api/v1/unified/staking/stake";
const P2PHEADERS = {
  headers: {
    accept: 'application/json',
    authorization: 'Bearer holeskyIsDownSoAPIKeyDoesntMatter',
    'content-type': 'application/json'
  }
}; 

export default function Form({stakingSuccessful, setStakingSuccessful}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [amount, setAmount] = React.useState(32);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'info'
  });

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

    setIsLoading(true);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    setIsLoading(false);
  };

  const restake = async (e) => {
    setAmount(e.target.value);
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
      
      const signer = await provider.getSigner();
      
      let payload = {
        "chain": "eth_ssv",
        "network": "testnet",
        "stakerAddress": "account",
        "amount": amount
      };
      
      let resp = await axios.post(P2PURL, payload, P2PHEADERS);
      let rawTxData = resp.data.result.unsignedTransactionData;
      // Create transaction
      // Parse the raw transaction
      const tx = ethers.Transaction.from(rawTxData);

      const newTx = {
          to: tx.to,
          data: tx.data,
          chainId: tx.chainId,
          value: tx.value,
          gasLimit: tx.gasLimit,
          type: 2,
          nonce: await provider.getTransactionCount(account),
          // Enter the max fee per gas and prirorty fee
          maxFeePerGas: ethers.parseUnits("250", 'gwei'),
          maxPriorityFeePerGas: ethers.parseUnits("250", 'gwei')
      }
      
      showSnackbar('Processing payment...', 'info');
      
      const receipt = await tx.wait();
      
      setStakingSuccessful(true);
      showSnackbar(`Your restaked ETH is now powering trustless + verifiable onchain fire data!`, 'success');
    } catch (error) {
      console.error('Payment failed:', error);
      showSnackbar('Payment failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
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
        Restake and Power BlazeSentry AVS!
      </Typography>
      
      <Box
        component="form"
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
            id="amnt"
            name="amnt"
            placeholder="Amount to restake (ETH)"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={'primary'}
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
          ) : (
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </Typography>
              <Button
                onClick={restake}
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isLoading}
              >
                Stake now!
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
      
      {isLoading ? (<LinearProgress />) : (<></>)}
    </Card>
  );
}