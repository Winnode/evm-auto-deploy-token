import readline from 'readline';
import displayHeader from './utils/displayHeader.js';
import { chains } from '../config/chains.js';
import WalletManager from './utils/WalletManager.js';
import TokenDeployService from './services/TokenDeployService.js';
import TokenTransferService from './services/TokenTransferService.js';

class TokenCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    await displayHeader();
  }

  async question(query) {
    return new Promise((resolve) => {
      this.rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  }

  async selectChain() {
    try {
      if (chains.length === 1) {
        console.log(`\n🌐 Menggunakan chain: ${chains[0].name}`);
        return chains[0];
      }

      console.log('\n🌐 Chain yang tersedia:');
      chains.forEach((chain, index) => {
        console.log(`${index + 1}. ${chain.name}`);
      });

      const answer = await this.question('\nPilih chain (masukkan nomor): ');
      const selection = parseInt(answer) - 1;

      if (selection >= 0 && selection < chains.length) {
        console.log(`\n✅ Chain terpilih: ${chains[selection].name}`);
        return chains[selection];
      } else {
        throw new Error('Pilihan chain tidak valid');
      }
    } catch (error) {
      console.error('Error pemilihan chain:', error.message);
      process.exit(1);
    }
  }

  async getTokenDetails() {
    const name = await this.question('\nMasukkan nama token: ');
    const symbol = await this.question('Masukkan simbol token: ');
    const supply = await this.question('Masukkan jumlah supply awal: ');

    if (!name || !symbol || !supply || isNaN(supply) || parseFloat(supply) <= 0) {
      throw new Error('Detail token tidak valid');
    }

    return { name, symbol, supply: parseFloat(supply) };
  }

  async selectOperation() {
    console.log('\n📝 Pilih operasi yang akan dilakukan:');
    console.log('1. Deploy token baru');
    console.log('2. Transfer token ke alamat dari wallet.txt');
    console.log('3. Transfer token ke wallet baru');

    const answer = await this.question('\nPilih operasi (1-3): ');
    const selection = parseInt(answer);

    if (selection >= 1 && selection <= 3) {
      return selection;
    } else {
      throw new Error('Pilihan operasi tidak valid');
    }
  }

  async getTransferDetails() {
    const contractAddress = await this.question('\nMasukkan alamat kontrak token: ');
    const amount = await this.question('Masukkan jumlah token yang akan ditransfer: ');

    if (!contractAddress || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error('Detail transfer tidak valid');
    }

    return { contractAddress, amount: parseFloat(amount) };
  }

  async getNumberOfWallets() {
    const answer = await this.question('\nMasukkan jumlah wallet yang akan dibuat: ');
    const number = parseInt(answer);

    if (isNaN(number) || number <= 0) {
      throw new Error('Jumlah wallet tidak valid');
    }

    return number;
  }

  async run() {
    try {
      await this.initialize();
      const chain = await this.selectChain();
      const walletManager = new WalletManager(chain);
      
      const privateKey = await this.question('\nMasukkan private key wallet: ');
      await walletManager.initializeWallet(privateKey);

      const operation = await this.selectOperation();

      if (operation === 1) {

        const tokenDetails = await this.getTokenDetails();
        const tokenDeployService = new TokenDeployService(walletManager);
        await tokenDeployService.deployToken(
          tokenDetails.name,
          tokenDetails.symbol,
          tokenDetails.supply
        );
      } else {
        const transferDetails = await this.getTransferDetails();
        const tokenTransferService = new TokenTransferService(walletManager);

        if (operation === 2) {
          await tokenTransferService.transferFromWalletTxt(
            transferDetails.contractAddress,
            transferDetails.amount
          );
        } else {
          const numberOfWallets = await this.getNumberOfWallets();
          await tokenTransferService.transferToNewWallets(
            transferDetails.contractAddress,
            numberOfWallets,
            transferDetails.amount
          );
        }
      }

      this.rl.close();
    } catch (error) {
      console.error('Error:', error.message);
      this.rl.close();
      process.exit(1);
    }
  }
}

export default TokenCLI;
