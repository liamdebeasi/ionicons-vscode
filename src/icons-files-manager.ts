import * as fs from 'fs';
import * as path from "path";

interface FileOperation {
    dirName: string;
    fileName: string;
    globalStorageUri: string;
}

interface SaveFileResponse {
    path: string;
}

export const createFilePath = (opts: FileOperation): string => {
    const filePath = path.join(opts.globalStorageUri, opts.dirName, opts.fileName);

    return filePath;
}

/** Will save a file in an already created folder */
export const saveFileInDir = (value: string, filePath: string): SaveFileResponse => {

    const dirname = path.dirname(filePath);

    makeDirRecusive(dirname);

    fs.writeFile(filePath, value , (error) => {
        if ( error ) {
            console.error(`error writing file.. to ${filePath}`, error);
        }

        console.log(`file written to ${filePath}`);
    });

    return {
        path: filePath
    };
}

/** returns whether a file exists or not */
export const fileExists = (filePath: string)  => {
    return fs.existsSync(filePath);
}

export const readFile = (filePath: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
}

/** Will create a folder if it doesnt already exist */
export const makeDirRecusive = (folder: string)  => {
    const parent = path.dirname(folder);
    if (!fs.existsSync(parent)) {
        makeDirRecusive(parent);
    }
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}
