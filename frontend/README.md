# Frontend

Run `yarn install` and `yarn dev` in this directory to launch the react project in your browser

## Update locale files

Pull key:value from google sheets to create json file.
`https://docs.google.com/spreadsheets/d/1Kk8OIOhXxzyMA3ZgyiIiQtdwJNBJvGaUTNsarYHcFsM/`

> **IMPORTANT** Please create a new google sheet for each new project. Do not use this one for one of your projects

Run `yarn sheet2i18n` to update your local keys with what is in the spreadsheet.

## File Structure

    .
    ├── ...
    ├── public                    # Public root
    ├── src
    │   ├── app                   # Typescript app + sass files
    │   │   ├── components
    │   │   ├── containers
    │   │   ├── enums
    │   │   ├── forms
    │   │   ├── hocs
    │   │   ├── icons
    │   │   ├── pages
    │   │   ├── routes
    │   │   ├── services
    │   │   ├── shared
    │   │   ├── stores
    │   ├── assets                # Static assets
    │   │   ├── fonts
    │   │   ├── images
    │   │   ├── locales
    │   └── styles                # Global Sass files.
    │   │   ├── mixins
    │   │   ├── vendors
    ├── example.env
    ├── .env
    └── ...
