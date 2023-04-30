---
title: Lilian
date: Apr 29, 2023
---

# Lilian

Welcome to Lilian.

# Why Lilian?

Lilian offers a minimal and clean experience out of the box.

Features:

1. Pages are generated locally.

2. Perfect amount of simplicity:

- [Inter](https://github.com/rsms/inter) font
- No distractions
- Default theme leaves room for customization
- Comfortable default font size for reading

# Frequently Asked Questions

1. Q: I know Lilian is a blog template, but how does it work without utilizing a site generator or framework?

    A: Lilian is powered using a handful of utilities that are executed locally. You can find them in `src/utils`.
    
    Here is how these utilities work (in no particular order):
    
    1. Using functions from [Eva-ST-Util](https://github.com/alexwkleung/Eva-ST-Util) allows you to work with Markdown, such as *manipulating* the AST. Also, the string from Markdown -> HTML is used later.
    
    2. Extract the frontmatter data for each post and store them into a matrix (2D array).

    3. Create a data structure involving matrices (i.e., multiple 1x3 matrices) that contain the post data (frontmatter, post content, file names). 

    4. Sort the matrix by date (parsed to milliseconds) using **an implemented sorting algorithm** (i.e., bubble sort).

    5. Create HTML template strings (posts, post list, etc). 

    6. Make sure generated HTML files are minified using html-minifier-terser. Generated HTML files shouldn't be modified directly.

    7. Using functions from [fs-dir](https://github.com/alexwkleung/fs-dir) allows executing file system operations with ease. Filtering and removing extensions were helpful.

