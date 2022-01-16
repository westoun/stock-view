# Stock View

In 2021, I spent a couple of months building a tool for 
screening and viewing stocks based on fundamental data developments.
The goal was to overcome some of the shortcomings I perceived in existing
solutions and provision the motivated private investor a tool that's 
flexible regarding both which data should be displayed, and how this
data should be visually structured.


Feel free to use this code for your personal use cases it as you please 
and get in touch if you have any questions or feedback.

This code is not under active development.


## Architecture and Design

The code is structured into different services, each serving a distinct
purpose and function. 
In the docker-compose setup, these services communicate through a shared
reverse proxy, while in the manual setup they send requests directly to
each other (more on that in the upcoming section.)

While I tried to achieve consistent naming and code quality across services,
they are often build using different technologies and languages. Mainly due 
to personal preferences and available third-party libraries.

The services and their functions are as follows:
* Company Data Server: Provide fundamental company data sourced from
[simfin](https://simfin.com/) using node.js and graphql.
* Frontend: The web frontend build with Angular2+.
* Screener Server: Process stock screening requests using python.
* Stock Price Server: Python server providing up-to-date stock prices.
* Database Server: In the docker-compose setup, an additional service is 
started providing a postgres database.







## Getting Started

### Setup

Before starting the application, either manually or via docker-compose, make
sure you have a _.env_ or _.docker.env_ file located in the top level of the application code.

This file must contain the following elements:
```
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=stockview
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SEED_DB=0
```

*SEED_DB* should be set to either 0 or 1, depending if the database has been initialized and
seeded during previous runs. This does not have any affect if the 
services are started manually.

Furthermore, in the manuall setup, the corresponding database has to be already set up
and started. The _.env_ file specifies solely how the different services can connect to the database.


### Run using docker-compose

To start up the application using docker-compose, run
`docker-compose up`

### Run via manual start up

For development purposes, one might chose to start up the
individual services un-containerized.
In this case, enter the corresponding directory and run
`python3 main.py` if the service is python-based, `node index.js` if the service is javascript-based, and `ng serve` in the case of the frontend service.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
