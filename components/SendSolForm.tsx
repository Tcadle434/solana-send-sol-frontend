import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../styles/Home.module.css';

export const SendSolForm: FC = () => {
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferAddress, setTransferAddress] = useState('');
  const [txSig, setTxSig] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : '';
  };

  const sendSol = (event) => {
    event.preventDefault();

    if (!publicKey || !connection) {
      alert('Please connect your wallet first');
      return;
    }

    const transaction = new Web3.Transaction();

    const transferInstruction = Web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new Web3.PublicKey(transferAddress),
      lamports: Web3.LAMPORTS_PER_SOL * transferAmount,
    });

    transaction.add(transferInstruction);

    sendTransaction(transaction, connection).then((sig) => {
      setTxSig(sig);
    });
  };

  return (
    <div>
      <form onSubmit={sendSol} className={styles.form}>
        <label htmlFor='amount'>Amount (in SOL) to send:</label>
        <input
          id='amount'
          type='text'
          className={styles.formField}
          placeholder='e.g. 0.1'
          required
          onChange={(event) => {
            setTransferAmount(Number(event.target.value));
          }}
          value={transferAmount}
        />
        <br />
        <label htmlFor='recipient'>Send SOL to:</label>
        <input
          id='recipient'
          type='text'
          className={styles.formField}
          placeholder='e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA'
          required
          onChange={(event) => {
            setTransferAddress(event.target.value);
          }}
          value={transferAddress}
        />
        <button type='submit' className={styles.formButton}>
          Send
        </button>
      </form>

      {txSig ? (
        <div>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};
