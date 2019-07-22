# 3rd-Wheel

Welcome to the 3rd-Wheel dating app.


GETTING STARTED

Install all the dependencies with:

```npm install```

Create the database by inserting:

```mysql -uroot < schema.sql```

To populate the categories table in the database, uncomment the function in the models file on line 33 and run the server. After you run the server for the first time, comment out the populateCategories function.

``` populateCategories();```


To run the server, insert:

```node server/index.js```

Run Webpack bundler with:

```npx webpack```


HOW IT WORKS

New users sign up on the sign up page by inserting their unique username, their real names and a password.

Users log in with their username and their password.

Once signed or logged in, the user is asked to input their user info, including: 
Age
Bio
Gender
Preference
Interests
Picture

Users are matched by shared interests.

Users have the option of accepting, rejecting or leaving their matches pending.

When a match is accepted by both users, 3rd-Wheel suggests the top 5 locations for their date based on their shared interests and the locations rating.

Rejected matches will not be suggested again.