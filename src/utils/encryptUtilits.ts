import Cryptr from 'cryptr';

import dotenv from 'dotenv';

dotenv.config();

const cryptr = new Cryptr(`${process.env.CRYPT_KEY}`);

export function compareCrypt (value: string, cryptedValue: string): boolean {

    const descryptedValue = cryptr.decrypt(cryptedValue);
    
    if(descryptedValue !== value) return false
    else return true

}

export function newCryptValue (value: string) {

    return cryptr.encrypt(value);
    
}