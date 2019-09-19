'use strict';

/* const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleSelector = '.post';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';
const optTagsListSelector = '.tags';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';
const optAuthorsWrapper = '.authors'; */

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

const opts = {
  title: {
    selector: '.post-title',
    listSelector: '.titles',
  },
  article: {
    selector: '.post',
    tagsSelector: '.post-tags .list',
    authorSelector: '.post-author',
  },
  tags: {
    listSelector: '.tags',
  },
  cloudClass: {
    count: 5,
    prefix: 'tag-size-',
  },
  authors: {
    wrapper: '.authors',
  },
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');
  //console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  //console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  //console.dir(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');

}

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(opts.title.listSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(opts.article.selector + customSelector);

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(opts.title.selector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    //console.log(linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
    //console.log(html);

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

// GENERATING TAGS UNDER EACH ARTICLE

function calculateTagsParams(tags) {
  const tagValues = [];
  const minMax = {};
  for (let tag in tags) {
    //console.log(tags[tag]);
    if (tagValues.indexOf(tags[tag]) == -1) {
      tagValues.push(tags[tag]);
      //console.log(tagValues);
    }
  }
  minMax.max = Math.max(...tagValues);
  minMax.min = Math.min(...tagValues);
  //console.log(`minMax object is`);
  //console.log(minMax);
  return minMax;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClass.count - 1) + 1 );
  return `${opts.cloudClass.prefix}${classNumber}`;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.article.selector);
  //console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles ) {
    //console.log(article);

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.article.tagsSelector);
    //console.log(tagsWrapper);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray) {

      /* generate HTML of the link */
      //console.log(tag);
      //const linkHTML = `<a href="#tag-${tag}"> ${tag} </a>`;
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      //console.log(`linkHTML is ${linkHTML}`);

      /* add generated code to html variable */
      html += ` ${linkHTML}`;
      //console.log(`html is ${html}`);

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    //console.log(tagsWrapper);

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tags.listSelector);

  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  // let allTagsHTML = '';
  const allTagsData = {tags: []};

  //console.log('allTags is:');
  //console.log(allTags);

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += `<a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}"> ${tag} (${allTags[tag]}) </a>`;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* [NEW] END OF LOOP: for each tag in allTags: */

  //console.log(allTagsHTML);

  /* [NEW] add html from allTagsHTML to tagList */
  // tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
}

generateTags();

function tagClickHandler(event) {

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  //console.log(tag);

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  //console.log(activeTags);

  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags ) {

    /*    remove class active */
    activeTag.classList.remove('active');

    /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTagsLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let allTagsLink of allTagsLinks) {

    /*    add class active */
    allTagsLink.classList.add('active');

    /* END LOOP: for each found tag link */

  }

  /* execute function "generateTitleLinks" with article selector as argument */
  console.log(`[data-tags~="'${tag}'"]`);
  generateTitleLinks('[data-tags~="' + tag + '"]' );

}

function addClickListenersToTags() {

  /* find all links to tags */
  const allLinksTags = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let allLinksTag of allLinksTags) {

    /*    add tagClickHandler as event listener for that link */
    allLinksTag.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

// GENERATING AUTHOR LINK UNDER EACH ARTICLE
function generateAuthors() {
  const allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.article.selector);
  console.log(articles);

  /* read all data-author fields
    1. getting author from attr.
    2. fill allAuthor object
    3. selecting author wrapper,
    4. add author to the author wrapper */
  for (let article of articles) {
    //console.log(articles);
    // getting author form attribute
    const author = article.getAttribute('data-author');
    console.log(author);

    //filling allAuthors object
    if (!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    console.log('allAuthors now are:');
    console.log(allAuthors);

    //selecting author wrapper
    const authorWrapper = article.querySelector(opts.article.authorSelector);

    // add author to the author wrapper
    // authorWrapper.innerHTML = `by <a href="#${author}"> ${author} </a>`;
    const authorData = {id: author, title: author};
    authorWrapper.innerHTML = `by ${templates.authorLink(authorData)}`;
  }

  //selection author's section
  const authorsWrapper = document.querySelector(opts.authors.wrapper);
  //console.log(authorWrapper);

  const allAuthorsData = {tags: []};

  for (let allAuthor in allAuthors) {
    // add authors to authors section
    //authorsWrapper.innerHTML += `<a href="#${allAuthor}"> ${allAuthor}</a> (${allAuthors[allAuthor]}) <br>`;
    allAuthorsData.tags.push({
      author: allAuthor,
      count: allAuthors[allAuthor],
    });
  }
  authorsWrapper.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler() {

  // invokation of generateTitleLinks with apropiate argument, = instead of ~=

  const author = this.innerText;
  console.log(`[data-author="${author}"]`);
  generateTitleLinks(`[data-author="${author}"]`);
}

function addClickListenersToAuthors() {
  //find all author links
  const allLinksAuthors = document.querySelectorAll('.post-author a');
  console.log (allLinksAuthors);

  const sectionAuthors = document.querySelectorAll('.authors a');
  console.log(`section authors`);
  console.log(sectionAuthors);

  // add listener to each author link
  for (let allLinksAuthor of allLinksAuthors) {
    allLinksAuthor.addEventListener('click', authorClickHandler);
  }

  // add listener to each author of the author's section
  for (let sectionAuthor of sectionAuthors) {
    sectionAuthor.addEventListener('click', authorClickHandler);
  }

}

addClickListenersToAuthors();


