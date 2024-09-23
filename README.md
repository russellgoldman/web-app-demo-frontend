# web-app-demo-frontend
## Installation
Please ensure you have the most up-to-date version of Docker installed on your computer. You can install the most recent version [here](https://www.docker.com/).

## Development Environment
### Starting the Environment
To start the development environment, please run `make dev-up` from the root directory of the project. It can be accessed on `http://localhost:3000`.

This command will boot up the following services (as defined in `docker/compose/docker-compose.dev.yaml`):
- React Development Server

### View Environment Logs
To view the logs of the running development environment, please run `make dev-logs` from the root directory of the project.

### Stopping the Environment
To stop the running development environment, please run `make dev-down` from the root directory of the project.

### Restart the Environment
To rebuild and subsequently start the development environment (if any changes have been made to the project), please run `make dev-restart` from the root directory of the project.
