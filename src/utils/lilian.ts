import { lilian } from "./post-util.js"

try {
    //call lilian function with arguments
    lilian(
        "Lilian", 
        'src/pages/', 
        'src/post-list/post-list.min.html', 
        "Posts", 
        '../pages/'
    );

//catch the exception that is thrown
} catch(error) {
    //throw error
    throw console.error(error);
}