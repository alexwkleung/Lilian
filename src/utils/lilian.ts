import { 
    createHtmlPostFiles, 
    createPostHtmlTemplate, 
    createHtmlPostListFile, 
    createPostListHtmlTemplate, 
    getPostListTags,
    createHtmlIndexFile,
    postDataMatrix
} from "./post-util.js";

try {
    //create index file
    createHtmlIndexFile();

    //create post files
    createHtmlPostFiles('src/html-posts/', postDataMatrix, createPostHtmlTemplate(postDataMatrix));

    //create post list file
    createHtmlPostListFile(
        'src/post-list/post-list.min.html', 
        createPostListHtmlTemplate("Lilian", getPostListTags(postDataMatrix, '../html-posts/'))
    );

    //once all functions are executed, log success
    console.log("Lilian: Executed successfully!");

//if some exception is thrown
} catch(error) {
    //throw error
    throw console.error(error);
}