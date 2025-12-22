import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private encryptionService: EncryptionService) {}

  set(key: string, data: any): void {
    try {
      if (environment?.enableEncryption) {
        localStorage.setItem(key, JSON.stringify(this.encryptionService.encryptData(data)));
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Error saving to session storage', e);
    }
  }

  get(key: string) {
    try {
      let itemDetails = localStorage.getItem(key);
      if (environment?.enableEncryption) {
        return itemDetails ? this.encryptionService.decryptData(JSON.parse(itemDetails)) : null;
      } else {
        return itemDetails ? JSON.parse(itemDetails) : null;
      }
    } catch (e) {
      console.error('Error getting data from session storage', e);
      return null;
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data from session storage', e);
    }
  }

  removeAll() {
    try {
      var n = localStorage.length;
      while (n--) {
        var key = localStorage.key(n);
        localStorage.removeItem(key ?? '');
      }
    } catch (e) {
      console.error('Error removing data from session storage', e);
    }
  }
}
