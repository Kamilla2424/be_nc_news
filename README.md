# Northcoders News API

The .env files aren't included when repo is clones so you'll need to create the files, heres how:

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
You'll need to run npm install at this point.