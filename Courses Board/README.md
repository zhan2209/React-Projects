# Module 3 group project #
__Submitted by:__ _Today_

__Team members:__
````
Nanxiang Zhang  : zhan4584@umn.edu
Jintian Pan     : panxx389@umn.edu
Gloria Zhang    : zhan2209@umn.edu
Zheng Sun       : sunxx738@umn.edu
````

__Heroku URL:__ _https://serene-garden-98230.herokuapp.com_

__Argument of ambition (optional, maximum 100 words):__
_Briefly argue why this was a technically ambitious project_

* 1. Sign Up <b>check username</b>:
	<br>once user give a username (for example:previous), we will check duplicate, if exits, it will return the other 3 recommend username as "previous1" "previous2" "previous3", we use a<b> dirctionary tree </b>to search and return. The time cost is liner (maximum is 3n, and n is the length of current duplicate username).
* 2. <b>Password requirement</b>:
	<br>longer than 8 and with at least 1 UPPER letter, 1 lower letter, 1 digit and 1 special mark !@#$%.
* 3. <b>Password encryption</b> and token mechanism is used to handles the secure issue.
* 4. In discover board, if a course has descritions by more than 2 users, it will show a switch to show/hide all users' description.
* 5. In discover board under each course, We show the total number of users who shared the same course.
* 6. <b>Auto refresh</b>: the website will refresh automitlly after user actions.  

__Argument of execution (optional, maximum 100 words):__
_Briefly argue why this was a well executed project_

* 1. User login use theri account username/password. Or apply a new account. login to check personal board.
* 2. User can <b>Add</b> course in user board use <i>coursera URL</i> and in discover board click bookmark(from blue to pink) to add to personal board.
* 3. The <i>coursera URL</i> can not end with "/" and can not be the course in coursera special list.
* 4. User can <b>Delete</b> course in user board use delete button and in discover boardcancel bookmark(from pinkto blue) to delete course from personal board.
* 5. User can <b>Edit</b> course in user board for both description and Tag
* 6. User can <b>Search</b> both by Tag and Titile keywords.
* 7. For each course under discover board, user can  bookmark and cancel bookmark

## Description ##
The group project for module 3 is to create a website for collecting and organizing content.

Some sites that can serve as inspiration:

- pinterest: users save images to "boards".
- pocket and delicious: users save and organize URLs
- zotero: users save academic articles, organize them into groups, tag them, and export them in various formats
- reddit and hackernews: users post, vote on, and discuss URLs

Generally, these sites allow users to (a) collect content into collections, lists, or tags, (b) annotate the content with additional information, and (c) browse and search for other information on the site.

We encourage you to build a site to curate content that's interesting to you. Ideas:

- Airbnb rentals
- NPM packages
- Amazon products
- NES ROMs


## Requirements ##

- Build a site on react, express, and mongo. Host the site on heroku.
- The site must allow users to:
  - Add new content.
  - Edit existing content, e.g., by changing its description or giving it a descriptive tag
  - Delete existing content
- The site must allow the content to be organized.  E.g., collections, lists, or tags.
- The site must allow users to browse the site in a reasonable way via links.


### Encouraged, but optional ###

- Content import via identifier (e.g., URL). Many interfaces (Facebook, Slack, Pocket) allow users to add links, which the site then parses to find some content (e.g., a title, an image). Allow your users to do something similar.
- Search. Add a site-search feature that allows users to find content. It does not count to add a google site search box :)  This could, for example, be an autocomplete widget that shows tags, or an open-ended widget that searches the text of imported items.
- Multi-user support.  Allow multiple users to independently contribute content.  There is no need for full authentication, but you could allow users to "log in" by typing a username.  You could simply track and display activity by user, or to be more ambitious, you could give different users different views (e.g., the homepage shows the logged-in user's collections).
- Responsive design. Make the site render in a usable way on an iphone 7 (or equivalent).


## Submission ##
- Your code should be pushed up to your repo on github
- Fill this `README.md` out with your team name, team members' emails, and
- Heroku url for your demo. Additionally, complete the argument sections at the top of the file.


## Grading ##
You will be graded on the __ambition__ and __execution__ of the project. At the top of this `README.md` you have the opportunity to argue why your submission was ambitious and well executed. In order for us to grade it, you must have it hosted on Heroku. To earn an "A" grade, a project must be technically ambitious, well-executed, and polished. To earn a passing grade, a project must minimally fulfill the three requirements listed in the description.
