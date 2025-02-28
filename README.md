# BlazeSentry AVS - UCLA submission for Eigengames Hackathon

Mission: Powering Verifiable and Trustless Onchain Fire Insurance with an Eigenlayer AVS.

Technical details: We created an AVS by adapting the Othentic framework to handle wildfire data and built a dapp to interface with our AVS. We also built an Autonome AI Agent to make alert tweets about verified wildfires. We also built an interface for P2P restaking to power BlazeSentry AVS.  
The dapp is stored in the webapp directory. 
Currently, all operators use NASA to obtain the fire data, but we would make them use different methods for proper decentralization in the future. 

### Autonome Fyrebot Agent 

Autonome Deployment: fyreport-aixdmk

Twitter Handle: @BlazeSentry_AVS

Deployed a custom AI Agent on Autonome's Eliza framework and fine tuned through recent fire data. Agent will tweet about a confirmed fire event with a possible fire severity and spread prediction. 

### P2P Restaking

Since Holesky testnet is down, we are unable to test or demonstrate this restaking functionality. The code to handle restaking is stored in webapp/frontend-interface/app/restake. It uses the unified restaking API to make it easy for restakers to ensure the operation and security of BlazeSentry and Eigenlayer as a whole. 

# Othentic Stack Setup Instructions

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Usage](#usage)

---

## Overview

This repository demonstrates how to deploy a fire data AVS using Othentic Stack.



### Features

- **Containerised deployment:** Simplifies deployment and scaling.
- **Prometheus and Grafana integration:** Enables real-time monitoring and observability.

## Project Structure

```mdx
📂 fireavs
├── 📂 Execution_Service         # Implements Task execution logic - Express JS Backend
│   ├── 📂 config/
│   │   └── app.config.js        # An Express.js app setup with dotenv, and a task controller route for handling `/task` endpoints. API takes lat, long, and time query parameters. 
│   ├── 📂 src/
│   │   └── dal.service.js       # A module that interacts with Pinata for IPFS uploads
│   │   ├── oracle.service.js    # A utility module to fetch the latest fire data and determine whether there is a fire at the input location (lat and long) + time. 
│   │   ├── task.controller.js   # An Express.js router handling a `/execute` POST endpoint
│   │   ├── 📂 utils             # Defines two custom classes, CustomResponse and CustomError, for standardizing API responses
│   ├── Dockerfile               # A Dockerfile that sets up a Node.js (22.6) environment, exposes port 8080, and runs the application via index.js
|   ├── index.js                 # A Node.js server entry point that initializes the DAL service, loads the app configuration, and starts the server on the specified port
│   └── package.json             # Node.js dependencies and scripts
│
├── 📂 Validation_Service         # Implements task validation logic - Express JS Backend
│   ├── 📂 config/
│   │   └── app.config.js         # An Express.js app setup with a task controller route for handling `/task` endpoints.
│   ├── 📂 src/
│   │   └── dal.service.js        # A module that interacts with Pinata for IPFS uploads
│   │   ├── oracle.service.js     # A utility module to fetch the latest fire data and determine whether there is a fire at the input location (lat and long) + time. 
│   │   ├── task.controller.js    # An Express.js router handling a `/validate` POST endpoint
│   │   ├── validator.service.js  # A validation module that checks if a task result from IPFS matches the validator's own fire data. 
│   │   ├── 📂 utils              # Defines two custom classes, CustomResponse and CustomError, for standardizing API responses.
│   ├── Dockerfile                # A Dockerfile that sets up a Node.js (22.6) environment, exposes port 8080, and runs the application via index.js.
|   ├── index.js                  # A Node.js server entry point that initializes the DAL service, loads the app configuration, and starts the server on the specified port.
│   └── package.json              # Node.js dependencies and scripts
│
├── 📂 grafana                    # Grafana monitoring configuration
├── docker-compose.yml            # Docker setup for Operator Nodes (Performer, Attesters, Aggregator), Execution Service, Validation Service, and monitoring tools
├── .env.example                  # An example .env file containing configuration details and contract addresses
├── README.md                     # Project documentation
└── prometheus.yaml               # Prometheus configuration for logs
```

## Architecture

![Price oracle sample](https://github.com/user-attachments/assets/03d544eb-d9c3-44a7-9712-531220c94f7e)

The Performer node executes tasks using the Task Execution Service and sends the results to the p2p network.

Attester Nodes validate task execution through the Validation Service. Based on the Validation Service's response, attesters sign the tasks. In this AVS:

Task Execution logic:
- Fetch data on locations of fires
- Filter data to the given lattitude, longitude, and unix timestamp
- Determine whether or not there is a fire here. If not found, there is no fire. 
- Store the result in IPFS.
- Share the IPFS CID as proof.

Validation Service logic:
- Retrieve the result of whether or not there is a fire from IPFS using the CID.
- Get the expected fire status.
- Validate by comparing the actual and expected fire statuses.
---

## Prerequisites

- Node.js (v 22.6.0 )
- Foundry
- [Yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/engine/install/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lbianlbian/fireavs.git
   cd fireavs
   ```

2. Install Othentic CLI:

   ```bash
   npm i -g @othentic/othentic-cli
   ```

## Usage

Follow the steps in the official documentation's [Quickstart](https://docs.othentic.xyz/main/avs-framework/quick-start#steps) Guide for setup and deployment.

### Next


Happy Building! 🚀