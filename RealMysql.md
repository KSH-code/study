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
- 플러그인 모델
  - InnoDB
  - validate password
  - query_rewrite 등등 활용 가능
- (SQL Parser <-> SQL Optimizer <-> SQL Executor) | MYSQL Engine <-> (Data read/write) | Storage Engine <-> Disk
- Handler: Mysql Engine이 Storage Engine에 보내는 것을 의미함
- 컴포넌트: 플러그인 아키텍처를 대체하기 위한 8.0 부터 제공되는 기능
- 쿼리 실행 구조
  - 쿼리 파서: 쿼리 문장을 MYSQL이 인식할 수 있는 Token으로 분리해 트리 구조화 함
  - 전처리기: 구조적인 문제가 있는지 확인하고 권한, 객체의 존재 여부 같은 것을 확인
  - 옵티마이저: 저렴한 비용으로 어떻게 처리할지를 선택하는 역할
  - 실행 엔진: 만들어진 계획을 각 핸들러에게 요청하고 결과를 받은 후 다른 핸들러에게 요청하는 역할
  - 핸들러(Storage Engine): Disk로 데이터 저장 및 읽어오는 역할
- 쿼리 캐시: SQL의 실행 결과를 메모리에 캐시하고 동일 쿼리이면 즉시 결과를 반환. 8.0부터는 제거됨
- 스레드 풀: Community edition은 thread pool을 제공하지 않으므로, Percona Server에서 제공하는 기능을 살펴본다.
  - 처리하는 스레드 개수를 줄여서 특정 스레드들에 집중하도록 하기 위함
  - 프로세서 친화도(Processor affinity)를 높이고, Context switch를 줄인다.
  - 기본적으로 CPU 코어 개수만큼 스레드를 만든다. thread_pool_size를 통해 조절이 가능하다.
  - 스레드가 모두 처리 중이면 worker thread추가 or 대기 로 선택 가능하다.
## InnoDB Stroage Engine Architecture
- Record기반의 lock을 제공한다.
- PK기준으로 clustering된다.
  - 순서대로 disk에 저장된다는 뜻
  - Secondary index는 PK값을 참조하는 방식
- MyISAM은 PK와 secondary index와 동일하다.
- Foreign key지원
  - 부모 테이블, 자식 테이블 모두 인덱스가 필요하다.
  - 변경 시에는 부모 테이블이나 자식 테이블에 데이터가 있는지 S-lock을 한다.
  - Dead lock이 발생할 확률이 높다.
    - 다른 회사들은 어떻게 처리하는지?
- MVCC
  - Record레벨의 트랜잭션을 지원하는 DBMS가 제공하는 기능
  - 잠금을 사용하지 않는 일관된 읽기
  - Undo 로그를 활용
  - READ_COMMITTED, REPETABLE_READ, SERIALIZABLE인 경우 InnoDB버퍼 풀이나 undo풀에 있는 데이터와 동일한 것을 반환한다.
  - COMMIT -> 영구적 데이터로 처리
  - 롤백 -> Undo 영역 데이터 복구 -> 언두 영역 초기화
- Non-Locking Consistent Read
  - Serializable이 아닌 경우 Insert와 연결되지 않은 Select는 다른 트랜잭션 작업의 대기를 발생시키지 않는다.
  - 이를 잠금 없는 일관된 읽기라고 한다. 언두 로그를 활용
  - 그래서 오래 켜놓으면 히스토리 로그 때문에 랙이 발생한다. 롤백히스토리 length
- 자동 데드락 감지
  - 주기적으로 Wait-for list를 통해 deadlock을 감지한다.
  - 잠금 대기 중인 graph를 감지한다.
  - 언두 로그가 더 적으면 롤백의 대상이 된다.
- 자동화된 장애 복구
  - Mysql 서버가 시작될 때, 완료되지 못한 트랜잭션이나 디스크에 일부(Partial write)기록된 데이터를 통해 복구 작업 진행됨
  - 복구할 수 없는 경우 서버가 종료된다.
- InnoDB 버퍼 풀
  - 랜덤 엑세스를 최소화하기 위해, 모아서 처리하기 위함
  - 5.7 부터 동적 설정 가능
  - 
