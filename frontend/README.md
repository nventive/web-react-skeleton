# Frontend

Run `yarn install` and `yarn dev` in this directory to launch the react project in your browser

## Windows

To run on windows, use docker.

1. Run `docker-compose up --build --no-recreate -d` in this directory to create the container.
2. Run `docker exec -it vite_docker sh` to log into the container.
3. Run `corepack enable` and `yarn set version stable` to use the latest version of yarn.
4. Run `yarn` and `yarn dev` to launch the react project in your browser.

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
