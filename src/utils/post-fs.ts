import { readDirectory, removeExtension, filterByExtension, parseFile } from './fs-dir.js'
import { EvaSTUtil } from 'eva-st-util'

const markdownFiles: string[] = filterByExtension(readDirectory('posts'), ".md");
const markdownFilesNoExt: string[] = removeExtension(markdownFiles);

const markdownFilesLength: number = markdownFiles.length;

console.log(markdownFiles);

export function postList(): string[] {
    const dirLength: number = markdownFilesNoExt.length;

    //console.log(dirLength);

    let list: string[] = [];

    const fileNames: string[] = markdownFilesNoExt;

    for(let i = 0; i < dirLength; i++) {
        list.push(`<li>${fileNames[i]}</li>`);
        //console.log(list[i]);

        //list.push(fileNames[i]);

        //check if the searched index for character '-' in file name is found
        /*
        if(fileNames[i].indexOf('-') > -1) {
            list.push(`<li>${fileNames[i]}</li>`);
        //else, check if the searched index for character '-' in file name is not found
        } else if(fileNames[i].indexOf('-') === -1) {
            list.unshift(`<li>${fileNames[i]}</li>`);
            //console.log(fileNames[i]);
        }
        */
    }

    //return list
    return list;
}

console.log(postList());

/**
 * getRawFrontmatterData function
 * 
 * @param files An array containing Markdown files (i.e., `['foo.md', 'bar.md']`)
 * @param directory The directory that the Markdown files are located in (i.e., `'foo/'`)
 * @returns An array containing frontmatter data (i.e., `['title: foo', 'date: bar']`)
 */
export function getRawFrontmatterData(files: string[], directory: string): string[] {
    let treeRef: string[] = [];
    let treeRefFm: string[] = [];
    
    //iterate over files
    for(let i of files) {
        //iterate over tree object
        for(let j of EvaSTUtil.traverseTree_ST(EvaSTUtil.getFrontmatterTree_ST(parseFile(directory + i)), 'yaml')) {
            treeRef.push(j);
        }
    }

    //console.log(treeRef);

    //index to track the frontmatter data position in the tree
    let frontmatterIndex: number = 1;

    //iterate over the length of files (each file has frontmatter data)
    for(let i = 0; i < files.length; i++) {
        //do something with the frontmatter data
        //console.log(treeRef[frontmatterIndex]);

        //push frontmatter data to treeRefFm
        treeRefFm.push(treeRef[frontmatterIndex]);

        //every 3 indices starting from index 1 contains the frontmatter data
        frontmatterIndex += 3;
    }

    return treeRefFm;
}

//console.log(getFrontmatterData(markdownFiles, 'posts/'));

export function formatFrontmatterData(frontmatterData: string[]): string[][] {
    const fmLength: number = frontmatterData.length;

    let matrix: string[][] = [];

    for(let i = 0; i < fmLength; i++) {
        matrix.push(frontmatterData[i].split('\n'));
    }

    //return matrix containing frontmatter data
    return matrix;
}

//console.log(formatFrontmatterData(getFrontmatterData(markdownFiles)));

/**
 * createPostMatrixData function
 * 
 * @param postMatrix A matrix containing post data (i.e., `[['title: foo', 'date: bar']]`)
 * @param directory The directory that the Markdown files are located in (i.e., `'foo/'`)
 * @returns Matrix containing post data
 */
export function createPostMatrixData(postMatrix: string[][], directory: string): string[][] {
    const postData: string[][] = postMatrix;

    let mdFilesIndex: number = 0;

    //iterate over matrix rows
    for(let i = 0; i < postData.length; i++) {
        if(mdFilesIndex < markdownFilesLength) {
            //push markdown file content to end of every matrix row
            postData[i].push(EvaSTUtil.MDtoHTML_ST(parseFile(directory + markdownFiles[mdFilesIndex])));

            //increment mdFilesIndex
            mdFilesIndex++;
        }
    }

    //return post data matrix
    return postData;
}

//console.log(formatPostMatrixData()[0][2]);

/**
 * extractActualFrontmatterData 
 * 
 * @param postData A matrix containing post data (i.e., `[['title: foo', 'date: bar']]`)
 * @returns A matrix of the actual frontmatter data (i.e., `[['title: foo', 'date: bar']] => [['foo', 'bar']]`)
 */
export function extractActualFrontmatterData(postData: string[][])/*: string[]*/ {
    let createPostMatrixTemp: string[][] = postData;
    
    let splitArrTemp: string[][] = [];
    let splitArr: string[][] = [];

    for(let i = 0; i < createPostMatrixTemp.length; i++) {
        for(let j = 0; j < 2; j++) {
            let temp: string[] = createPostMatrixTemp[i][j].split('title:' + ' ');
            splitArrTemp.push(temp);
        }
    }

    //console.log(splitArrTemp);

    let noEmptyStrTemp: string[] = [];
    let noEmptyStr: string[] = [];

    for(let i = 0; i < splitArrTemp.length; i++) {
        for(let j = 0; j < splitArrTemp[i].length; j++) {
            if(splitArrTemp[i][j] != '') {
                noEmptyStrTemp.push(splitArrTemp[i][j]);
            }
        }
    }
    
    for(let i = 0; i < splitArrTemp.length; i++) {
        for(let j = 0; j < splitArrTemp[i].length; j++) {
            let temp: string[] = splitArrTemp[i][j].split('date:' + ' ');

            splitArr.push(temp);
        }
    }
    
    //console.log(splitArr);

    for(let i = 0; i < splitArr.length; i++) {
        for(let j = 0; j < splitArr[i].length; j++) {
            if(splitArr[i][j] != '') {
                noEmptyStr.push(splitArr[i][j]);
            }
        }
    }

    //console.log(noEmptyStr);

    let actual: string[][] = [];

    let actualFmTemp: string[][] = [];

    for(let i = 0; i < noEmptyStr.length; i++) {
        if(i % 2 === 0) {
            let temp: string[] = [];
            temp.push(noEmptyStr[i]);

            actualFmTemp.push(temp);
        }
    }

    //console.log(actualFmTemp);

    let dateFm: string[] = [];

    for(let i = 0; i < noEmptyStr.length; i++) {
        if(i % 2 === 1) {
            dateFm.push(noEmptyStr[i]);
        }
    }
    //console.log(actual);
    //console.log(dateFm);

    for(let i = 0; i < actualFmTemp.length; i++) {
        //use same index value since we assume that each index value correlates in parallel
        actualFmTemp[i].push(dateFm[i]);
    }
    //console.log(actualFmTemp);

    let actualFmData: string[][] = [];

    //assign reference of noEmptyStr to actualFmTemp
    actualFmData = actualFmTemp;

    //return array of actual frontmatter data
    return actualFmData;
}

/*
console.log(createPostMatrixData(
    formatFrontmatterData(
        getRawFrontmatterData(markdownFiles, 'posts/')
    ), 
    'posts/'));
*/
console.log(extractActualFrontmatterData(
    createPostMatrixData(
        formatFrontmatterData(
            getRawFrontmatterData(markdownFiles, 'posts/')
        ), 
        'posts/'
    ))
);

//console.log(formatPostMatrixData(formatFrontmatterData(getFrontmatterData(markdownFiles)))[0][1]);