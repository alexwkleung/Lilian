import { EvaSTUtil } from 'eva-st-util'
import { readDirectory, removeExtension, filterByExtension, parseFile, writeToFile } from 'fs-dir'

//markdown file names (with extension)
const markdownFiles: string[] = filterByExtension(readDirectory('posts'), ".md");

//markdown file names (with no extension)
const markdownFilesNoExt: string[] = removeExtension(markdownFiles);

//markdown file array length
const markdownFilesLength: number = markdownFiles.length;

//console.log(markdownFiles);

/**
 * postListTags function
 * 
 * @param postDataMatrix A matrix containing post data (i.e., `[['title: foo', 'date: bar']]`)
 * @returns An array containing list tags with the post title which links to the respective html file
 */
export function getPostListTags(postData: string[][], htmlFileName: string[]): string[] {
    let list: string[] = [];

    for(let i = 0; i < postData.length; i++) {
        let temp: string = `<li class="post-li"><a class="post-link" href="${htmlFileName[i]}">${postData[i][0]}</a></li>`;

        list.push(temp);
    }

    //return list
    return list;
}

export function createPostListHtmlTemplate(postListTags: string[], title: string): string {
    //iterate over array in template literal with map: 
    //https://stackoverflow.com/questions/50574786/simple-javascript-template-literals-to-insert-iterated-values-e-g-array-elemen

    let template: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body>
            ${postListTags.map((i) => i + '\n').join('')}
        </body>
        </html>`;

    return template;
}

export function createPostHtmlTemplate(postDataMatrix: string[][]) {
    let template: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
        </head>
        <body>
            
        </body>
        </html>`;
}

//console.log(getPostListTags());

/**
 * getRawFrontmatterData function
 * 
 * @param files An array containing Markdown files (i.e., `['foo.md', 'bar.md']`)
 * @param directory The directory that the Markdown files are located in (i.e., `'foo/'`)
 * @returns An array containing frontmatter data (i.e., `['title: foo\ndate: bar']`)
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

//console.log(getRawFrontmatterData(markdownFiles, 'posts/'));

/**
 * formatFrontmatterData function
 * 
 * @param frontmatterData An array containing frontmatter (i.e., `['title: foo\ndate: bar']`)
 * @returns A matrix containing formatted frontmatter data (i.e., `[['title: foo', 'date: bar']]`)
 */
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
 * createRawPostDataMatrix function
 * 
 * @param postMatrix A matrix containing post data (i.e., `[['title: foo', 'date: bar']]`)
 * @param directory The directory that the Markdown files are located in (i.e., `'foo/'`)
 * @returns Matrix containing post data
 */
