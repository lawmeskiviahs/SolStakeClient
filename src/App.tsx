import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import Button from '@mui/material/Button';

import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,    
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { Children, FC, ReactNode, useMemo, useCallback,useState } from 'react';
import Mint from './mint';
import ButtonAppBar from './Create';
import BasicTextFields from './DataGather';
import { Connection } from '@solana/web3.js';
import {useEffect} from 'react'
import * as anchor from '@project-serum/anchor';
// import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';
import fs from 'mz/fs';

export const App: FC = () => {
    const [connect, setconnect] = useState(false);
    const { connection } = useConnection();
console.log(connection);
const { publicKey, sendTransaction } = useWallet();
console.log(publicKey,"publicKey");

//     if(connection.commitment=="confirmed"){
//  setconnect(true)

//     }
    return (
        <div className='main-conatiner'>

        {/* <div className='conatiner'>   
      <h2>Juntao</h2> */}
             <Context>
            <Content />
        </Context>
        {/* </div> */}
        {/* <div className='sub-container'>
            <ButtonAppBar/>
<Mint/>
</div> */}

{/* <div className='fields'>

<BasicTextFields/>

</div> */}

</div>

        
    );
};
    let phantomWallet: PhantomWalletAdapter 
const Context: FC<{ children: ReactNode }> = ({ children }) => {
   
    
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;
   
    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            phantomWallet =     new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );
   // let data = new PhantomWalletAdapter()
   
    
//console.log(Children,wallets);

    return (  
     
        <ConnectionProvider endpoint="https://api.devnet.solana.com">
            <WalletProvider  wallets={wallets} >
                <WalletModalProvider >


<Kam/>


                {/* <WalletDisconnectButton /> */}
                {/* <SendOneLamportToRandomAddress /> */}
           
               </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
      
        
    );
};

const Content: FC = () => {
   
    // console.log(data,"////////////////");
    // console.log(<WalletMultiButton/>);
      phantomWallet.on('connect', () => {
     //  let data=   phantomWallet.connect()
        console.log(phantomWallet,"hii");
    });
       phantomWallet.on('disconnect', () => {
        console.log(phantomWallet);
    })


    return <WalletMultiButton />;
};

export const SendOneLamportToRandomAddress: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
 console.log(publicKey,"//////////");
 
    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        console.log(publicKey);
        let add= "ECi1C2rYA3ysHcUwKqecHwoToFeauzCadkEiqBdQfzLX"
        const send = new PublicKey(add)
        console.log(send.toBase58(),":::::::::::::");
        
        const toAddress = Keypair.generate().publicKey;


        console.log("New Generated Address => ", toAddress);
        
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: send,
                lamports: 10000000,
            })
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    return (
        <Button variant="contained" onClick={onClick} disabled={!publicKey}>
            Send 1 lamport to a random address!
        </Button>
    );
};
import {
  Program, Provider, web3 ,BN
} from '@project-serum/anchor';
import idl from './idl.json';
import { Int } from '@solana/buffer-layout';

