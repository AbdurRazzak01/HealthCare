import Web3 from 'web3';
import healthcareABI from './HealthcareABI.json';

const provider = new Web3.providers.HttpProvider('https://rpc.api.moonbeam.network');
const web3 = new Web3(provider);

const contractAddress = '0xDF8726ceEa42Aa21C1E2788934743743eFa5Dc72';
const healthcareContract = new web3.eth.Contract(healthcareABI, contractAddress);

export { healthcareContract, provider };
