import { readDirectory, removeExtension, filterByExtension, parseFile } from './fs-dir.js'
import { EvaSTUtil } from 'eva-st-util'

const dirLength = removeExtension(filterByExtension(readDirectory('posts'), ".md")).length;

export function postListFs(): string[] {
    console.log(dirLength);

    let list: string[] = [];

    const fileNames = removeExtension(filterByExtension(readDirectory('posts'), ".md"));

    for(let i = 0; i < dirLength; i++) {
        //check if the searched index for character '-' in file name is found
        if(fileNames[i].indexOf('-') > -1) {
            list.push(`<li>${fileNames[i]}</li>`);
        //else, check if the searched index for character '-' in file name is not found
        } else if(fileNames[i].indexOf('-') === -1) {
            console.log(fileNames[i]);
        }
    }

    return list;
}

    const str: string[] = [];

    const tree = EvaSTUtil.getFrontmatterTree_ST(parseFile('posts/test-post.md'));

    for(let i of EvaSTUtil.traverseTree_ST(tree, 'yaml')) {
        //console.log(i);
        str.push(i);
    }

    console.log(str);

    console.log(str[1]);
    
    //console.log(typeof(str[1]));