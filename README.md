# auto-inspection
## 모듈 설명

아이브릭스 검색엔진 및 챗봇엔진의 서버 점검 시, 점검에 필요한 CMD 명령어들을 자동으로 실행시켜 결과 값을 원하는 데이터로 저장하는 모듈입니다.

해당 모듈은 Linux 서버에서만 사용 가능합니다. 

## Nodejs로 모듈 실행 시

- Output Form : json, xlxs, console

### 1. npm install

```bash
$ npm install 
```

### 2. 설정 파일 변경

모듈 실행에 필요한 경로를 점검 서버에 맞게 변경하여 수정합니다. 

OPENQUERY_PATH는 검색엔진 점검에만 사용합니다. 

```bash
# $MODULE_HOME/config/ 
$ vi config.json
{
    "ELASTICSEARCH_DATA_PATH" : "/home/sop/elastic/elasticsearch-6.5.4/",
    "ELASTICSEARCH_ROOT_PATH" : "/home/sop/elastic/elasticsearch-6.5.4/",
    "OPENQUERY_PATH" : "/home/sop/openquery-management-console-2.4.6/"
}
```

### 2. 모듈 실행

```bash
# $MODULE_HOME/bin/ 
$ ./inspection start
```

### 3. 실행 언어 선택

점검을 실행할 언어의 숫자를 입력하여 선택합니다. 

```bash
Select Running Language ?
1) node.js
2) shell
3) exit
#? 1  
```

### 4. 점검 대상 선택

점검을 진행할 대상을 선택합니다. 

- search : 검색
- chatbot : 챗봇

```bash
start inspection ...
? Select the type of inspection (Use arrow keys)
❯ search
  chatbot
  [Exit]
```

## Bash Shell로 모듈 실행 시

- Output Form : console

    ```bash
    # 경로 : $MODULE_HOME/bin/ 
    $ ./inspection init 
    ```

## 디렉토리 설명

[디렉토리 설명 ](https://www.notion.so/aecdaf3a2494446ca95f252648e1b782)
