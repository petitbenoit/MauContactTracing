import { Storage } from '@capacitor/storage';
import { Injectable } from '@angular/core';

//const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


 // Store the value
 async store(storageKey: string, value: any) {
   console.log('store value: ', value);
  const encryptedValue = btoa(escape(JSON.stringify(value)));
  await Storage.set({
  key: storageKey,
  value: encryptedValue
  });
  }

  // Get the value
  async getJson(storageKey: string) {
    const res = await Storage.get({ key: storageKey });
    return JSON.parse(unescape(atob(res.value)));
  }

  async get(storageKey: string) {
    return await Storage.get({ key: storageKey });
  }

  async removeStorageItem(storageKey: string) {
  await Storage.remove({ key: storageKey });
  }

  // Clear storage
  async clear() {
  await Storage.clear();
  }

}
