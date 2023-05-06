<h1 align="center">Lilian</h1>

![lilian](./screenshots/lilian.png)

![post-list](./screenshots/post-list.png)

![post](./screenshots/post.png)

<p align="center">Welcome to Lilian, a minimal blog template.</p>

<p align="center">You can create your own minimal blog with very little configuration.</p>

# Installation

# Features

1. Pages are generated locally.

2. Perfect amount of simplicity:

- [Inter](https://github.com/rsms/inter) font
- No distractions, no heavy dependencies
- Default theme leaves room for customization
- Comfortable default font size for reading
- Comfortable default mobile and desktop media queries

# Frequently Asked Questions

1. Q: I know Lilian is a blog template, but how does it work without utilizing a site generator or framework?

    A: Lilian is powered using a handful of utilities that are executed locally. You can find them in `src/utils`.
    
    Here is how these utilities work (in no particular order):
    
    1. Using functions from [Eva-ST-Util](https://github.com/alexwkleung/Eva-ST-Util) allows you to work with Markdown, such as manipulating the AST. Also, the string from Markdown -> HTML is used later.
    
    2. Extract the frontmatter data for each post and store them into a matrix (2D array).

    3. Create a data structure involving matrices (i.e., multiple 1x3 matrices) that contain the post data (frontmatter, post content, file names). 

    4. Sort the matrix by date (parsed to milliseconds for comparison) using an implemented sorting algorithm (i.e., bubble sort).

    5. Create HTML template strings (index, posts, post list, etc). 

    6. Generated HTML files are minified using html-minifier-terser.

    7. Using functions from [fs-dir](https://github.com/alexwkleung/fs-dir) allows executing file system operations with ease, such as filtering and removing file extensions.
    
    I know that these aren't the most optimal solutions but I will be improving the efficiency in the near future.

2. Q: Does Lilian offer typical blog features (pagination, post search, rss, etc)?

    A: At the moment, Lilian does not offer pagination, post search, and typical blog features (RSS, user comments, theme switching, etc). While these features are nice to have, Lilian is not meant to be a replacement of [insert site generator/blog util here]. 


# Contributions

Contributions are welcomed, but is 100% optional.

Feel free to submit a [new issue](https://github.com/alexwkleung/Lilian/issues) or a [pull request](https://github.com/alexwkleung/Lilian/pulls) if you have any improvements or concerns.

# License 

[MIT License.](https://github.com/alexwkleung/Lilian/blob/main/LICENSE)