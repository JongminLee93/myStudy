## Background
1. 대기 - 해양 모델 접합 연구 (GRIMs-Chem & NEMO)
2. 접합을 위한 coupler로 OASIS3-MCT 활용
3. 모델 수행 및 OASIS3-MCT 활용을 위한 병렬 프로그래밍을 위해 MPI에 대한 이해 필요

## MPI
**Message Passing Interface**   
Message Passing : 각각의 메모리를 갖는 프로세스들이 데이터를 공유하기 위해 메시지(데이터)를 송·수신하여 통신하는 방식   
메시지 패싱을 활용한 병렬 프로그래밍을 위해 표준화된 데이터 통신 라이브러리

## Workflow
1. Coupling Initialisation
   - MPI 및 oasis에 사용될 각종 변수 설정 및 초기화

2. Communicator for internal parallelisation
   - MPI에 의해 설정된 communicator 값 불러오기(oasis)
   - MPI communicator에서 프로세스의 rank, size 값 불러오기(MPI)
     - size값은 왜 필요하지?

3. Partition definition
   - all processes exchanging coupling data have to express (in a global index space) the local partitioning of the different grids onto which the data is expressed.
   - 각 프로세스에서 계산할 partition의 격자 정보 입력

4. Grid data file definition
   
5. Coupling field declaration
   - 교환할 field 선언

6. End of definition phase

7. Sending and receiving data

8. Termination

## The configuration file `namcouple`

The OASIS3-MCT configuration file `namcouple` contains, pre-defined keywords, all user-defiend information necessary to configure a particular coupled run. The `namcouple` is a text file with the following characteristics:
 - the keywords used to separate the information can appear in any order;
 - 두 개의 string 사이의 공백 길이는 의미 없음
 - `#`로 주석 처리
 - 공백 줄 허용 안 함
 - 키워드는 `$`로 prefixed, `$`는 반드시 줄의 맨 앞에서 두 번째에 위치해야 함 (맨 앞에서 한 칸 띄어서)

크게 predefined keywords part, coupling field information part, 두 개의 파트로 구분

```
############ Predefined keywords
 $NFIELDS
18
 $RUNTIME
7776000
 $NLOGPRT
10
############ Coupling field informations
 $STRINGS
OCN_SST ocn_sst 1 86400 1 restart.nc EXPORTED
360 216 192 144 otm1 atm1 LAG=0
P 0 P 0
SCRIPR
BILINEAR LR SCALAR LATLON 1
############
...
```
1. Predefined keywords
   - `$NFIELDS` : coupling하는 field의 개수
   - `$RUNTIME` : 총 수행시간 (단위 : sec)
   - `$NLOGPRT` : amount of debug information

2. Coupling field informations
   - `$STRINGS` : coupling field information starting keywords
   - `OCN_SST` : source component에서의 변수 명
   - `ocn_sst` : target component에서의 변수 명
   - `1` : __NOT USED__ but required for parsing
   - `86400` : component끼리 field를 주고 받는 시간 주기 in sec
   - `1` : number of transformations to be performed by OASIS3 on this field
   - `restart.nc` : name of the coupling restart file for the field
   - `EXPORTED` : exchanged / `EXPOUT` : exchanged and written to debug NetCDF files 
   - `360` : 
