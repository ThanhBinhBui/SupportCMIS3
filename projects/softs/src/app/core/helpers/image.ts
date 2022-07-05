export function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<object> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const obj = {};
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            const width = image.width;
            const height = image.height;
            if (width <= maxWidth && height <= maxHeight) {
                obj['width'] = width;
                obj['height'] = height;
                resolve(obj);
            }
            let newWidth;
            let newHeight;
            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
                obj['width'] = newWidth;
                obj['height'] = newHeight;
                resolve(obj);
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
                obj['width'] = newWidth;
                obj['height'] = newHeight;
                resolve(obj);
            }
        };
        image.onerror = reject;
    });
}
export function checkFileIsImg(extensionName): any {
    const extension = ['png', 'gif', 'jpeg', 'jpg'];
    if (extension.indexOf(extensionName) < 0) {
        return false;
    } else {
        return true;
    }
}
