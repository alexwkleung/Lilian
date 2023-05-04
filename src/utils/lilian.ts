import { lilian } from "./post-util.js"

try {
    //call lilian function with arguments
    lilian("Lilian", 'src/html-posts/', 'src/post-list/post-list.min.html', "Posts", '../html-posts/');

//if some exception is thrown
} catch(error) {
    //throw error
    throw console.error(error);
}