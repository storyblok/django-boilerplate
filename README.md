<p align="center">
  <h1 align="center">django-boilerplate for Storyblok</h1>
  <p align="center">A <a href="https://www.storyblok.com" target="_blank">Storyblok</a> boilerplate in python with django which helps you to get started.</p>
</p>
<br>

[![GitHub release](https://img.shields.io/github/release/storyblok/django-boilerplate.svg)](https://github.com/storyblok/django-boilerplate/)

## What is a storyblok boilerplate
If you want to use your server or have already an existing project in which you want to integrate Storyblok you can use one of our boilerplates. 

## How can I start with a boilerplate

The most efficient way to start a storyblok project as a developer would be our [Command Line Interface](https://www.storyblok.com/docs/Guides/command-line-interface).

For this specific boilerplate we created a full tutorial: https://www.storyblok.com/tp/add-a-headless-cms-to-python-django-in-5-minutes

```
npm i storyblok -g
storyblok select
```

and choose your boilerplate. You can of course simply `download` or `clone` this repository as well.

```
git clone https://github.com/storyblok/django-boilerplate
```

## Configuration
In the `settings.py` all you need to change is the `STORYBLOK_CONFIGURATION` - by adding your space information. [What is a Space?](https://www.storyblok.com/docs/terminology/space):

```
STORYBLOK_CONFIGURATION = {
  'PRIVATE_TOKEN': 'Iw3XKcJb6MwkdZEwoQ9BCQtt', #change this to your private key.
  'HOME_SLUG': 'home'
}
```

## Start your local environment

Make sure [Django](https://www.djangoproject.com/) and [Jinja2](http://jinja.pocoo.org/) are installed:

```
pip install django
pip install Jinja2

## This will start the python server for you as you already know it from django itself.
python manage.py runserver

## Install all frontend development related dependencies.
npm install

## This will start a proxy to your python server and deliver your .CSS, .JS and other static files
## from the /static/ folder - which will be generated for you from the app folder.
gulp
```


## Folder structure

- `/app/`
  The place where you should put all your scripts, styles source code - you can also add your images here
  but make sure to add a gulp task which copies that to the `static` folder.
- `/webapp/`
  The python application using django itself.
- `/webapp/views/`
  All your layouts and components at one space - if you add a new or change an existing [Jinja2](http://jinja.pocoo.org/) component (`.html.j2`)
  the gulp build will trigger an instant reload for you in the browser - also each component is a representation of a storyblok component.
  If you create a headline component in storyblok - make sure to create a headline.html.j2 as well - so the django application knows which component
  to render.
- `/static/`
  Don't mind the not exisiting folder during the checkout - once you run `gulp` the `app` source files 
  will be prepared (prefixed, minified, uglified, ...) and copied to the `/static/` folder for delivery.


## You want to know more about storyblok?

- [Prologue - Introduction](https://www.storyblok.com/docs/Prologue/Introduction)
- [Terminology - Introduction](https://www.storyblok.com/docs/terminology/introduction)
- [Content Delivery API - Introduction](https://www.storyblok.com/docs/Delivery-Api/introduction)


<br>
<br>
<p align="center">
<img src="https://a.storyblok.com/f/39898/1c9c224705/storyblok_black.svg" alt="Storyblok Logo">
</p>
