# 아키텍처
## 엔진 아키텍처
- Mysql Engine, Storage Engine으로 구분된다.
- 스레딩구조는 foreground, background thread로 구분된다.
  - foreground thread
    - 커넥션 연결로 활용되거나 thread cache영역으로 다시 돌아가는 경우이다.
    - 따라서 최소 클라이언트 수만큼 존재한다.
  - background thread(InnoDB)
    1. Insert Buffer병함
    2. 로그를 디스크로 기록
    3. InnoDB 버퍼 풀의 데이터를 디스크에 기록
    4. 데이터를 버퍼로 읽음
    5. lock or deadlock을 모니터링
- 메모리 할당 및 사용 구조
  - 글로벌 영역, 세션 영역
    - 글로벌 영역
      - 테이블 캐시
      - InnoDB 버퍼 풀
      - InnoDB 어댑티브 해시 인덱스
      - InnoDB redo 로그 버퍼
    - 세션 (로컬) 영역
      - 정렬 버퍼
      - 조인 버퍼
      - 바이너리 로그 캐시
      - 네트워크 버퍼
