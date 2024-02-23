# Northcoders News API

## Hosted Version
You can access the hosted version of this project at https://nc-news-ku4r.onrender.com.

## Summary
This is a backend project that uses an API for accessing data. This projecr mimics the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Setup

Before anything - Make sure you have node and postgress installed.

1. git clone -repo-
2. npm run setup.dbs and seed
3. npm test
4. You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
5. npm install