import { ContractAbstraction, ContractProvider, TezosToolkit, TransactionOperation } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { useEffect, useState } from 'react';
import { ContractStorage } from './types';

import { Card } from './components/Card';

function App() {
  const Tezos = new TezosToolkit("https://rpc.ghostnet.teztnets.xyz");
  const signer = new InMemorySigner('edsk2oGwSn7k4PhQwVNC2YRpwB87Nu1R6fVYp5RjHWqNA1abxr6bEy');
  Tezos.setProvider({ signer });

  const [contract, setContract] = useState<ContractAbstraction<ContractProvider>>();
  const [storage, setStorage] = useState<Record<string, string>>();
  const [entrypoints, setEntrypoints] = useState<string[][]>();

  const [paramType, setParamType] = useState<string>();
  const [param, setParam] = useState<string | number>();
  const [entrypoint, setEntrypoint] = useState<string>();

  const [recentOp, setRecentOp] = useState<TransactionOperation>();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setErrror] = useState<unknown>();
  
  const formatStorage = (storage: ContractStorage) => {
    const format: Record<string, string> = {};
    Object.entries(storage).forEach(([key, value]) => (format[key] = value.toString()));
    return format
  }
  console.log(process.env.SK)

  const contractAddress = 'KT1LL14HWbhnbh45WrB1ZxNNswx8ttu6Ht2Z';
  useEffect(() => {
    (async () => {
      const contract = await Tezos.contract.at(contractAddress);
      setContract(contract);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    (async () => {
      if (!contract) return; // if contract is not set, return
      const storage = await contract?.storage<ContractStorage>();

      setStorage(formatStorage(storage));
      const getEntrypoints = contract?.parameterSchema.ExtractSignatures();
      setEntrypoints(getEntrypoints);
    })();
  }, [contract])

  return (
    <div className='h-full w-full bg-gray-800'>
      <div className='p-4 w-full h-full'>
        {storage && (
          <Card className='w-fit absolute'>
            {Object.keys(storage).map((key) => (
              <div className='flex' key={key}>
                <p className='pr-4'>{key}:</p>
                <p>{storage[key].length >= 1 ? storage[key] : `""`}</p>
              </div>))
            }
          </Card>
        )}
        {entrypoints && (
          <div className='w-full h-full flex justify-center items-center'>
            <Card className='w-2/5'>
              <>
              {!entrypoint && entrypoints.map(([name, type], index) => (
                <div className='flex justify-between' key={name}>
                  <div className='flex'>
                    <p className='pr-4'>Entrypoint #{index + 1}:</p>
                    <p className='pr-2'> {name}</p>
                    <p className='pr-2'>param: {type}</p>
                  </div>
                  <button className='border bg-green-100 rounded-md px-2 mb-2' onClick={() => {
                    setEntrypoint(name)
                    setParamType(type)
                    }}>Interact</button>
                </div>
              ))}
              {entrypoint && (
                <>
                  <div className='flex justify-between'>
                    <input type="text" onChange={(e) => setParam(paramType === 'int' ? Number(e.target.value) : e.target.value)}/>
                    {!loading ?
                    <button className='border bg-green-100 rounded-md px-2 mb-2' onClick={async () => {
                      try {
                        // setContract(await Tezos.contract.at(contractAddress))
                        if (!contract) return;
                        setErrror(undefined);
                        const op = await contract.methods[entrypoint](param).send();
                        setRecentOp(op);
                        setLoading(true);
                        await op?.confirmation();
                        setLoading(false);
                        const storage = await contract.storage<ContractStorage>();
                        setStorage(formatStorage(storage));
                      } catch (error) {
                        setErrror(error);
                      }
                      
                    }}>Send</button> : <p className='px-2 mb-2'>Loading...</p>
                  }
                </div>
                <button className='underline pt-4' onClick={() => setEntrypoint(undefined)}>go back</button>
              </>
              )}
              {error && (
                <div>
                  <p className='text-red-500'>{JSON.stringify(error)}</p>
                </div>
              )}
              {recentOp && (
                <div>
                  <p className='text-green-500'>{JSON.stringify(recentOp.raw)}</p>
                </div>
              )}
              </>
            </Card>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default App;
