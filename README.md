# gratitude

This is a full stack application that connects a React based front end application with a Django/PostgresQL back end database.  The application allows you to create a User, sign in, sign out, and change passwords for a account security.  Once you have an account, you can start sharing your gratitude with others.  You can add a gratitude and interact with those gratitudes with a like and comment feature.

On your profile page, you will see all of your gratitude history.  In later versions, you will be able to see analytics based on your activity, follow others, and to upload a profile picture.

You can edit and deleted any post that you make.  Whether it is a gratitude post or comment.

Throughout the page, you can see gratitude images that were randomly generated from a collection on Unplash using a call to their API.

## Planning Story

The planning process began with the back end.  The first step was to ensure that all authentications were working properly.  This was done using curl-scripts for each individual feature.  Once signed in, a token is generated and allows for full user functionality.  Monitoring of built in django functions allowed for reassurance that the process was working.  After being able to sign in, I was able to move on to gratitude creation and functions.  First, a focus was placed on creation and the model of each gratitude post.  There were not many fields involved, but in order to get the comment and like function, there needed to be interacting models.  This created challenges on the front end since the there were limits to likes and the ability to edit posts/comments that are not owned by that specific user. This will be discussed later.

The next step was to address index, show, update, and delete functionality.  When the user creates a gratitude, the order that it presents would be based on the creation date from the most recent to the first.  I decided to reverse sort by date, so that the index on the UI front would present in descending order, with the most recent gratitude on top.

The show, update, and delete functionality were pretty benign in set up on the back end side. I decided to go with drop down buttons for the user to select edit from, with a modal that pops up with the text field.

My favorite part of this project was to give the power to like and comment.  This was tricky at first.  The like functionality was more involved than the comment functionality.  Using logic on the front end, I was able to limit a user to only 1 like.  If you click the button a second time, it unlikes it.  In future versions, I would like to incorporate a heart that fills to show the user that they have liked a gratitude every time they visit that gratitude.  This would be pretty easy to do, but was not a focus on this version.

For styling the page, I decided to implement a random image API call to unsplash.  I only wanted photos of calming nature to be presented.  I put a query in to the Unsplash API of 'clouds' and it generated a collection of photos that was appropriate. This worked pretty seemlessly.  I am waiting for approval for production status so that I have unlimited calls, but for now 50/hr can be made to unsplash.

## Technologies Used
    1. React
    2. html
    3. JavaScript
    4. jsx
    5. Bootstrap/React-Bootstrap
    6. Python
    7. Django
    8. axios
    9. Passport JS
    10. MomentJS
    11. Bcrypt
    12. CSS/Sass
    13. SQL/PostgresQL

## User Stories
    1.  As a user, I would like to sign up on a secure account.
    2.  As a user, I would like to sign in to a secure account.
    3.  As a user, I would like to change my password.
    4.  As a user, I would like to create a post.
    5.  As a user, I would like to edit a post.
    6.  As a user, I would like to delete a post.
    7.  As a user, I would like to view all of my posts, and the posts of others.
    8.  As a user, I would like to comment on the posts of others.
    9.  As a user, I would like to be able to like posts and comments.

## Unsolved Problems/Future Versions
  Unsolved:  API calls to Unsplash and data conversion moved to back-end.
  Version 2: Remove buttons for users that do not own post or comment
  Version 3: Follow others
  Version 4: Interact with other users, Calendar view

## Links
[Deployed Frontend](https://robrichardsdpt.github.io/gratitude-app/) <br>
[Deployed Backend](https://gratitude-back-end.herokuapp.com/) <br>
[Frontend Github Repository](https://github.com/robrichardsdpt/gratitude-app)<br>
[Backend Github Repository](https://github.com/robrichardsdpt/gratitude-back-end)

## Installation
    1.  Fork and clone this repository.
    2.  Create a new branch, training, for your work.
    3.  Checkout to the training branch.
    4.  Install dependencies with npm install.
    5.  Open the repository in Atom with atom .

## Wireframe


## Screenshots
