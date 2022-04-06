
const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';



import { PublicKey } from '@solana/web3.js';
import React from 'react';

type Props = {};

export default function Mint({ }: Props) {
    //  const abc = useWallet()


    const mint = (async () => {
        // Connect to cluster
        const connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed',
        );
        console.log(connection);

        // Generate a new wallet keypair and airdrop SOL
         var fromWallet = web3.Keypair.generate();
        // let secretiey = Uint8Array.from([84, 58, 82, 31, 100, 74, 35, 114, 137, 218, 233, 144, 186, 125, 97, 51, 51, 250, 219, 103, 198, 88, 246, 132, 69, 81, 91, 68, 231, 175, 57, 237, 168, 101, 14, 172, 202, 214, 89, 170, 170, 209, 115, 228, 41, 185, 151, 182, 172, 181, 183, 200, 254, 89, 91, 139, 132, 151, 231, 88, 132, 157, 164, 98]);
        // var fromWallet = web3.Keypair.fromSecretKey(secretiey);
        console.log(fromWallet, "fromWallet");

        // debugger
        var fromAirdropSignature = await connection.requestAirdrop(
            fromWallet.publicKey,
            web3.LAMPORTS_PER_SOL,
        );

        // Wait for airdrop confirmation
        await connection.confirmTransaction(fromAirdropSignature);

        // Generate a new wallet to receive newly minted token
        const toWallet = web3.Keypair.generate();
        //    const toWallet = new web3.PublicKey("DCw5JWmjvREYjautuMgy7dpEC6jo1a9sn2AoiqVHxRvH")
        console.log(toWallet.publicKey.toBase58(), "///////");

        //  Create new token mint
        const mint = await splToken.Token.createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            9,
            splToken.TOKEN_PROGRAM_ID,  
        );
        console.log(splToken, "mint");

       // debugger
        // Get the token account of the fromWallet Solana address, if it does not exist, create it
        const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
            fromWallet.publicKey,
        );

        //get the token account of the toWallet Solana address, if it does not exist, create it
        const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
            toWallet.publicKey,
        );
        console.log(toTokenAccount.address.toBase58(), "to");
        console.log(fromTokenAccount.address.toBase58(), "fromTokenAccount");
        // mint JAEsMZqrik14Hm7xtCa8hsjeqq1N6P4Z2RsQCrJHyi81 token address
        //tokenaccount address from 6PFmdzUXf6FhA3vrJamAK5mbWM4GZ8o6fSwSE829AXUz
        //tokenaccount address to 7JgvaXREjiKbtzT4cjKYr9n2RCfBm5NTQF4yj4h6aJ3y
        // Minting 1 new token to the "fromTokenAccount" account we just returned/created
        await mint.mintTo(
            fromTokenAccount.address,
            fromWallet.publicKey,                       
            [],
            200000000000000,
        );

        // Add token transfer instructions to transaction
        const transaction = new web3.Transaction().add(
            splToken.Token.createTransferInstruction(
                splToken.TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                [],
                1,
            ),
        );
        console.log();


        // Sign transaction, broadcast, and confirm
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet],
            { commitment: 'confirmed' },
        );
        console.log('SIGNATURE', signature);
    })

    const click = () => {
        // alert("hello")
        mint()
        console.log(web3);


    }
    return <div>
        <button onClick={click}>Click</button>
    </div>;
}


