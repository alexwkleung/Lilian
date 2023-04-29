import { 
    createHtmlPostFiles, 
    createPostHtmlTemplate, 
    createHtmlPostListFile, 
    createPostListHtmlTemplate, 
    getPostListTags, 
    createHtmlFileNames, 
    createPostDataMatrix, 
    createRawPostDataMatrix, 
    extractActualFrontmatterData, 
    formatFrontmatterData, 
    getRawFrontmatterData, 
    htmlFiles,
    markdownFiles,
    markdownFilesNoExt,
    sortPostDataMatrix
} from "./post-fs-util.js";

//create post data matrix
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

//create post files
createHtmlPostFiles('src/html-posts/', postDataMatrix, createPostHtmlTemplate(postDataMatrix));

//create post list file
createHtmlPostListFile(
    'src/post-list/post-list.min.html', 
    createPostListHtmlTemplate("Lilian", getPostListTags(postDataMatrix, '../html-posts/', htmlFiles))
);

//console.log(sortPostDataMatrix(postDataMatrix));
console.log(postDataMatrix);