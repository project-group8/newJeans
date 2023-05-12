
# 🔔 [훈수] 나한테 훈수를 해줘❗

###  AI훈수킹과 함께하는 훈수 파티


- 제목을 보고 일정 확률로 AI훈수킹이 훈수를 해줍니다.
- 다양한 카테고리가 분류를 통해서 원하는 훈수를 들을 수 있습니다.
- 다른 사람의 글에 훈수를 남겨줄 수 있습니다.
- 찬반 투표 훈수로 서로의 의견을 나눌 수 있습니다.

### [📌 훈수를 체험해보세요!](https://hoonsoo.net/)  

## Contents | 목차
1. [TimeLine | 타임라인](#-timeline-|-타임라인)
2. [Architecture | 아키텍쳐](#-architecture-|-아키텍쳐)
3. [Feature | 구현 기능](#-feature-|-구현-기능)
4. [ERD | 데이터 구조도](#-erd-|-데이터-구조도)
5. [Stacks | 사용 스택](#-stacks-|-사용-스택)
6. [Trouble Shooting | 트러블 슈팅](#-trouble-shooting-|-트러블-슈팅)
8. [Team | 팀원 소개](#-who-made-it-|-팀원-소개)

## TimeLine | 타임라인
- 총 프로젝트 기간 3월 31일 ~ 5월 11일 (6주)
- 5월 5일 배포 및 런칭

## Architecture | 아키텍쳐

![image](https://github.com/project-group8/newJeans/assets/124944568/0f4594fb-0540-4268-ac0e-ec099b9d8b43)


## ERD | 데이터 구조도
![image](https://github.com/project-group8/newJeans/assets/124944568/41b4c883-d66c-4feb-943e-af435d5979aa)

## Feature | 구현 기능

#### 무플 방지 AI 훈수킹
  ```
  무플 걱정은 마세요. AI 훈수킹이 제목을 보고 훈수를 남겨줍니다!
  ```
#### 서로 의견이 다를 땐 투표를 받아보자
  ```
  찬반 투표, 선택형 투표로 구성된 투표기능을 이용해 어떤 의견이 더 많은지 확인해 보세요.
  ```
#### 내 관심사만 보고 싶을 땐 다양한 카테고리 검색
  ```
  카테고리를 여러 분야로 나누어 내 관신사만 볼 수 있습니다.
  또한 진지, 유머로 나누어져 편하게 대화도, 진지한 훈수도 받아볼 수 있어요.
  ```

## 🛠️ Stacks | 사용 스택

**Back End**

<img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=Typescript&logoColor=black"> <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=NODE.JS&logoColor=black"> <img src="https://img.shields.io/badge/EXPRESS-000000?style=for-the-badge&logo=Express&logoColor=white">

<img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/MYSQL-4479A1?style=for-the-badge&logo=MYSQL&logoColor=white"> <img src="https://img.shields.io/badge/SEQUELIZE-52B0E7?style=for-the-badge&logo=SEQUELIZE&logoColor=white"> 

<img src="https://img.shields.io/badge/AMAZON S3-569A31?style=for-the-badge&logo=AMAZON S3&logoColor=white"> <img src="https://img.shields.io/badge/AMAZON EC2-ff9900?style=for-the-badge&logo=AMAZON EC2&logoColor=white">

<img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white"> <img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"> <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">

<img src="https://img.shields.io/badge/openai-412991?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/MULTER-F46519?style=for-the-badge&logo=MULTER&logoColor=white"> <img src="https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=AXIOS&logoColor=white"> <img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white">

<img src="https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white"> <img src="https://img.shields.io/badge/amazoncloudwatch-FF4F8B?style=for-the-badge&logo=amazoncloudwatch&logoColor=white">

<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white"> 

<img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"> <img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=GITHUB&logoColor=white"> <img src="https://img.shields.io/badge/VISUAL STUDIO CODE-007ACC?style=for-the-badge&logo=VISUAL STUDIO CODE&logoColor=white">

## Trouble Shooting | 트러블 슈팅
<details><summary>Docker overlay2</summary>
1. [문제점] Server2가 CD 과정중에 용량 부족으로 실패하는 에러가 발생했다.
	
2. 우리팀 서버는 EC2 프리티어를 사용하고있다.
	
3. EC2 프리티어의 용량이 8GB 밖에 되지 않기 때문에 백업 버전관리를 서버에서 직접하지 않고 도커 허브를 통해서 하고 있었다.
	
4. jenkins를 통해서 CI/CD결과를 받아보고 서버의 남은 용량이 5% 밖에 남지 않았다는 것을 인지하게 되었다. 직접 확인해 보니 정말로 5%밖에 남지 않았다.
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/06e12e72-3482-47a8-bf1e-a63ee0e7a915)
    
5. workflow에서 이전 버전의 container 및 image의 삭제를 자동화 해놓은상황이었기 때문에 서버에 직접 접속해서 남아있는 구버전의 container와 image가 남아있는지 명령어로 확인했다.
6. 하지만 구버전의 image와 container는 존재하지 않았다.
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/602adb33-c788-443e-bded-8f5379ecae16)
    
7. 확인해 보니 /var/lib/docker/overlay2 경로에서 많은 용량을 차지하고 있는 것을 발견했다.
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/fb102db5-84d9-486c-8efc-64e3961d726c)
    
8. [해결 방법] 문제를 찾아보니 /var/lib/docker/overlay2 가 용량이 큰 경우 diff/tmp 에 컨테이너 내부 파일구조 변경 사항들이 과도하게 쌓였기 때문이라고 한다. 이 파일은 삭제해도 동작에 큰 문제가 생기지 않는다고 한다.
    1. Docker 컨테이너의 작동원리는 여러 개의 레이어로 구성된 이미지를 기반으로 실행된다.
    2. 각 레이어는 독립적인 파일 시스템을 가지는데 이러한 레이어들을 효율적으로 관리하고 겹치게 하기 위해 Docker는 스토리지 드라이버를 사용한다.
    3. 이번에 문제가 된 overlay2 스토리지 드라이버는 Linux의 OverlayFS 기능을 활용한다.
    4. 이 기능은 OverlayFS는 여러 개의 디렉토리를 하나의 디렉토리처럼 겹치게 하여 사용할 수 있는 유니온 파일 시스템인데. 이를 통해 컨테이너가 실행되는 동안 기존 레이어에 변경사항이 발생하면, 해당 변경사항만을 새로운 레이어에 저장한다.
    5. 이렇게 변경된 내용만 새 레이어에 저장하는 전략을 Copy-on-Write(CoW)라고 한다.
9. 정크 레이어들을 정리 후에 원활하게 동작한다.
</details>

<details><summary>Jenkins⇒ GitHub Actions</summary>
[문제점] Nest.js build를 못버티는 Jenkins EC2 프리티어 서버

1. node.js express를 사용할 때는 문제가 없었다.
2. 하지만 Nest.js로 마이그레이션을 마치고 테스트하자 CI/CD가 이루어지지 않았다.
3. Nest.js의 빌드 과정에서 멈추는 문제가 발생했다. EC2 서버를 살펴보니 cpu 사용량 99.7%에 달했다.
4. Docker의 이미지를 만들때 node 알파인 버전을 사용하면 빌드시에 필요한 메모리가 조금이라도 줄어들지 않을까 생각했는데 효과가 없었다.
5. 왜 빌드 과정에서만 멈추는지 궁금해서 조사해봤다.
6. NestJS는 TypeScript를 기반으로 하는 프레임워크다. TypeScript는 JavaScript의 상위 집합이며, 브라우저와 Node.js에서 기본적으로 이해할 수 없는 구문을 사용하기 때문에 NestJS 애플리케이션을 실행하기 전에는 TypeScript 코드를 JavaScript로 변환하는 빌드 과정이 필요하다는 것을 깨달았다.
7. 이때문에 node.js express에서는 문제가 없었지만 Nest.js에서는 빌드 과정에 문제가 발생했던것
8. 결국 TypeScript의 JavaScript 컴파일시에 근본적인 해결법은 램을 늘리는 것이었고 1GB를 제공하는 t2에서 2GB를 제공하는 t3.small로 티어를 올렸다.
9.  그리고 Dockerfile에서 멀티 스테이지 빌드를 사용했다. 젠킨스 서버에서 빌드를 마친 이미지를 올림으로써 다른 서버에서는 빌드를 할 필요가 없게 만들었다.
10. 성공은 했지만 프로젝트의 크기에 비해서 CI/CD에 소모되는 시간값이 컸다. 그리고 이것마저도 빌드의 안정성이 보장되지 않았고 빌드에 실패하는 경우가 대부분이었다. 
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/342345dc-c71b-49a7-9a44-bbe70752c46a)
    

**[해결 방법]** 돌고 돌아 ***GitHub Actions*** 써야한다. 그리고 버리기 아까운 ***Jenkins*** EC2서버

1. 멘토님과 상담에서 이러한 고민을 질문했고, 근본적인 해결법은 EC2 서버의 사양을 늘리는 것이었다.
2. 만약에 ***Jenkins*** EC2서버가 터지면 어떻게 해결할 것이냐는 질문을 던지셨다.
3. Unstable Program을 신용 할 수 없었고 기존의 ***Jenkins*** 에서 ***GitHub Actions***으로 CI/CD를 옮기기로 결정했다.
4. ***GitHub Actions***에서 제공하는 컴퓨터 스펙은 2-core CPU, 7 GB of RAM memory, 14 GB of SSD disk space로 기존의 ***Jenkins*** EC2서버를 상회했다. 비용적인 측면에서도 공개 repo의 경우 무료다.
5. 이미 구성이 끝나있는 ***Jenkins*** 서버를 버리기는 아까워서 ***Jenkins***에 헬스 체크 기능을 부여했다.
6. ***Jenkins*** EC2서버의 선언적 파이프 라인 코드를 변경해서 main에 merge가 발생할 때, 각각 배포서버의 저장공간, docker image, docker container 상태를 확인하고 슬랙으로 정보를 보내는 임무로 변경했다. 
- ***Jenkins*** 선언적 파이프라인을 변경한 코드 일부
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/5600ce73-aa31-46e0-8d21-1599dbe54a10)
    
- 서버의 health를 확인하는 ***Jenkins***
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/6920ef51-eb06-4be9-a725-f384a13ee25f)
    

**[결과]** ***GitHub Actions***을 이용한 CI/CD결과

1. 압도적인 성능개선 효과가 있었다. build 발생시 메모리 부족으로 build가 되지 않던 불안정한 배포 상태가 해결되었고 배포 시간도 5배 이상 줄어들었다.
	
	![image](https://github.com/project-group8/newJeans/assets/111474725/19f61ccf-c3b7-4cee-bbc7-98c1ab9f49cb)

</details>

<details><summary>Nest.js Prisma seed 자동 생성</summary>
데이터 베이스에 자동으로 더미 데이터 채우기

1. **[문제점]** prisma migration시에 발생하는 데이터 테이블 drop문제를 해결해야 하는데 근본적인 해결책을 찾기까지 시간이 오래걸릴 것으로 예상함.
2. 자동으로 seed를 생성하면 아래와 같은 3가지 이점이 있을 것으로 기대함
    1. prisma migration시에 발생하는 데이터 테이블 drop문제를 해결해야한다. 테스트를 할 때마다 많은 데이터가 drop 될 것이다. 그때마다 drop되는 데이터를 빠르게 채워 줄 수 있음
    2. 데이터 베이스에 자동으로 seed 데이터를 채워 줌으로써 클라이언트에서 많은 테스트가능.
    3. 수작업으로 이루어 졌던 데이터 베이스 더미데이터 추가 작업를 자동화 함으로써 시간 비용을 줄일 수 있을 것을 기대.

### 생성

![image](https://github.com/project-group8/newJeans/assets/111474725/3be55e93-da96-4e53-9b17-8ae32b365195)

### 실행되지 않는 경우

1. [문제점] **유니크 옵션이 설정되어있는 컬럼이 존재한다.**

**[해결 방법]**

첫 cli실행 -> 재실행시 실패함

유니크 컬럼에 입력되는 벨류를 수정해서 유니크 컬럼이 겹치지 않게 해줘야한다.

**2. [문제점]** **테이블 간에 관계 설정이 되어있는 경우**

**[해결 방법]**

관계설정이 되어있는 테이블의 데이터를 먼저 생성하고 그 후에 가져와서 붙여준다. 예를 들어서 CardPost와 User간에 userIdx로 관계 설정이 되어있다면 User에서 userIdx를 찾아와서 붙인다.
  ```javascript
	
  	...

async function main() {
 [...Array.from(Array(30).keys())].forEach(async (item) => {
   const test = await client.users.findFirst({ select: { userIdx: true } });
   const { userIdx } = test;

   const data = {
     postIdx: uuidv4(),
     userIdx: userIdx,

	...
	
  ```
</details>

<details><summary>Nest.js Dto</summary>
	
- 아래와같이 클래스로 정의된 Dto <"Data Transfer Object"> 가 존재
	
- 코드 실행시 Dto로 정의 된 값만 가져오기를 기대함.
	
- **[문제점]** 그러나 모든 BODY를 가져오는 문제 발생함.
	
- Dto가 존재하는데 모든 BODY를 가져오면 지정한 프로퍼티만 가져온다는 Dto의 의미가 희석되지 않나 생각이 들었다.
    
    ```javascript
	
    export class CardPostsDto {
      @IsNotEmpty()
      maincategory: string;
    
      @IsNotEmpty()
      category: string;
    
      @IsNotEmpty()
      @IsNumber()
      splitNumber: number;
    
      @IsNotEmpty()
      @IsNumber()
      splitPageNumber: number;
    }
    
    export class CardPostsPageNation extends PickType(CardPostsDto, [
      'category',
      'maincategory',
    ]) {}
    
    export class UpdateCatAgeDto extends PickType(CardPostsDto, [
      'splitPageNumber',
    ]) {}
	
    ```
    
- 아래는 위 Dto를 적용한 코드와 실행 결과입니다.
    
    ```javascript
    @Post('test')
      @UsePipes(ValidationPipe)
      async testPageNation(
        @Query()
        cardPostsPageNation: CardPostsPageNation,
        @Body()
        updateCatAgeDto: UpdateCatAgeDto,
      ) {
    		// return 값은 Dto로 지정한 프로퍼티만 가져오기를 기대함
        return { updateCatAgeDto, cardPostsPageNation };
      }
    ```
    
    ```javascript
    // 실행 결과
    {
        "updateCatAgeDto": {
            "maincategory": "maincategory111",
            "category": "sgsdgsd",
            "splitNumber": "11", // 의도하지 않은 값
            "splitPageNumber": 11, // 의도하지 않은 값
            "badprop": "11" // 의도하지 않은 값
        },
        "cardPostsPageNation": {
            "maincategory": "유머", // 의도하지 않은 값
            "category": "스포츠", // 의도하지 않은 값
            "splitNumber": "3", // 의도하지 않은 값
            "splitPageNumber": "2",
            "badquery": "242" // 의도하지 않은 값
        }
    }
    ```
    

# 시도 해본 것

### 파라미터는 어떻게 동작하고 있을까?

1. 문제의 파라미터를 가지고 와서 프로퍼티를 찍어보면 정의한 프로퍼티 2개가 들어있었다.
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/bd1f5ab0-6994-4ba2-8006-8b8071d70a53)
    
2. 의도 하지않은 값 badprop을 출력해 보려고 하니 오류가 발생한다.
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/29dbc43b-06ea-4d46-98a1-b9a23d30e725)
    

---

### 파라미터를 이용해서 실제로 배열을 생성한다면 결과가 다르지 않을까?

1.  배열에 직접 입력해서 create
2. 결과에 변화가 없었다.
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/c3c0465a-c552-46ac-8b9d-317e150ffd93)
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/8178e3e5-4200-48d5-8e26-3fe2eff57e89)
    

---

### 혹시 개념을 잘못 알고 있는 것일까?

1. 타입 체크는 아니지만 express에서 비슷하게 테스트 해보았다.
2. 일반 클래스와 빈 클래스 생성
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/9cff0a46-3ad7-4092-97d1-f616fecc8182)
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/35065043-dcf2-4905-a48a-82eb0c0be974)
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/a75f43bd-5be9-4ee0-aa06-3f638640c8e2)
    
