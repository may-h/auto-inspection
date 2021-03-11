#!/bin/bash

export ELASTICSEARCH_PORT=9200
export OPENQUERY_PATH=/home/sop/openquery-management-console-2.4.6
export ELASTICSEARCH_DATA_PATH=/home/sop/elastic/elasticsearch-6.5.4/

echo "점검 대상 타입 ?"

select type in "검색엔진" "챗봇엔진" "추천엔진" "Exit"
do
    case ${type} in
        검색엔진)
            filePath=search.txt
            break
            ;;
        챗봇엔진)
            echo 챗봇엔진@
            break
            ;;
        추천엔진)
            echo 추천엔진#
            break
            ;;
        Exit|*)
            echo Good Bye
            exit 1
    esac
done

echo '==================== INSPECTION START ======================='
while read line
do
    # echo $line
    IFS='=' eval 'array=($line)'
    NAME=$(echo ${array[0]} | tr -d ' ')

    if [ "$NAME" == "name" ]; then
        echo "[${array[1]}]"

    elif [ "$NAME" == "command" ]; then
       # eval ${array[1]}
        if [ ! -z ${array[2]} ]; then # IFS에서 구분자 "="가 잘려 명령어가 잘린 경우를 대비해 추가. 
            eval ${array[1]}=${array[2]}
        else
            eval ${array[1]}
        fi

    elif [ "$NAME" == "{" ] || [ "$NAME" == "}" ]; then
        echo -e '\n'
    fi
done < $filePath