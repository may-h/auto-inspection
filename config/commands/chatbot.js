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
            "checkPoint" : "CPU 사용률을 확인하여 비정상/정상 유무를 판단한다."
        }
    ],
    "Service 상태 점검" : [
        {
            "name" : "Elasticsearch 상태 확인",
            "command" : "ps -ef | grep elasticsearch | grep -v 'grep'",
            "checkPoint" : "Elasticsearch 서비스 활성화 여부를 확인한다."
        },
        {
            "name" : "Elasticsearch Cluster 상태 확인",
            "command" : `curl localhost:${config["ELASTICSEARCH_PORT"]}/_cluster/health?pretty`,
            "checkPoint" : "Elasticsearch Cluster 상태를 확인한다."
        },
        {
            "name" : "NLU 상태 확인 ",
            "command" : "ps -ef | grep nlu",
            "checkPoint" : "Teana NLU 활성화 여부를 확인한다.",
        },
        {
            "name" : "챗봇 서비스 상태 확인 ",
            "command" : "pm2 list",
            "checkPoint" : "Teana 챗봇 서비스 활성화 여부를 확인한다.",
        },
        {
            "name" : "Redis 상태 확인 ",
            "command" : "ps -ef | grep redis",
            "checkPoint" : "Redis 활성화 여부를 확인한다.",
        },
        {
            "name" : "데이터 색인 상태 확인",
            "command" : `curl localhost:${config["ELASTICSEARCH_PORT"]}/_cat/indices?s=i:desc`,
            "checkPoint" : "색인된 인덱스 상태를 확인한다."
        },

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
            "command" : "free -h",
            "checkPoint" : "사용 가능한 메모리 용량을 확인하여 Out Of Memory Error를 사전에 방지한다."
        }
    ],
    "Log 상태 점검" : [
        {
            "name" : "Elasticsearch log",
            "command" : "zcat *.log.gz | grep ERROR",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "Elasticsearch Log를 확인한다"
        },
        {
            "name" : "수집기 log",
            "command" : "cat *.log | grep ERROR",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "'수집기 log를 확인한다. "
        },
        {
            "name" : "Teana NLU log ",
            "command" : "cat *.log | grep ERROR",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "Teana NLU Log를 확인한다"
        },
        {
            "name" : "Teana chatbot log ",
            "command" : "cat *.log | grep ERROR",
            "response" : "로그를 직접 확인해주세요.",
            "checkPoint" : "Teana chatbot Log를 확인한다"
        }
    ]
}