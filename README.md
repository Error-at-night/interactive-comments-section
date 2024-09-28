# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## To start this application run the following command (in your terminal) in the project directory

- npm install
- npm install json-server (if you don't have json-server installed)
- npm json-server --watch data/data.json --port 8000
- npm run dev

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
  - [Built with](#built-with)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments

### Expected behaviour of the app

- First-level comments should be ordered by their score, whereas nested replies are ordered by time added.
- Replying to a comment adds the new reply to the bottom of the nested replies within that comment.
- A confirmation modal should pop up before a comment or reply is deleted.
- Adding a new comment or reply uses the `currentUser` object from within the `data.json` file.
- You can only edit or delete your own comments and replies.

### Built with

- Tailwindcss
- ReactJs
- RTK Query
- React-Hook-Form
- React-Hot-Toast

## Author

- Frontend Mentor - [@Error-at-night](https://www.frontendmentor.io/profile/Error-at-night)
- Twitter - [@ogsuccessful_](https://www.twitter.com/ogsuccessful_)
