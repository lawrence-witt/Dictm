import StorageService from './redux/services/StorageService/StorageService';

declare global {
    interface Window { 
        DictmStorageService: StorageService
    }
}

export {};