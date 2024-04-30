const {Web3} = require('web3');
const { Client } = require('pg');
const ERC20_ABI = require('./ABI.json');

// Connect to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/6f724a5d2d814e1b9d064f650dbb7c14'));

// ERC20 contract address (used USDT Erc20 contract)
const ERC20_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function erc20Indexer() {
    // Connect to the (hosted on ElephantSQL) PostgreSQL database
    const db = new Client({
        connectionString: 'postgres://lwvvbgjh:CEDZCblebcjaSUEeFRiBMvXG8fercs-A@rosie.db.elephantsql.com/lwvvbgjh',
    })
    
    db.connect()
    .then(() => console.log('Connected to the ElephantSQL PostgreSQL database'))
    .catch(err => console.error('Error connecting to the database:', err));

    // Create table to store ERC20 events
    db.query('CREATE TABLE IF NOT EXISTS erc20_events (address TEXT, blockhash TEXT, block_number BIGINT, data TEXT, transaction_hash TEXT, signature TEXT, from_address TEXT, to_address TEXT, value BIGINT)');

    // Subscribe to ERC20 Transfer events
    const contract = new web3.eth.Contract(ERC20_ABI, ERC20_ADDRESS);
    
    const currentBlockNumber = await web3.eth.getBlockNumber();

    console.log("Data fetching started...");

    // Fetching the transfer event
    contract.getPastEvents("Transfer", {
        fromBlock: currentBlockNumber - BigInt(100),
        toBlock: currentBlockNumber
    }).then((events) => {
        if (events) {
            handleEvent(events);
        } 
    }).catch((error) => {
        console.log('Error fetching events: ', error);
    })

    // Formatting and storing each event to the database
    function handleEvent(events) {

        for (let event of events) {
            const address = event.address.toString();
            const blockHash = event.blockHash.toString();
            const blockNumber = event.blockNumber;
            const data = event.data.toString();
            const transactionHash = event.transactionHash.toString();
            const signature = event.signature.toString();
            const fromAddress = event.returnValues.from.toString();
            const toAddress = event.returnValues.to.toString();
            const value = event.returnValues.value;

            var insertQuery = "INSERT INTO erc20_events VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

            db.query(insertQuery,[address, blockHash, blockNumber, data, transactionHash, signature, fromAddress, toAddress, value],(err) => {
                if (err) {
                    console.error('Error inserting data into database:', err);
                }
            })
        }
        console.log("Data fetched and saved to Database successfully ✅");
    }

}

erc20Indexer();