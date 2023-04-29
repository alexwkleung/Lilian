import { EvaSTUtil } from 'eva-st-util'
import { readDirectory, removeExtension, filterByExtension, parseFile, writeToFile } from 'fs-dir'
import { minifyHtml } from './minify-html-util.js'

//markdown file names (with extension)
export const markdownFiles: string[] = filterByExtension(readDirectory('posts'), ".md");

//markdown files length
export const markdownFilesLength: number = filterByExtension(readDirectory('posts'), ".md").length;

//markdown file names (with no extension)
export const markdownFilesNoExt: string[] = removeExtension(markdownFiles);

//html file names (with extension)
export const htmlFiles = createHtmlFileNames(markdownFilesNoExt);

//stylesheet link
const cssLink: string = "../styles/style.css";

//hljs stylesheet 
const cssHighlightLink: string = "../styles/hljs/github-dark.min.css";

/**
 * sortPostDataMatrix function
 * 
 * @param postData A matrix containing post data
 * @returns Sorted matrix containing post data
 */
export function sortPostDataMatrix(postData: string[][]): string[][] {
    let sortedPostDataMatrix: string[][] = [];

    //use Date.parse() to compare milliseconds of the date string from matrix --> [row][1]

    //let curr: string = postData[0][1];

    for(let i = 0; i < postData.length; i++) {
        for(let j = 0; j < postData[i].length; j++) {

        }
        //console.log(postData[i + 1][1])
        /*
        if(Date.parse(postData[i][1]) > Date.parse(postData[i + 1][1])) {
            let temp: string = postData[i][1];

            postData[i][1] = postData[i + 1][1];

            postData[i + 1][1] = temp;
        }
        */
    }

    sortedPostDataMatrix = postData;

    return sortedPostDataMatrix;
}

/**
 * postListTags function
 * 
 * @param postData A matrix containing post data (i.e., `[['title: foo', 'date: bar']]`)
 * @returns An array containing list tags with the post title which links to the respective html file
 */
export function getPostListTags(postData: string[][], directory: string, htmlFileName: string[]): string[] {
    let list: string[] = [];

    for(let i = 0; i < postData.length; i++) {
        let temp: string = `<li class="post-li"><a class="post-link" href="${directory}${htmlFileName[i]}">${postData[i][0]}</a><br><div class="post-date">${postData[i][1]}</div></li>`;

        list.push(temp);
    }

    //return list
    return list;
}

/**
 * createPostListHtmlTemplate function
 * 
 * @param title Document title
 * @param postListTags An array containing post list tags (i.e., `['<li>foo</li>', '<li>bar</li>']`)
 * @returns 
 */
