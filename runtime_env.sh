#!/bin/bash
set -e
env_var_prefix="CLIENT_APP_";
envs=`env | grep ${env_var_prefix}`
js_files=`find /home/node/public/static/js -name \*.js -print`
for env in $envs
do
    IFS='=' read -ra ADDR <<< $env
    env_array=(${ADDR[@]})
    if [[ ${env_array[0]} == *"${env_var_prefix}"* ]]; then
        for file in $js_files
        do
            sed -i -e "s+${env_array[0]}+${env_array[1]}+g" $file
        done
    fi
done

exec "$@"

