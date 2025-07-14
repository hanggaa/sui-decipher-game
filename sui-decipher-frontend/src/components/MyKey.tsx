// file: src/components/MyKey.tsx (VERSI BERSIH)

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

// ID dari smart contract Anda yang sudah berhasil di-publish
const PACKAGE_ID = "0x0b0fa2ec115172214e2489eb4db14f3bf1d644729c0f3a2fa686c26e2f204a7f";
const KEY_TYPE = `${PACKAGE_ID}::game::GAME`;

// Tipe data ini diekspor agar bisa digunakan di file lain
export type DecipherKey = {
    id: string;
    rarity: number;
    generation: number;
}

// Tipe untuk props yang akan diterima komponen ini dari App.tsx
type MyKeyProps = {
    onKeyUpdate: (key: DecipherKey | null) => void;
}

export function MyKey({ onKeyUpdate }: MyKeyProps) {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [myKey, setMyKey] = useState<DecipherKey | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!account?.address) {
            setMyKey(null);
            onKeyUpdate(null);
            return;
        }

        setLoading(true);
        suiClient.getOwnedObjects({
            owner: account.address,
            filter: { StructType: KEY_TYPE },
            options: { showContent: true },
        })
        .then(response => {
            if (response.data && response.data.length > 0) {
                const keyObject = response.data[0].data?.content;
                if (keyObject?.type === KEY_TYPE && 'fields' in keyObject) {
                    const keyData: DecipherKey = {
                        id: keyObject.fields.id.id,
                        rarity: keyObject.fields.rarity,
                        generation: Number(keyObject.fields.generation),
                    };
                    setMyKey(keyData);
                    onKeyUpdate(keyData);
                }
            } else {
                setMyKey(null);
                onKeyUpdate(null);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }, [account, suiClient, onKeyUpdate]);

    if (!account) return null;

    if (loading) {
        return <p className="text-center text-gray-400 my-4">Mencari kunci Anda...</p>;
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Kunci Anda</h2>
            {myKey ? (
                <div>
                    <p><span className="font-semibold">Rarity:</span> {myKey.rarity === 3 ? 'Legendary' : myKey.rarity === 2 ? 'Epic' : 'Common'}</p>
                    <p><span className="font-semibold">Generation:</span> {myKey.generation}</p>
                    <p className="text-xs text-gray-400 mt-2 truncate">ID: {myKey.id}</p>
                </div>
            ) : (
                <p>Anda belum memiliki DecipherKey. Mint satu dari SUI CLI.</p>
            )}
        </div>
    );
}