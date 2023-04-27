import {ContractAbstraction, ContractProvider} from '@taquito/taquito';

export const incrementOperation = async (contract: ContractAbstraction<ContractProvider>) => {
  const op = await contract.methods.increment().send();
  return op 
}

export const decrementOperation = async (contract: ContractAbstraction<ContractProvider>) => {
  const op = await contract.methods.decrement().send();
  return op 
}

export const sendNameOperation = async (contract: ContractAbstraction<ContractProvider>, str: string) => {
  const op = await contract.methods.sendName(str).send();
  return op 
}
