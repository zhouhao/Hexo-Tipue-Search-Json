var util = require('hexo-util');

hexo.extend.generator.register('json-content', hexo_generator_json_content);

function hexo_generator_json_content(site) {
    var cfg = hexo.config.hasOwnProperty('jsonContent') ? hexo.config.jsonContent : {
            meta: true
        },

        ignore = cfg.ignore ? cfg.ignore.map(function (item) {
            return item.toLowerCase();
        }) : [],

        minify = function (str) {
            return util.stripHTML(str).trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
        },

        pages = cfg.hasOwnProperty('pages') ? cfg.pages : {
            raw: false,
            content: false,
            title: true,
            slug: true,
            date: true,
            updated: true,
            comments: true,
            path: true,
            link: true,
            url: true,
            excerpt: true,
            text: true
        },

        posts = cfg.hasOwnProperty('posts') ? cfg.posts : {
            title: true,
            url: true,
            text: true,
            tags: true
        },

        json = {};

    if (pages) {
        var pagesPropertyNames = Object.getOwnPropertyNames(pages).filter(function (item) {
                return pages[item];
            }),
            pagesContent = site.pages.filter(function (page) {
                var path = page.path.toLowerCase(),
                    igno = ignore.find(function (item) {
                        return path.includes(item);
                    });
                return !igno;
            }).map(function (page) {
                var actualPage = {};

                pagesPropertyNames.forEach(function (item) {
                    switch (item) {
                        case 'excerpt':
                            return actualPage[item] = minify(page.excerpt);

                        case 'text':
                            return actualPage[item] = minify(page.content);

                        default:
                            return actualPage[item] = page[item];
                    }
                });

                return actualPage;
            });

        if (posts || cfg.meta)
            json.pages = pagesContent;
        else
            json = pagesContent;
    }

    if (posts) {
        var postsPropertyNames = Object.getOwnPropertyNames(posts).filter(function (item) {
                return posts[item];
            }),
            catags = function (item) {
                return item.name.replace(/\s+/g, '-').toLowerCase();
            },
            postsContent = site.posts.sort('-date').filter(function (post) {
                return post.published;
            }).filter(function (post) {
                var path = post.path.toLowerCase(),
                    igno = ignore.find(function (item) {
                        return path.includes(item);
                    });
                return !igno;
            }).map(function (post) {
                var actualPost = {};

                postsPropertyNames.forEach(function (item) {
                    switch (item) {
                        case 'text':
                            return actualPost[item] = minify(post.content);

                        case 'tags':
                            return actualPost[item] = post.tags.map(catags).join(' ');

                        case 'url':
                            return actualPost[item] = '/' + post['path'];

                        default:
                            return actualPost[item] = post[item];
                    }
                });

                return actualPost;
            });

        json.pages = postsContent;

    }

    return {
        path: 'content.json',
        data: JSON.stringify(json)
    };
}
