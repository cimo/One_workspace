#!/bin/bash

if [ -n "${1}" ] && [ -n "${2}" ] && [ -n "${3}" ]
then
    source="./.ms_cronjob-volume/"
    
    mapfile -d '' -t fileList < <(find "${source}" -type f ! -name ".gitkeep" -print0 2>/dev/null)

    if [ ${#fileList[@]} -eq 0 ]
    then
        echo "Copying from volume..."

        docker run --rm \
        --user $(id -u):$(id -g) \
        -v cimo_${1}_ms_cronjob-volume:/home/source/:ro \
        -v $(pwd)/.ms_cronjob-volume/:/home/target/ \
        alpine sh -c "cp -r /home/source/* /home/target/"
    fi

    bash "script/tls.sh" "${1}"

    echo "Execute container."

    if [ "${2}" = "build-up" ]
    then
        if [ "${3}" = "cpu" ]
        then
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env build cimo_ow_nodejs_cpu --no-cache &&
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env up cimo_ow_nodejs_cpu --detach --pull always &&
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env build cimo_ow_python_cpu --no-cache &&
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env up cimo_ow_python_cpu --detach --pull always
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env build cimo_ow_apache --no-cache &&
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env up cimo_ow_apache --detach --pull always
        elif [ "${3}" = "gpu" ]
        then
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env build cimo_ow_nodejs_gpu --no-cache &&
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env up cimo_ow_nodejs_gpu --detach --pull always &&
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env build cimo_ow_python_gpu --no-cache &&
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env up cimo_ow_python_gpu --detach --pull always
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env build cimo_ow_apache --no-cache &&
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env up cimo_ow_apache --detach --pull always
        fi
    elif [ "${2}" = "up" ]
    then
        if [ "${3}" = "cpu" ]
        then
            docker compose -f docker-compose-cpu.yaml --env-file ./env/${1}.env up --detach --pull always
        elif [ "${3}" = "gpu" ]
        then
            docker compose -f docker-compose-gpu.yaml --env-file ./env/${1}.env up --detach --pull always
        fi
    fi
fi