function Kam() {

//   useEffect(() => {
     
//     const fetch =async()=>{
//           const provider = await getProvider()
// console.log("alert");

//     }
//   fetch();
  
//   }, [])
  

  const { SystemProgram, Keypair } = web3;
  /* create an account  */
  const baseAccount = Keypair.generate();
  console.log(baseAccount,">>>>>>>>");
  
  const opts = {
    preflightCommitment: "processed"
  }
  const programID = new PublicKey(idl.metadata.address);

  const [value, setValue] = useState(null);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    // const network = "http://127.0.0.1:8899";
    const network = " https://api.devnet.solana.com";

   
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
   async function createKeypairFromFile(
    filePath: string,
  ): Promise<Keypair> {
    const secretKeyString = await fs.readFile(filePath, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    console.log('XXXXX', filePath);
    
    return Keypair.fromSecretKey(secretKey);
  }

  async function createCounter() {    

    const provider = await getProvider()
    console.log(provider.wallet.publicKey.toBase58(),"PROVIDER");
    
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
      /* interact with the program via rpc */
      let amount   = new BN(6);
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    console.log(provider.wallet.publicKey.toBase58(),"PROVIDER---");

    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }
async function deposit() {
  // alert(">>>>>")
  const remainingAccounts=[];
  const provider = await getProvider()
  console.log(provider.connection,"PROVIDER");
  
  // /* create the program interface combining the idl, program ID, and provider */
  const program = new Program(idl, programID, provider);
console.log(program,">>>>>>>IDL");
const myAccount = Keypair.generate();

let amount = new BN(8000000)

  // const donator = anchor.web3.Keypair.generate();
  // const donator = await createKeypairFromFile('/home/user/.config/solana/devnet.json');
 
  let x : Uint8Array = Uint8Array.from([252,146,113,168,220,154,11,88,123,153,110,149,37,222,137,86,15,88,177,68,200,128,21,40,253,87,45,68,123,22,181,154,252,71,251,152,126,242,42,6,134,49,175,134,134,196,87,17,222,235,54,178,74,104,51,148,208,164,115,87,106,227,161,78]);
  const donator = Keypair.fromSecretKey(x);
  
  console.log(donator.publicKey.toBase58(), provider.wallet.publicKey.toBase58(),">>>>>");

  await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(donator.publicKey, 10000000000),
      "confirmed"
    );

    const tx = await program.rpc.sendDonation(amount, {
      accounts: {
          baseAccount: donator.publicKey,
          user:baseAccount.publicKey ,
          systemProgram: SystemProgram.programId,
      },
      signers: [donator],
    });

    const balance = await program.account.baseAccount.getAccountInfo(donator.publicKey);
  console.log(balance,">>>>> BALANCE");

    // expect(balance.lamports.toString()).equal("100");


//   try {
//       let Key = new web3.PublicKey("EJdcLY3VzzvV23VLsrbcM66fy9cJ8xuzzU2PGLE83RYS")
//      console.log(Key.toBase58(),">>>>>KEY");
//      let amount = new BN(1 **LAMPORTS_PER_SOL)
//      console.log('Lamports : ', amount);
// let instructions =[];
//      instructions.push(
//       await program.instruction.sendDonation(amount,{
//         accounts: {
//           baseAccount: baseAccount.publicKey,
//           user: provider.wallet.publicKey,
//           systemProgram: SystemProgram.programId,
//         },
//         // remainingAccounts:
//         // remainingAccounts.length > 0 ? remainingAccounts : undefined,
//         signers: [],
  
  
//       }));

    
//         await sendTransactionWithRetryWithKeypair(
//           program.provider.connection,
//           userKeyPair,
//           instructions,
//           [],
//         )
      
//     }
    // await program.rpc.sendDonation(amount,{
    //   accounts: {
    //     baseAccount: baseAccount.publicKey,
    //     user: provider.wallet.publicKey,
    //     systemProgram: SystemProgram.programId,
    //   },
    //   // remainingAccounts:
    //   // remainingAccounts.length > 0 ? remainingAccounts : undefined,
    //   signers: [],


    // })
  // } catch (error) {
  //  console.log('error', error);
    
  // }
}


  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div>
          {
            !value && (<button onClick={createCounter}>Create counter</button>)
          }
          {
            value && <button onClick={increment}>Increment counter</button>
          }

          {
            value && value >= Number(0) ? (
              <h2>{value}</h2>
            ) : (
              <h3>Please create the counter.</h3>
            )
          }
          <><Button onClick={deposit }> DEPOSIT</Button></>
        </div>
      </div>
    );
  }
}
// import { Connection, PublicKey } from "@solana/web3.js";
// import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
// import { Connection, clusterApiUrl, LAMPORTS_PER_SOL,PublicKey } from "@solana/web3.js";
// import { getParsedNftAccountsByOwner,isValidSolanaAddress, createConnectionConfig,} from "@nfteyez/sol-rayz";
// import axios from "axios"
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// import React, { useEffect, useState } from "react";
// import {Layout} from 'buffer-layout';

// import { Button } from "antd";
// //Import all above libraries
// export const  App = (props) => {
//   const [nftData, setNftData] = useState([]);
//   const [loading, setLoading] = useState(false);
// //Define createConnection function here
// //create a connection of devnet
// const connection = new Connection("https://api.devnet.solana.com");

// const createConnection = () => {
//     return new Connection("https://api.devnet.solana.com");
// };

// // const abc = async () => {
// //     let mintPubkey = new PublicKey("9MwGzSyuQRqmBHqmYwE6wbP3vzRBj4WWiYxWns3rkR7A");
// //     let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
  
