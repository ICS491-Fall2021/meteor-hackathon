![ci-badge](https://github.com/ics-software-engineering/meteor-application-template-react/workflows/ci-meteor-application-template-react/badge.svg)

For details about the template, please see http://ics-software-engineering.github.io/meteor-application-template-react/

# Meteor Hackathon
[Our Deployed Application](https://proxamie.meteorapp.com/#/)
<!-- Proxamie -->

## Table of contents

* [Overview](#overview)
* [Team Members](#team-members)
* [Landing Page](#landing)
* [Sign-in/Register Page](#sign-in--register)
* [Profile Page](#profile-page)
* [Add Availability Page](#add-availability)
* [Create Group Modal](#create-group)
* [Join Group Modal](#join-group)
* [Group Page](#group-page)
* [Create Hangout Modal](#create-hangout)

## Overview

This application seeks to help people to easily schedule hangouts with their friends with the necessary COVID-19 safety precautions in mind. It was built over the course of six days (Oct 15-20, 2021) as our group's submission for the [2021 Meteor Hackathon](https://impact.meteor.com/hackathon), using [meteor-application-template-react](http://ics-software-engineering.github.io/meteor-application-template-react/) as a base.

## Team Members

* [Mujtaba Quadri](https://github.com/mujtaba-a-quadri)
* [Alyssia Chen](https://github.com/alyssia-chen)
* [Jolie Ching](https://github.com/jolieching)
* [Dylan Decker](https://github.com/dylandecker)

## Landing

This page serves as the main landing for the website.
From here, the user can either sign in or register. At the moment, the "sign-in" and "register" buttons are not responsive yet, but the "login" button in the top right is functional.

<img src="./images/LandingPage.png"/>

## Sign-In / Register

To unlock full functionality of the app, the user must sign-in to the page with their credentials.
If they do not have an account, they will have the ability to register for one, this form includes a username field, which is used on the profile and group pages. The email is not displayed, but used for logging in.

<div style="display: flex">
  <img style="width: 49%; float: left" src="./images/LoginPage.png"/>
  <img style="width: 49%" src="./images/RegisterPage.png"/>
</div>

## Profile Page
Once users sign in, they are placed onto the profile page. From here, a user can see a calendar which indicates their last recorded availability. Below the calendar is a button that redirects users to a page to redo their availability. On the bottom, there is an interest form which helps the user keep track of what hangout ideas they could be interested in for the future. These records are displayed in the bottom right under “My Interests”. We initially wanted to use these interests for planning hangouts, but ran out of time to implement it. If we could have, we would have promoted COVID-safer activities such as being outdoors or remote activitie such as gaming. On the right, there are two buttons: one to open a modal for creating a group and one for joining a group. Below the buttons is a list of groups this user has joined. When a user clicks on the group name, they will be redirected to a page dedicated to that group. Finally, underneath the “Contacted” header is a list of people this user has been in contact with in the past 2 weeks through hangouts created in Proxamie.

<img src="./images/ProfilePage.png"/>

## Add Availability
On the add availabilities page, users can use the handy calendar (the package we used for this is called react-schedule-selector) that allows dragging to indicate their availability for the upcoming 7 days. As soon as they use the calendar, their availability is stored into the database.

<img src="./images/AddAvailabilitiesPage.png"/>

## Create Group
<img src="https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg"/>

## Join Group
<img src="https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg"/>

## Group Page
<img src="https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg"/>

## Create Hangout
After clicking on a date on the group page, you can create a hangout that will be visible on the group page. You select the time of the hangout (selected from a dropdown of people's available times), and input a name and description for the hangout. If a hangout is proposed for a time when many people (more than 10) are available, a warning will appear. 

<div style="display: flex">
  <img style="width: 33%; float: left" src="./images/CreateHangout.png"/>
  <img style="width: 33%; float: left" src="./images/CreateHangoutOptions.png"/>
  <img style="width: 33%" src="./images/CreateHangoutWarning.png"/>
</div>

