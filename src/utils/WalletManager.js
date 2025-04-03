import { ethers } from 'ethers';
import { chains } from '../../config/chains.js';

class WalletManager {
  constructor(chain) {
    this.chain = chain;
    this.provider = null;
    this.wallet = null;
  }

  async initializeWallet(privateKey) {
    try {
      this.provider = new ethers.JsonRpcProvider(this.chain.rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(`\n🔗 Connected to ${this.chain.name}`);
      console.log(`📍 Wallet Address: ${this.wallet.address}`);
      console.log(`💰 Balance: ${ethers.formatEther(balance)} ${this.chain.symbol}\n`);

      return this.wallet;
    } catch (error) {
      console.error('Failed to initialize wallet:', error.message);
      throw error;
    }
  }

  getProvider() {
    return this.provider;
  }

  getWallet() {
    return this.wallet;
  }
}

export default WalletManager;
