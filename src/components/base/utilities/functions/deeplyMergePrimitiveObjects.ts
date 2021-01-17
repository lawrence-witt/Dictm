interface UnknownObject {
    [key: string]: unknown
}

const deeplyMergePrimitiveObjects = (
    target: UnknownObject = {}, 
    src: UnknownObject = {}
): UnknownObject => {
    const isObjLiteral = (test: unknown) => {
        return test && Object.getPrototypeOf(test) === Object.prototype;
    };

    return Object.keys(src).reduce((obj: UnknownObject, key) => {
        if (isObjLiteral(obj[key]) && isObjLiteral(src[key])) {
            obj[key] = deeplyMergePrimitiveObjects(
                obj[key] as UnknownObject, 
                src[key] as UnknownObject
            );
        } else {
            obj[key] = src[key];
        }

        return obj;
    }, {...target});
};

export default deeplyMergePrimitiveObjects;