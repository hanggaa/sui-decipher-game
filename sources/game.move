// file: sui_decipher/sources/game.move (VERSI FINAL DENGAN ATURAN EMAS)

module sui_decipher::game {
    // Membersihkan 'use' untuk menghilangkan semua warning.
    use sui::coin::{Self, Coin, CoinMetadata};
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};

    // =================================================================
    // ASET GAME
    // =================================================================

    public struct DecipherKey has key, store {
        id: object::UID,
        rarity: u8,
        generation: u64,
    }

    // DIUBAH: Nama Witness HARUS sama dengan nama modul dalam huruf kapital.
    public struct GAME has drop {}

    const PUZZLE_ANSWER: vector<u8> = b"PETA";

    // =================================================================
    // FUNGSI INISIALISASI
    // =================================================================

    // DIUBAH: Menerima `otw: GAME` sebagai argumen.
    fun init(otw: GAME, ctx: &mut TxContext) {
        // DIUBAH: Menggunakan <GAME> sebagai tipe generik.
        let (treasury_cap, metadata) = coin::create_currency<GAME>(
            otw, // Menggunakan witness dari argumen.
            9,
            b"DCPHR", // Simbol boleh tetap DCPHR
            b"Decipher Token",
            b"Token hadiah untuk game Sui Decipher",
            option::none(),
            ctx,
        );
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        transfer::public_share_object(metadata);
    }

    // =================================================================
    // FUNGSI PUBLIK (ENTRYPOINTS)
    // =================================================================

    public entry fun mint_key(
        rarity: u8,
        generation: u64,
        ctx: &mut TxContext,
    ) {
        let key = DecipherKey {
            id: object::new(ctx),
            rarity: rarity,
            generation: generation,
        };
        transfer::public_transfer(key, tx_context::sender(ctx));
    }

    public entry fun claim_reward(
        // DIUBAH: Menggunakan <GAME> sebagai tipe generik.
        treasury_cap: &mut coin::TreasuryCap<GAME>,
        player_answer: String,
        ctx: &mut TxContext,
    ) {
        let correct_answer = PUZZLE_ANSWER;
        assert!(string::as_bytes(&player_answer) == correct_answer, 1);

        // DIUBAH: Menggunakan <GAME> sebagai tipe generik.
        let reward: Coin<GAME> = coin::mint(treasury_cap, 100_000_000_000, ctx);
        transfer::public_transfer(reward, tx_context::sender(ctx));
    }
}