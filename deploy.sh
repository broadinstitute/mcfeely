#!/usr/bin/env bash
set -e
set -x

VAULT_TOKEN=$1
GIT_BRANCH=$2   # github branch of the code to deploy
ENVIRONMENT=$3  # hosting environment which the deploy will target

set +x
if [ -z "$ENVIRONMENT" ]; then
    echo "ENVIRONMENT argument not supplied; inferring from GIT_BRANCH '$GIT_BRANCH'."
    if [ "$GIT_BRANCH" == "hackathon" ]; then
        ENVIRONMENT="dev"
    else
        echo "Git branch '$GIT_BRANCH' is not configured to automatically deploy to a target environment"
        exit 1
    fi
elif [[ "$ENVIRONMENT" =~ ^(dev)$ ]]; then
    echo "ENVIRONMENT argument supplied as '$ENVIRONMENT'"
else
    echo "Environment '$ENVIRONMENT' is not supported for deployments via this script."
    exit 1
fi
echo "Deploying branch '$GIT_BRANCH' to environment '$ENVIRONMENT'"
set -x

PROJECT_NAME="broad-dsde-dev"




#### TODO don't use the TOS SA!!!

SERVICE_ACCT_KEY_FILE="deploy_account.json"
# Get the environment-specific credentials for the service account out of Vault
# Put key into SERVICE_ACCT_KEY_FILE
docker run --rm -e VAULT_TOKEN=${VAULT_TOKEN} broadinstitute/dsde-toolbox vault read \
--format=json "secret/dsde/firecloud/${ENVIRONMENT}/tos/deploy-sa" | jq .data > ${SERVICE_ACCT_KEY_FILE}

#### TODO don't use the TOS SA!!!




CODEBASE_PATH=/mcfeely
# Process all Consul .ctmpl files
# Vault token is required by the docker image regardless of whether you have any data in Vault or not
docker run --rm -v $PWD:${CODEBASE_PATH} \
  -e INPUT_PATH=${CODEBASE_PATH}/function \
  -e OUT_PATH=${CODEBASE_PATH}/function \
  -e ENVIRONMENT=${ENVIRONMENT} \
  -e VAULT_TOKEN=${VAULT_TOKEN} \
  broadinstitute/dsde-toolbox render-templates.sh

# Use google/cloud-sdk image to deploy the cloud function
# TODO: is there a smaller version of this image we can use?
docker run --rm -v $PWD:${CODEBASE_PATH} \
    -e BASE_URL="https://us-central1-broad-dsde-${ENVIRONMENT}.cloudfunctions.net" \
    google/cloud-sdk:220.0.0 /bin/bash -c \
    "gcloud config set project ${PROJECT_NAME} &&
     #gcloud auth activate-service-account --key-file ${CODEBASE_PATH}/${SERVICE_ACCT_KEY_FILE} &&
     cd ${CODEBASE_PATH} &&
     gcloud functions deploy tos --source=./function --trigger-http --runtime nodejs6"
