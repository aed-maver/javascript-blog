'use strict';

function titleClickHandler(event){
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

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
function generateTags() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  //console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles ) {
    //console.log(article);

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
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
      const linkHtml = `<a href="#tag-${tag}"> ${tag} </a>`;
      //console.log(`linkHtml is ${linkHtml}`);

      /* add generated code to html variable */
      html += ` ${linkHtml}`;
      //console.log(`html is ${html}`);

      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    //console.log(tagsWrapper);

  /* END LOOP: for every article: */
  }
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
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  // read all data-author fields
  for (let article of articles) {
    //console.log(article);
    // getting author form attribute
    const author = article.getAttribute('data-author');
    console.log(author);

    //selecting author wrapper
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    console.log(authorWrapper);

    // add author to the author wrapper
    authorWrapper.innerHTML = `by <a href="#${author}"> ${author} </a>`;
    console.log(authorWrapper);
  }

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

  // add listener to each author link
  for (let allLinksAuthor of allLinksAuthors) {
    allLinksAuthor.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();


