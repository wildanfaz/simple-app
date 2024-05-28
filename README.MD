# Simple App

This is a simple Express.js application that uses middleware to validate user credentials.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Command](#command)

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/wildanfaz/simple-app.git
   ```

2. Change directory

    ```bash
    cd simple-app
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Copy environment variables

    ```bash
    cp .env.example .env
    ```

## Usage

1. Run docker compose
    ```bash
    docker compose up
    ```

2. Open [postman documentation](https://documenter.getpostman.com/view/22978251/2sA3QsAsFS) to test the endpoint

## Command

### Dumy admin

1. Open new terminal

2. Update DB_HOST value in .env to localhost

3. Run command bellow
    ```bash
    npm run dumy
    ```