export function createPostListHtmlTemplate(title: string, postListTags: string[]): string {
    //iterate over array in template literal with map: 
    //https://stackoverflow.com/questions/50574786/simple-javascript-template-literals-to-insert-iterated-values-e-g-array-elemen

    let template: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${cssLink}">
            <title>${title}</title>
        </head>
        <body>
            <div id="list-container">
                ${postListTags.map((i): string => i + '\n').join('')}
            </div>
        </body>
        </html>`;

    return template;
}

/**
 * createPostHtmlTemplate function
 * 
 * @param postDataMatrix A matrix containing post data (i.e., `[['title: foo', 'date: bar', '<p>baz</p>']]`)
 * @returns An array containing HTML templates of each post
 */
export function createPostHtmlTemplate(postDataMatrix: string[][]): string[] {
    let postTitle: string[] = [];

    for(let i = 0; i < postDataMatrix.length; i++) {
        postTitle.push(postDataMatrix[i][0]);
    }

    let postData: string[] = [];

    for(let i = 0; i < postDataMatrix.length; i++) {
        postData.push(postDataMatrix[i][2]);
    }

    let template: string[] = [];

    for(let i = 0; i < postTitle.length && i < postData.length; i++) {
        template.push(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${cssLink}">
            <link rel="stylesheet" href="${cssHighlightLink}">
            <script src="./scripts/highlight.min.js"></script>
            <script>hljs.highlightAll();</script>
            <title>${postTitle[i]}</title>
        </head>
        <body>
            <article>
                ${postData[i]}
            <article>
        </body>
        </html>`);
    }

    return template;
}

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

    //index to track the frontmatter data position in the tree
    let frontmatterIndex: number = 1;

    //iterate over the length of files (each file has frontmatter data)
    for(let i = 0; i < files.length; i++) {
        //push frontmatter data to treeRefFm
        treeRefFm.push(treeRef[frontmatterIndex]);

        //every 3 indices starting from index 1 contains the frontmatter data
        frontmatterIndex += 3;
    }

    return treeRefFm;
}

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
        //split index value of string containing '\n'
        matrix.push(frontmatterData[i].split('\n'));
    }

    //return matrix containing frontmatter data
    return matrix;
}

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
        //frontmatter data is only title and date, therefore iterate 2 times
        for(let j = 0; j < 2; j++) {
            //split index value of string containing 'title: ' 
            let temp: string[] = createPostMatrixTemp[i][j].split('title:' + ' ');

            //push '' and the actual title 
            splitArrTemp.push(temp);
        }
    }

    let noEmptyStrTemp: string[] = [];
    let noEmptyStr: string[] = [];

    for(let i = 0; i < splitArrTemp.length; i++) {
        for(let j = 0; j < splitArrTemp[i].length; j++) {
            //skip if index value is ''
            if(splitArrTemp[i][j] != '') {
                //push actual title to end of new array
                noEmptyStrTemp.push(splitArrTemp[i][j]);
            }
        }
    }
    
    for(let i = 0; i < splitArrTemp.length; i++) {
        for(let j = 0; j < splitArrTemp[i].length; j++) {
            //split index value of string containing 'date: '
            let temp: string[] = splitArrTemp[i][j].split('date:' + ' ');

            //push '' and the actual title
            splitArr.push(temp);
        }
    }

    for(let i = 0; i < splitArr.length; i++) {
        for(let j = 0; j < splitArr[i].length; j++) {
            //skip if index value is ''
            if(splitArr[i][j] != '') {
                //push actual title to end of new array
                noEmptyStr.push(splitArr[i][j]);
            }
        }
    }

    let actualFmTemp: string[][] = [];

    for(let i = 0; i < noEmptyStr.length; i++) {
        //go to title index value and skip the date index value
        if(i % 2 === 0) {
            let temp: string[] = [];
            temp.push(noEmptyStr[i]);

            //push frontmatter title value to end of array
            actualFmTemp.push(temp);
        }
    }

    let dateFm: string[] = [];

    for(let i = 0; i < noEmptyStr.length; i++) {
        //skip the title index value and to go date index value
        if(i % 2 === 1) {
            //push frontmatter date value to end of array
            dateFm.push(noEmptyStr[i]);
        }
    }

    for(let i = 0; i < actualFmTemp.length && i < dateFm.length; i++) {
        //actualFmTemp and dateFm have same length, so use the same index to access in parallel
        //actualFmTemp contains the array with all frontmatter data of the posts
        actualFmTemp[i].push(dateFm[i]);
    }

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
        //assigned value to temp is markdown file name + concatenated .min.html extension
        const temp: string = fileNameNoExt[i] + ".min.html";

        htmlFiles.push(temp);
    }

    //return array of html file names based on markdown files
    return htmlFiles;
}

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
        //push post content from rawMatrixData to postData
        postData.push(rawMatrixData[i][2])
    }

    for(let i = 0; i < frontmatterMatrixData.length && markdownFileNames.length && htmlFileNames.length; i++) {
        //frontmatterMatrixData contains title and date initially
        //assume all arrays (1d or 2d) are the same length and all indices correlate linearly

        //push post data to end of each row
        frontmatterMatrixData[i].push(postData[i]);
        //push markdown file name to end of each row
        frontmatterMatrixData[i].push(markdownFileNames[i]);
        //push html file name to end of each row
        frontmatterMatrixData[i].push(htmlFileNames[i]);
    }
    
    //assign reference of frontmatterMatrixData to postMatrix
    postMatrix = frontmatterMatrixData;

    //return a matrix containing post data
    return postMatrix;
}

/**
 * createHtmlFiles function
 * 
 * @param directory The directory to create the file (i.e., `'foo/'`)
 * @param postDataMatrix A matrix containing post data (i.e., `[['title: foo', 'date: bar', '<h1>baz</h1>']]`)
 */
export function createHtmlPostFiles(directory: string, postDataMatrix: string[][], htmlTemplate: string[]): void {
    let htmlTemplateIndex: number = 0;

    for(let i = 0; i < postDataMatrix.length; i++) {
        if(htmlTemplateIndex < htmlTemplate.length) {
            Promise.resolve(minifyHtml(htmlTemplate[htmlTemplateIndex])).then((minifiedPostTemplate) => {
                writeToFile(directory + postDataMatrix[i][4], minifiedPostTemplate);
            });
        }

        htmlTemplateIndex++;
    }
}

/**
 * createHtmlPostListFile function
 * 
 * @param directory The directory to create the file (i.e., `'foo/'`)
 * @param postListTemplate The HTML template with the elements containing the post list
 * @returns Resolved promise for minified post list template
 */
export async function createHtmlPostListFile(directory: string, postListTemplate: string): Promise<void> {
    return Promise.resolve(minifyHtml(postListTemplate)).then((minifiedPostListTemplate) => {
        writeToFile(directory, minifiedPostListTemplate);
    });
}
