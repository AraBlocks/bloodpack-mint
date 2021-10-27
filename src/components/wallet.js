import React from 'react';
import { useEffect, useState } from 'react';
import { BloodpackContract, connectWallet, getCurrentWalletConnected, mintToken, setActive } from '../util/interact.js';

const Wallet = () => {
  const [ walletAddress, setWallet ] = useState('');
  const [ status, setStatus ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ newMessage, setNewMessage ] = useState('');
  const [ mintQty, setMintQty ] = useState(1);
  //called only once
  useEffect(async () => {
    // const message = await loadCurrentMessage();
    // setMessage(message);
    addSmartContractListener();

    const { address, status } = await getCurrentWalletConnected();
    setMessage('Connected to MetaMask');
    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addSmartContractListener() {
    BloodpackContract.events.AssetMinted({}, (error, data) => {
      if (error) {
        setStatus('😥 ' + error.message);
      } else {
        console.log(data);
        setMessage(data.returnValues[1]);
        setNewMessage('');
        setStatus('🎉 Your message has been updated!');
      }
    });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus('👆🏽 Write a message in the text-field above.');
        } else {
          setWallet('');
          setStatus('🦊 Connect to Metamask using the top right button.');
        }
      });
    } else {
      setStatus(
        <p>
          {' '}
          🦊{' '}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => {
    // const { status } = await updateMessage(walletAddress, newMessage);
    // setStatus(status);
  };

return (
<div id="container">

<img src="banner.png"/>
<p>
<a href="https://www.screambox.com/bloodpacks/">screambox.com/bloodpacks</a> - <a href="https://rad.live/nft">rad.live/nft</a> - <a href="https://ara.one/">ara.one</a> - <a href="https://metamask.io/">metamask.io</a> - <a href="https://opensea.io/">opensea.io</a>
</p>

<div class="card">

<p>~ Use this portal to claim your NFT ~</p>

<p>
<i>BLOOD PACK - KILL SCENES</i> is a generative series of 666 NFTs.
Every card is unique.
Many cards have rare attributes.
Some attributes are ultra rare, or even single instance.
The <i>KILL SCENES</i> are true NFT tokens
minted on the Ethereum blockchain.
The contract address for the series is <i><a href="https://etherscan.io/address/0x88954a16b93f296d3d993793143e2dcbc32222b2">0x88954a16b93f296d3d993793143e2dcbc32222b2</a></i>
</p>

<p>
To claim your NFT, get <a href="https://metamask.io/">MetaMask</a>,
and send your wallet address some ETH for the gas fee.
You can also buy ETH with a credit card right in MetaMask.
Connect your MetaMask to this page, and then mint your NFT, using the buttons below:
</p>

<p>Status: {message}</p>
<button id="walletButton" onClick={connectWalletPressed}>
{walletAddress.length > 0 ? (
'Connected: ' + String(walletAddress).substring(0, 6) + '...' + String(walletAddress).substring(38)
) : (
<span>Connect Wallet</span>
)}
</button>

<p id="status">{status}</p>
<button
onClick={() =>
mintToken(walletAddress, 1).then((message) => {
setMessage(message.status);
})}
>
Mint NFT
</button>

<p>
Once minted, the <i>KILL SCENES</i> live forever on the blockchain.
You can see the gallery and marketplace on OpenSea:
</p>
<p>
<a href="https://opensea.io/collection/bloodpack">View the <i>KILL SCENES</i> on OpenSea</a>
</p>

</div>
</div>
);
};

export default Wallet;