// //     // const tokenmeta = await Metadata.load(connection, tokenmetaPubkey);
// //     console.log("tokenmetadadt");
// //   }
// //   abc()
//   // / (async () => {
// //   let mintPubkey = new PublicKey("HsbfzaDq3uJX5ZhpZHz13pKG1HeiYGyb4DfBS6ieVTNY");
// //   let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);

// //   const tokenmeta = await Metadata.load(connection, tokenmetaPubkey);
// //   console.log(tokenmeta,"tokenmetadadt");
// // })();
//   //Define getProvider function here
//   const getProvider = () => {
//     if ("solana" in window) {
//     const provider = window.solana;
//     // console.log(provider);
    
//     if (provider.isPhantom) {
//         console.log(provider,"........");
//         provider.connect()
//       return provider;
//      }
//     }
//   };
//   //Define getAllNftData function here
//   //get NFT
// const getData =async()=>{

//   let response = await connection.getTokenAccountsByOwner(
//     new PublicKey("27kVX7JpPZ1bsrSckbR76mV6GeRqtrjoddubfg2zBpHZ"), // owner here
//     {
//       programId: TOKEN_PROGRAM_ID,
//     }
//   );
//   console.log(response,">>>RESPONSE");
  
// }


//   const getAllNftData = async () => {
//     try {
//     //   if (connectData === true) {
//         const connect =    createConnectionConfig(clusterApiUrl("devnet"));
//         // console.log(connect,"connect");
//         // let response = await connect.getTokenAccountsByOwner(
//         //   new PublicKey("27kVX7JpPZ1bsrSckbR76mV6GeRqtrjoddubfg2zBpHZ"), // owner here
//         //   {
//         //     programId: TOKEN_PROGRAM_ID,
//         //   }
//         // );
//         const provider = getProvider();
//         let ownerToken = provider.publicKey;
//         console.log(ownerToken.toBase58());
        
//         const result = isValidSolanaAddress(ownerToken);
//         console.log("result", result);
// const nfts = await getParsedNftAccountsByOwner({
//           publicAddress: ownerToken,
//           connection: connect,
//           serialization: true,
//         });
//         console.log(nfts);
//         // getNftTokenData()
//         return nfts;
  
   
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const getNftTokenData = async () => {
//     try {
//       let nftData:any = await getAllNftData();
//       var data = Object.keys(nftData).map((key) => nftData[key]);                                                                    let arr = [];
//       let n = data.length;
//       for (let i = 0; i < n; i++) {
//         console.log(data[i].data.uri);
//         let val = await axios.get(data[i].data.uri);
//         console.log(val,"vallllllllllll");
        
//         arr.push(val);
//       }
//       return arr;
//     } catch (error) {
//       console.log(error);
//     }
//   };    
// useEffect(() => {
//     async function data() {
//       let res = await getAllNftData();
//       console.log(res,"res");
      
//       setNftData(res);
//       setLoading(true);
//     }
//     data();
//   }, []);

// const fetchNfts =async()=>{
// let data = await getNftTokenData()
// console.log(data,"data");


// }


// return (
//     <>
//           <section className="nft mt-2 my-5">
//             <div className="container">
//               <div className="row text-center">
//                 <div className="col-12">
//                   <h4 className="title">NFT</h4>
//                 </div>
//                 <Button onClick={getProvider }>CONNECT</Button>
//                 <Button onClick={fetchNfts }>GET</Button>

//               </div>
//               <div className="row  d-flex justify-content-center">
//                 {loading ? (
//                   <>
//                   {console.log(nftData,"//////////")
//                   }
//                     {nftData &&
//                       nftData.length > 0 &&
//                       nftData.map((val, ind) => {
//                           console.log(val.data.uri,"vallll");
                          
//                         return (
//                           <div className="col-4 mt-3" key={ind}>
//                             <div className="cart text-center">
//                               <div className="img mt-4 pt-3">
//                                 <img src={val.data.image} alt="loading..." />
//                                 <p className="mt-1">{val.data.name}</p>
//                                 <h6 className=" mt-2">
//                                   {val.data.description}
//                                 </h6>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                   </>
//                 ) : (
//                   <>
//                     <p className="text-center">loading...</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </section>
//     </>
//   );
// };