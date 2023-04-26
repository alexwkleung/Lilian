import fs from 'fs'
import path from 'path'

/**
 * readDirectory function
 * 
 * @param dirStr The directory to read from
 * @returns An array containing files from the directory
 */
export function readDirectory(dirStr: string): string[] {
    try {
        //read posts directory
        const readDir: string[] = fs.readdirSync(dirStr, 'utf-8');

        //return directory content
        return readDir;
    //catch exception thrown from fs
    } catch(error) {
        //throw exception message
        throw console.error(error);
    }
}

/**
 * removeExtension function
 * 
 * @param dirArr An array containing files from a directory 
 * @returns An array that contains only the file names of the directory
 */
export function removeExtension(dirArr: string[]): string[] {
    //assign reference of dir to readDir
    const readDir: string[] = dirArr;

    const pathName: string[] = [];

    //iterate over readDir
    for(let i = 0; i < readDir.length; i++) {
        //push names of path to end of array (no extension)
        pathName.push(path.parse(readDir[i]).name);
    }

    //return pathName
    return pathName;
}

/**
 * filterByExtension function
 * 
 * @param dirArr An array containing content from a directory
 * @param extension The extension type to filter (i.e., `.md`)
 * @returns An array containing the filtered directory files based on `extension`
 */
export function filterByExtension(dirArr: string[], extension: string): string[] {
    const readDir: string[] = dirArr;

    //see: https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript

    //return array containing filtered files based on extension
    return readDir.filter(mdFilter => [extension].some(end => mdFilter.endsWith(end)));
}

export function parseFile(path: string) {
    try {
        const readFile = fs.readFileSync(path, 'utf-8');

        return readFile;
    } catch(error) {
        throw console.error(error);
    }
}

//test
/*
const foo: string[] = readDirectory('posts');
for(let i = 0; i < foo.length; i++) {
    console.log(foo[i]);
}

//test
console.log(removeExtension(filterByExtension(readDirectory('posts'), ".md")));
*/