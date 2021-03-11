#!/bin/bash

ELASTICSEARCH_PORT=9200
OPENQUERY_PATH=/home/sop/openquery-management-console-2.4.6
ELASTICSEARCH_DATA_PATH=/home/sop/elastic/elasticsearch-6.5.4/


echo '==================== INSPECTION START ======================='
echo -e '\n'
echo '[Cpu core 수 점검]'
RESULT=$(lscpu | grep 'CPU(s):' | grep -v NUMA | awk '{printf $2}');
echo $RESULT
echo -e '\n'

echo '[Load Average 확인]'
RESULT=$(cat /proc/loadavg | awk '{printf $1" "$2" "$3}');
echo $RESULT
echo -e '\n'


echo '[Elasticsearch 상태 확인]'
RESULT=$(ps -ef | grep elasticsearch | grep -v 'grep');
echo $RESULT
echo -e '\n'


echo '[Elasticsearch Cluster 상태 확인]'
curl localhost:$ELASTICSEARCH_PORT/_cluster/health?pretty
echo -e '\n'


echo '[데이터 색인 상태 확인]'
curl localhost:$ELASTICSEARCH_PORT/_cat/indices?s=i:desc
echo -e '\n'


echo '[OpenQuery 상태 확인]'
cd $OPENQUERY_PATH/bin
./console list
echo -e '\n'



echo '[시스템 디스크 용량 확인]'
df -h
echo -e '\n'


echo '[Elasticsearch 색인 데이터 용량 확인]'
cd $ELASTICSEARCH_DATA_PATH
du -h --max-depth=1
echo -e '\n'



echo '[시스템 메모리 확인]'
free -h
echo -e '\n'