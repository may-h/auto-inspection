const approot = require('app-root-path').path;
const config = require(`${approot}/config/config.json`);

module.exports =  {
    "CPU 상태 점검" : [
        {
            "name" : "Cpu core 수 점검",
            "command" : "lscpu | grep 'CPU(s):' | grep -v NUMA | awk '{printf $2}'",
            "checkPoint" : "대상 시스템의 CPU Core 수를 확인한다."
        },
        {
            "name" : "Load Average 확인",
            "command" : "cat /proc/loadavg | awk '{printf $1\" \"$2\" \"$3}'",
            "checkPoint" : "User APP의  CPU 사용률을 확인하여 비정상/정상 유무를 판단한다."
        }
    ],
    "Service 상태 점검" : [
        {
            "name" : "Elasticsearch 상태 확인",
            "command" : "ps -ef | grep elasticsearch | grep -v 'grep'",
            "checkPoint" : "대상 시스템의 CPU Core 수를 확인한다."
        },
        {
            "name" : "Elasticsearch Cluster 상태 확인",
            "command" : "curl localhost:9200/_cluster/health?pretty",
            "checkPoint" : "Elasticsearch Cluster 상태를 확인한다."
        },
        {
            "name" : "데이터 색인상태 확인",
            "command" : "curl localhost:9200/_cat/indices?s=i:desc",
            "checkPoint" : "정상적으로 데이터 색인 여부를 확인한다."
        },
        {
            "name" : "OpenQuery 상태 확인 ",
            "command" : "./console list ",
            "checkPoint" : "OpenQuery SE 서비스 활성화 여부를 확인한다.",
            "path" : `${config["OPENQUERY_PATH"]}bin/`
        }
    ],
    "Disk 상태 점검" : [
        {
            "name" : "시스템 디스크 용량 확인",
            "command" : "df -h",
            "checkPoint" : "현재 사용가능한 디스크 용량을 확인한다."
        },
        {
            "name" : "Elasticsearch 색인 데이터 용량 확인",
            "command" : "du -h --max-depth=1",
            "checkPoint" : "색인 데이터의 전체 용량을 확인하여 Disk Full를 사전에 방지한다.",
            "path" : `${config["ELASTICSEARCH_DATA_PATH"]}`
        },
        {
            "name" : "시스템 메모리 확인",
            "command" : "free -g",
            "checkPoint" : "사용 가능한 메모리 용량을 확인하여 Out Of Memory Error를 사전에 방지한다."
        }
    ],
    "Log 상태 점검" : [
        {
            "name" : "Elasticsearch log",
            "command" : "zcat *.log.gz | grep ERROR",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "Elasticsearch Log를 확인하여 ERROR가 발생했는지 확인한다"
        },
        {
            "name" : "수집기 log",
            "command" : "cat *.log | grep ERROR",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "'수집기 log를 확인하여 ERROR가 발생했는지 확인한다. "
        },
        {
            "name" : "openquery log ",
            "command" : "./console logs",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "Openquery Log를 확인하여 ERROR가 발생했는지 확인한다"
        }
    ]
}