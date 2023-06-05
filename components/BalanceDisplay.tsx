import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const BalanceDisplay: FC = () => {
  const [balance, setBalance] = useState(0);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getBalance(publicKey).then((info) => {
      setBalance(info);
    });
  }, [connection, publicKey]);

  return (
    <div>
      <p>{publicKey ? `Balance: ${balance / LAMPORTS_PER_SOL}` : ''}</p>
    </div>
  );
};

export default BalanceDisplay;
