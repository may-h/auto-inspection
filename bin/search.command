{
    name=Cpu core 수 점검
    command=lscpu | grep 'CPU(s):' | grep -v NUMA | awk '{printf $2}'
}
{
    name=Load Average 확인
    command=cat /proc/loadavg | awk '{printf $1" "$2" "$3}'
}
{
    name=Elasticsearch 상태 확인
    command=curl localhost:9200
}
{
    name=Elasticsearch Cluster 상태 확인
    command=curl localhost:$ELASTICSEARCH_PORT/_cluster/health?pretty
}
{
    name=데이터 색인 상태 확인
    command=curl localhost:$ELASTICSEARCH_PORT/_cat/indices?s=i:desc
}
{
    name=OpenQuery 상태 확인
    command=cd $OPENQUERY_PATH/bin
    command=./console list
}
{
    name=시스템 디스크 용량 확인
    command=df -h
}
{
    name=Elasticsearch 색인 데이터 용량 확인
    command=cd $ELASTICSEARCH_DATA_PATH
    command=du -h --max-depth=1
}
{
    name=시스템 메모리 확인
    command=cd $ELASTICSEARCH_DATA_PATH
    command=free -h
}
