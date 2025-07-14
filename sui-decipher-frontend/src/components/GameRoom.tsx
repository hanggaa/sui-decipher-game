// file: src/components/GameRoom.tsx

import { useState } from 'react';

// Komponen ini menerima `props` dari induknya
// Kita definisikan bentuk props-nya di sini
type GameRoomProps = {
    keyRarity: number | undefined; // Rarity bisa jadi belum ada jika user tak punya kunci
    onClaimReward: (answer: string) => void; // Fungsi untuk mengklaim hadiah
}

export function GameRoom({ keyRarity, onClaimReward }: GameRoomProps) {
    // "Papan tulis" untuk menyimpan jawaban teka-teki dari pengguna
    const [answer, setAnswer] = useState('');

    const handleClaimClick = () => {
        if (!answer) {
            alert("Tolong isi jawaban teka-teki!");
            return;
        }
        onClaimReward(answer);
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Ruang Teka-teki</h2>
            
            <p className="mb-4">"Aku punya kota, tapi tak punya rumah. Aku punya gunung, tapi tak punya pohon. Aku punya air, tapi tak punya ikan. Siapakah aku?"</p>

            {/* Bantuan akan muncul jika rarity kuncinya 3 (Legendary) */}
            {keyRarity === 3 && (
                <p className="text-sm text-yellow-300 bg-yellow-900/50 p-2 rounded-md mb-4">
                    Bantuan (Legendary): Jawabannya adalah sebuah objek yang sering kamu lihat saat belajar geografi.
                </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Tulis jawaban Anda di sini"
                    className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                    onClick={handleClaimClick}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    Klaim Hadiah
                </button>
            </div>
        </div>
    );
}