# MinnPost Ivey Award Performance Calendar

The Ivey Awards provides us with a basic calendar that we can embed in our site via an iframe which is at the following URL:

http://iveyawards.com/Calendar/MinnPost.aspx

We style the calendar by having a JS and CSS file that is embedded into the calendar so that we can override the styling and HTML of the calendar.

## Install

1. `npm install`
1. `bower install`

## Styling

The styling happens in CSS, specifically in `styles/main.scss`, as much as possible.  But sometimes JS is needed to move around content and other things, all of which is in `js/app.js`.

## Testing and local serving

Use the various `index-*.html` pages for testing the pages.  Note that searching on the form will make you to the actual Ivey Awards site since we cannot emulate their server.

Use `grunt server` to run a local server at http://localhost:8857/ which will also watch for changes and reload as needed.

## Building

Use `grunt` to build the minified files for deployment.

## Deploy

Use `grunt deploy` to push the files up to S3.  These are the relevant files that are embedded in the page:

https://s3.amazonaws.com/data.minnpost/projects/minnpost-iveys-calendar/minnpost-iveys-calendar.min.css
https://s3.amazonaws.com/data.minnpost/projects/minnpost-iveys-calendar/minnpost-iveys-calendar.min.js