export function createRawPostDataMatrix(postMatrix: string[][], directory: string): string[][] {
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
 * extractActualFrontmatterData function
 * 
 * @param postData A matrix containing post data (i.e., `[['title: foo', 'date: bar']]`)
 * @returns A matrix of the actual frontmatter data (i.e., `[['foo', 'bar']]`)
 */
export function extractActualFrontmatterData(postData: string[][]): string[][] {
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

/**
 * createHtmlFileNames function
 * 
 * @param fileNameNoExt An array containing file names without extension (i.e., `['foo', 'bar']`)
 * @returns An array containing HTML file names based on Markdown file names (i.e., `['foo.html', 'bar.html']`)
 */
export function createHtmlFileNames(fileNameNoExt: string[]): string[] {
    let htmlFiles: string[] = [];

    for(let i = 0; i < fileNameNoExt.length; i++) {
        //console.log(markdownFilesNoExt[i]);
    
        //assigned value to temp is markdown file name + concatenated .html extension
        const temp: string = fileNameNoExt[i] + ".html";

        htmlFiles.push(temp);
    }

    //console.log(htmlFiles);

    //return array of html file names based on markdown files
    return htmlFiles;
}

//console.log(createHtmlFileNames(markdownFilesNoExt));

//html file names (with extension)
const htmlFiles = createHtmlFileNames(markdownFilesNoExt);

/**
 * createPostDataMatrix function
 * 
 * @param frontmatterMatrixData A matrix containing frontmatter data (i.e., `[['title: foo', 'date: bar']]`)
 * @param rawMatrixData A matrix containing raw post data (i.e., `[['title: foo', 'date: bar', '<h1>baz</h1>']]`)
 * @param markdownFileNames An array containing Markdown file names (i.e., `['foo.md', 'bar.md']`)
 * @param htmlFileNames An array containing HTML file names (i.e., `['foo.html', 'bar.html']`)
 * @returns A matrix containing post data (i.e., `[['title: foo', 'date: bar', '<h1>baz</h1>']]`)
 */
export function createPostDataMatrix(
    frontmatterMatrixData: string[][], 
    rawMatrixData: string[][], 
    markdownFileNames: string[], 
    htmlFileNames: string[]
    ): string[][] {     
    let postMatrix: string[][] = [];
    let postData: string[] = [];

    for(let i = 0; i < rawMatrixData.length; i++) {
        //console.log(rawMatrixData[i][2]);
        postData.push(rawMatrixData[i][2])
    }
    //console.log(postData);

    for(let i = 0; i < frontmatterMatrixData.length; i++) {
        frontmatterMatrixData[i].push(postData[i]);
        frontmatterMatrixData[i].push(markdownFileNames[i]);
        frontmatterMatrixData[i].push(htmlFileNames[i]);
    }
    //console.log(postData);
    //console.log(frontmatterMatrixData);
    
    //assign reference of frontmatterMatrixData to postMatrix
    postMatrix = frontmatterMatrixData;

    //return a matrix containing post data
    return postMatrix;
}

/**
 * createHtmlFiles function
 * 
 * @param directory The directory to create the file (i.e., `foo/`)
 * @param postDataMatrix A matrix containing post data (i.e., `[['title: foo', 'date: bar', '<h1>baz</h1>']]`)
 */
export function createHtmlPostFiles(directory: string, postDataMatrix: string[][]): void {
    for(let i = 0; i < postDataMatrixLength; i++) {
        writeToFile(directory + postDataMatrix[i][4], postDataMatrix[i][2]);
    }
}

export function createHtmlPostListFile(directory: string, postListTemplate: string) {
    for(let i = 0; i < postListTemplate.length; i++) {
        writeToFile(directory, postListTemplate);
    }
}

/*
console.log(createRawPostDataMatrix(
    formatFrontmatterData(
        getRawFrontmatterData(markdownFiles, 'posts/')
    ), 
    'posts/'));

console.log(extractActualFrontmatterData(
    createRawPostDataMatrix(
        formatFrontmatterData(
            getRawFrontmatterData(markdownFiles, 'posts/')
        ), 
        'posts/'
    ))
);  
*/

console.log(createPostDataMatrix(
    extractActualFrontmatterData(
        createRawPostDataMatrix(
            formatFrontmatterData(
                getRawFrontmatterData(markdownFiles, 'posts/')
            ), 
        'posts/'
    )), 
    createRawPostDataMatrix(
        formatFrontmatterData(
            getRawFrontmatterData(markdownFiles, 'posts/')
            ), 
        'posts/'
    ),
    markdownFiles,
    htmlFiles
));

const postDataMatrixLength: number = createPostDataMatrix(
    extractActualFrontmatterData(
        createRawPostDataMatrix(
            formatFrontmatterData(
                getRawFrontmatterData(markdownFiles, 'posts/')
            ), 
        'posts/'
    )), 
    createRawPostDataMatrix(
        formatFrontmatterData(
            getRawFrontmatterData(markdownFiles, 'posts/')
            ), 
        'posts/'
    ),
    markdownFiles,
    createHtmlFileNames(markdownFilesNoExt)
).length;

//create a matrix containing all of the posts' data
//the returned matrix is an important structure of the post data
//it is initially sorted based on the (unknown) order of how the file system reads the directory
//if you want to sort by title, date, etc, then you will need to implement the sorting algorithm with any method you like
const postDataMatrix = createPostDataMatrix(
    extractActualFrontmatterData(
        createRawPostDataMatrix(
            formatFrontmatterData(
                getRawFrontmatterData(markdownFiles, 'posts/')
            ), 
        'posts/'
    )), 
    createRawPostDataMatrix(
        formatFrontmatterData(
            getRawFrontmatterData(markdownFiles, 'posts/')
            ), 
        'posts/'
    ),
    markdownFiles,
    createHtmlFileNames(markdownFilesNoExt)
);

//create post files (need a template for it)
createHtmlPostFiles('src/html-posts/', postDataMatrix);

//create post list file
createHtmlPostListFile('src/post-list/post-list.html', createPostListHtmlTemplate(getPostListTags(postDataMatrix, htmlFiles), "Lilian"));

console.log(createPostListHtmlTemplate(getPostListTags(postDataMatrix, htmlFiles), "Lilian"));

console.log(getPostListTags(postDataMatrix, htmlFiles));