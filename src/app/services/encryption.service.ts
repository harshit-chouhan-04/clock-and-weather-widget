import { Injectable } from '@angular/core';
import * as CryptoJS2 from 'crypto-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  encryptData(data: any) {
    let secretKey = environment.encryptionKey;
    let hashedData = CryptoJS2.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return hashedData;
  }

  decryptData(data: any) {
    if (!data) {
      return null;
    }

    let secretKey = environment.encryptionKey;
    const bytes = CryptoJS2.AES.decrypt(data, secretKey);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS2.enc.Utf8));
    }
    return data;
  }

  sha256(value: string): string | null {
    try {
      if (!value) return null;
      return CryptoJS2.SHA256(value.trim().toLowerCase()).toString(CryptoJS2.enc.Hex);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
