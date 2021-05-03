const storageManagerSupported = (): boolean => (
    navigator.storage &&
    Boolean(navigator.storage.estimate) &&
    Boolean(navigator.storage.persist) &&
    Boolean(navigator.storage.persisted)
);

export default storageManagerSupported;