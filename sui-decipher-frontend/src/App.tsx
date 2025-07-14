// file: src/App.tsx

import { useState } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { MyKey } from './components/MyKey';
import type { DecipherKey } from './components/MyKey';
import { GameRoom } from './components/GameRoom';

const PACKAGE_ID = "0x0b0fa2ec115172214e2489eb4db14f3bf1d644729c0f3a2fa686c26e2f204a7f";

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [currentKey, setCurrentKey] = useState<DecipherKey | null>(null);

  const handleClaimReward = (answer: string) => {
    if (!account?.address) {
      alert("Silakan connect wallet terlebih dahulu!");
      return;
    }

    if (!currentKey) {
      alert("Anda perlu memiliki DecipherKey untuk mengklaim hadiah!");
      return;
    }

    // Jawaban yang benar adalah "peta"
    if (answer.toLowerCase() !== "peta") {
      alert("Jawaban salah! Coba lagi.");
      return;
    }

    // Buat transaction untuk mengklaim hadiah
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::game::claim_reward`,
      arguments: [
        tx.object(currentKey.id),
        tx.pure.string(answer)
      ],
    });

    // Kirim transaction
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log('Transaction berhasil:', result);
          alert("Selamat! Hadiah berhasil diklaim!");
        },
        onError: (error) => {
          console.error('Transaction gagal:', error);
          alert("Gagal mengklaim hadiah. Silakan coba lagi.");
        }
      }
    );
  };

  const handleKeyUpdate = (key: DecipherKey | null) => {
    setCurrentKey(key);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-cyan-300">SUI Decipher Game</h1>
          <p className="text-lg text-gray-300">Pecahkan teka-teki dan klaim hadiah Anda!</p>
        </div>

        <div className="flex justify-center mb-8">
          <ConnectButton />
        </div>

        {account && (
          <div className="max-w-2xl mx-auto">
            <MyKey onKeyUpdate={handleKeyUpdate} />
            <GameRoom 
              keyRarity={currentKey?.rarity} 
              onClaimReward={handleClaimReward}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;