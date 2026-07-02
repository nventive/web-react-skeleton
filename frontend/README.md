# Frontend

Run `yarn install` and `yarn dev` in this directory to launch the react project in your browser

## Windows

To run on windows, use docker.

1. Set VITE_DOCKER to true in .env
2. Run `docker compose up -d`
3. Navigate to http://localhost:8000/

> [!NOTE]
>
> The port in step 3 should match the `VITE_PORT` value in your `.env` file.


> [!TIP]
>
> If you change your environment variables in `.env`, you will have to rebuild the container to see the changes using
> the `docker compose up --build -d` command.

To see the logs directly in your console, you can remove the `-d` flag. Otherwise, you can view output in Docker Desktop.

## Update locale files

Pull key:value from google sheets to create json file.
`https://docs.google.com/spreadsheets/d/1Kk8OIOhXxzyMA3ZgyiIiQtdwJNBJvGaUTNsarYHcFsM/`

> [!IMPORTANT]
>
> Please create a new Google Sheet for each new project. Do not use this one for one of your projects

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
