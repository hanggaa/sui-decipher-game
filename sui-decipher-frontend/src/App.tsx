// file: src/App.tsx (VERSI BERSIH)

import { useState } from 'react';
import {
    SuiClientProvider,
    WalletProvider,
    ConnectButton,
    useSignAndExecuteTransactionBlock,
    useCurrentAccount,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import '@mysten/dapp-kit/dist/index.css';

// Impor komponen dan tipe data kita yang sudah benar
import { MyKey, type DecipherKey as KeyType } from './components/MyKey';
import { GameRoom } from './components/GameRoom';

const networks = {
    testnet: { url: getFullnodeUrl('testnet') },
};

// ID dari smart contract Anda yang sudah berhasil di-publish
const PACKAGE_ID = "0x0b0fa2ec115172214e2489eb4db14f3bf1d644729c0f3a2fa686c26e2f204a7f";
const TREASURY_CAP_ID = "0x2d8716ccc168aaaa0e9d7e4a1391d969afc41dc6b5e2fa95fb61c1361d642dbb";

function AppContent() {
    const account = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
    const [myKey, setMyKey] = useState<KeyType | null>(null);

    const handleClaimReward = (answer: string) => {
        if (!account || !answer) return;

        const txb = new TransactionBlock();
        txb.moveCall({
            target: `${PACKAGE_ID}::game::claim_reward`,
            arguments: [
                txb.object(TREASURY_CAP_ID),
                txb.pure(answer.toUpperCase()),
            ],
        });

        signAndExecute({
            transactionBlock: txb,
        }, {
            onSuccess: (result) => {
                alert(`Hadiah berhasil diklaim! Digest: ${result.digest}`);
            },
            onError: (error) => {
                alert(`Klaim gagal: ${error.message}`);
            },
        });
    };

    return (
        <main className="w-full max-w-4xl">
            {account && <MyKey onKeyUpdate={setMyKey} />}
            {account && <GameRoom keyRarity={myKey?.rarity} onClaimReward={handleClaimReward} />}
        </main>
    );
}

function App() {
    return (
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
            <WalletProvider autoConnect>
                <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center p-8 font-sans">
                    <header className="w-full max-w-4xl flex justify-between items-center mb-12">
                        <h1 className="text-3xl font-bold text-cyan-400">Sui Decipher</h1>
                        <ConnectButton />
                    </header>
                    <AppContent />
                </div>
            </WalletProvider>
        </SuiClientProvider>
    );
}

export default App;