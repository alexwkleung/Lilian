import { minify } from 'html-minifier-terser'

/**
 * minifyHtml function
 * 
 * Minify HTML using predefined options
 * 
 * @async
 * @param htmlString A string containing HTML (i.e., `"<p>foo</p>"`)
 * @returns A promise for the minified HTML
 */
export function minifyHtml(htmlString: string): Promise<string> {
    const minifyHtml: Promise<string> =  minify(htmlString, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
    });

    return minifyHtml;
}