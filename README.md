# Hexo-Tipue-Search-Json

A [Hexo plugin](https://hexo.io/plugins/) to generate JSON content for [Tipue Search](http://www.tipue.com/search/docs/?d=6).

A demo here: https://hzhou.me/search/

## How to install

Add plugin to Hexo:

```bash
npm install hexo-generator-tipue-search-json --save
```
## How to configure as a separate search page
You can read this hexo theme: [hexo-theme-apollo-plus](https://github.com/zhouhao/hexo-theme-apollo-plus) for more details.

## How to configure (You can do your customization)
1. Download Tipue Search zip from [here](http://www.tipue.com/search/tipuesearch.zip), unzip it, and copy `/tipuesearch` to your `${theme_dir}/source`   
    a. A modified and **Chinese-Character-friendly** version of [Tipue Search](https://github.com/zhouhao/hexo-Web-Source/tree/master/themes/apollo/source/tipuesearch) 
2. find the main content div(different theme may have different `id` or `class`), <br/><img src="https://raw.githubusercontent.com/zhouhao/s/master/img/hexo-json-main-div.png" style="width:400px;"/>
    in my example above, it should be ` <div id="content" role="main">`(find the code here: [layout.ejs](https://gitlab.com/zhouhao/zhouhao.gitlab.io/blob/master/themes/cyanstyle/layout/layout.ejs#L8)), then add `<div id="tipue_search_content" style="display: none"></div>` above it.
     ```html
     <div id="tipue_search_content" style="display: none"></div>
     <div id="content" role="main"><%- body %></div>
     ```
     
3. add js code in `${theme_dir}/layout/_partial/after-footer.ejs` (or some file like this one) - You can optimize it, of course.
    ```html
    <link href="/tipuesearch/tipuesearch.css" rel="stylesheet">
    <script src="/tipuesearch/tipuesearch_set.js"></script>
    <script src="/tipuesearch/tipuesearch.js"></script>
    <!-- Other code may be here -->
    <script>
        $(document).ready(function () {
    
            var searchInput = $('#tipue_search_input');
            searchInput.tipuesearch({
                'mode': 'json',
                'minimumLength': 2,
                'contentLocation': '/tipuesearch/tipuesearch_content.json',
                highlightEveryTerm: true
            });
    
            $('#search-form').on('submit', function (e) {
                e.preventDefault();
                $('#tipue_search_content').show();
                $('#content').hide();
            });
    
            searchInput.keyup(function () {
                var length = $(this).val().length;
                if (length < 1) {
                    $('#tipue_search_content').hide();
                    $('#content').show();
                }
            });
        });
    </script>
    ```
4. Change `properties` for search box, and make it as: ([demo code link](https://gitlab.com/zhouhao/zhouhao.gitlab.io/blob/master/themes/cyanstyle/layout/_widget/search.ejs)).
      
    ```html
    <form id="search-form">
      <input  type="text" name="q" id="tipue_search_input" autocomplete="off" required placeholder="<%= __('search') %>" style="width:80%;" />
    </form>
     ```

## Changelog
`1.2.1` - bugfix: read root path from config file, rather than `'/'`   [#3](https://github.com/zhouhao/Hexo-Tipue-Search-Json/pull/3)  **Thanks to [@spkingr](https://github.com/spkingr)**      
`1.2.0` - include pages into generated Json   
       **Migration from old version**: Just `npm install` the latest version, no other change needed in your code base    
`1.1.0` - Only posts are included in generated Json


## Thanks For

[hexo-generator-json-content](https://github.com/alexbruno/hexo-generator-json-content)