3. 결과
    
    ![image](https://github.com/project-group8/newJeans/assets/111474725/7ec43bb0-0a4c-4e18-838d-25810b139e3e)
    

지금 겪고 있는 문제와 완전히 동일해 보였다. 

- 클래스로 정의된 값만 출력 되기를 기대함
- 그러나 생성자를 만들 때 모든 req.body 인자를 입력 받는다.
- 생성자의 프로퍼티를 확인해 보면 내가 의도한 프로퍼티만 확인 된다.

1. 가설
    1. @Body()는 모든 req.Body를 인자로 가지고 오는 것이다.
    2. Dto는 근본적으로 class로 구성되어 있다.
    3. 따라서 Body 인자를 <cardPostsPageNation : CardPostsPageNation> 타입으로 정의했어도. **정의 되지 않은 프로퍼티의 입력은 자유로울 것이다.** 
        1. 의문 : 그렇다면 런타임 중에 입력된 프로퍼티는 참조 할 수 없는걸까? class에 정의 되지 않아서 메모리에 식별자가 등록되지 않았기 때문에 제외 되는 것인가?
    4. 그렇다면 파라미터로 인자가 들어올 때, 인자의 타입체크 및 class-validator는 작동하지 않는걸까?
    - 가설 d. 테스트
        
        ```javascript
        // 테스트를 위한 설정
        ...
        @IsNotEmpty()
          maincategory: string;
        @IsNotEmpty()
          @IsNumber()
          splitPageNumber: number;
        ...
        
        // 테스트를 위해서 maincategory 프로퍼티 추가
        export class UpdateCatAgeDto extends PickType(CardPostsDto, [
          'maincategory',
          'splitPageNumber',
        ]) {}
        ```
        
        ```javascript
        // splitPageNumber 제거 후 입력 
        {
          "maincategory": "maincategory111",
          "category": "sgsdgsd",
          "splitNumber": "dgd",
        
           "badprop" : "11"
        }
        
        // 출력
        "message": [
                "splitPageNumber must be a number conforming to the specified constraints",
                "splitPageNumber should not be empty"
            ],
        ```
        
        ```javascript
        // splitPageNumber에 String 입력 
        {
          "maincategory": "maincategory111",
          "category": "sgsdgsd",
          "splitNumber": "dgd",
          "splitPageNumber": "not Num",
           "badprop" : "11"
        }
        
        // 출력
        "message": [
                "splitPageNumber must be a number conforming to the specified constraints"
            ],
        ```
        
        ```javascript
        // @IsNumber() 제거 후 입력
        {
          "maincategory": 121,
          "category": "sgsdgsd",
          "splitNumber": "dgd",
          "splitPageNumber": "sgsdg",
            "badprop" : "11"
        }
        
        // 출력
        "updateCatAgeDto": {
                "maincategory": 121,
                "category": "sgsdgsd",
                "splitNumber": "dgd",
                "splitPageNumber": "sgsdg",
                "badprop": "11"
            },
        ```
        
    
    테스트 결과
    
    - class안에서 선언된 타입은 class가 type을 체크하지 못하고 전부 받아들였다.
    - 그러나 class-validator를 사용한 부분은 인자를 확인하고 틀릴 경우 오류를 내보냈다.
    
    # **[해결 방법]**
    
    ```
    
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true, // dto에서 명시한 데이터아니면 무시
      }),
    );
    
    ```
    
    화이트 리스트가 true가 아니어서 문제였음
</details>

<details><summary>Redis connection refused</summary>
	
- 포트 설정 확인
	
    - 6379 기본 redis 포트 확인 → 다음 단계로 진행
	
- 방화벽 설정 확인
	
    - EC2 보안그룹, iptables 확인 6379 port open 확인 → 다음 단계로 진행
	
- redis 설치 확인
	
    - EC2 ubuntu계정 redis-server 명령어 실행 → 설치됨 → docker 컨테이너 확인 → 설치 안됨
	
- docker 컨테이너 redis 설치
    
    apt-get update -y
    apt install redis-server -y
    redis-server --daemonize ye
	
</details>

## Team | 팀원 소개

|  | 팀장 | 팀원 |
|--------|--------|--------|
| FE | 이은형 | 김은영 |
| BE | 이건선 | 김오성 |











<br/>




