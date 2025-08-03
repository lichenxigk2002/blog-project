import React from 'react';
import { useConnectModal } from '@crossbell/connect-kit';
import { useAccount } from 'wagmi';
import styles from './CrossbellConnect.module.scss';

export const CrossbellConnect: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const handleConnect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={styles.container}>
      {isConnected ? (
        <div className={styles.connected}>
          <span className={styles.status}>已连接</span>
          <span className={styles.address}>{formatAddress(address || '')}</span>
        </div>
      ) : (
        <button
          className={styles.connectButton}
          onClick={handleConnect}
        >
          连接钱包
        </button>
      )}
    </div>
  );
}; 