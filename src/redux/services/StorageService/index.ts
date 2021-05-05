import StorageService from './StorageService';

window.DictmStorageService = window.DictmStorageService || new StorageService();

export { UserSession } from './StorageService.types';

export default window.DictmStorageService;