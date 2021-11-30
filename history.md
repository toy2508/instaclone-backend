# 11/25

1. git 설치

   - 새폴더를 만들어 신규 프로젝트명을 입력
   - 해당 폴더로 진입해서(cd 새폴더) git init 를 입력(git 초기화)
   - git remote add orgin https://github.com/toy2508/instaclone-backend.git 을 입력

2. npm init -y 설치(packge.json 생성)

3. gitignore 파일 생성

   - VS Code에서 gitignore을 설치(extension 기능)
   - 명령 팔레트 > add gitignore > node 선택하면 gitignore 파일 자동 생성됨

4. README.md 파일 생성

   - git 사용 방법

5. nodemon 설치
   - npm install nodemon --save-dev
   - package.json 파일 script 수정( "dev": "nodemon --exec node server.js )

# 11/26

1. Apollo server/Graphql 설치

   - npm i apollo-server graphql

2. ES Module 사용 (import 구문 사용)

   - package json 파일에 "type":"module" 추가 --> 여기서는 사용하지 않고 Babel을 설치

3. Babel 설치

   - npm install @babel/core @babel/node @babel/preset-env --save-dev
   - babel.config.json 파일 생성 및 설정
     {
     "presets": ["@babel/preset-env"]
     }
   - package.json Script 수정("dev": "nodemon --exec babel-node server")

4. Prisma 설치(ORM)

   - npm install @prisma/cli -D (Prisma 설치)
   - npx prisma init (prisma/schema.prisma 파일 생성 및 초기화)
   - prisma extesion 설치 필요
   - Postgresql 설치 및 셋업(5번 참고)
   - scheme.prisma 파일에 table 구조 작성
   - migration 수행(shecme.prima에 설정한 table 구조가 db table 구조와 동기화됨) : npx prisma migrate dev --preview-feature

5. Pogresql 설치 및 셋업
   - .env 파일에 DATABASE_URL 설정
     예시 : DATABASE_URL="postgresql://postgres:toy2508@49.175.169.117:5432/instaclone?schema=public"

# 11/27

1. PrismaClient 사용

   - import { PrismaClient } from ".prisma/client" 선언
   - const client = PrismaClinet() # 변수 선언

2. Prisma Studio Script 셋업

   - package.json 파일 script에 아래와 같이 작성
     : npx prisma studio

3. 모든 TypeDefs, Resolver(Query, TypeDefs)를 결합하여 Sever에 등록하는 방법(폴더 구조 정의)

   - schema.js 파일을 생성
   - npm i @graphql-tools/load-files, -> loadFilesSync
   - npm i @graphql-tools/merge, -> mergeTypeDefs, mergeResolvers
   - npm i @graphql-tools/schema -> makeExecutableSchema
   - loadFileSync 구문으로 typeDefs, resolvers 파일 전체를 로드한다.
     예시) const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
   - mergeTypeDefs, mergeResolvers 구문으로 모든 파일을 merging 처리
   - 병합처리된 파일들을 makeExecutableSchema 등록
     주의) makeExecuteableSchema 사용시 typeDefs, resolvers의 이름을 변경하면 안됨

4. dotenv 설치
   - npm install dotenv 설치
   - import dotenv from "dotenv"
     dotenv.config() => sever.js 파일 맨위에 등록할 것

# 11/28

1. User 만들기

   - users 폴더 만들기
   - users.muations.js, users.queries.js, users.typeDefs.js 파일 생성
   - typeDefs(User, Mutation-createAccount, Query-seeProfie) 코딩
   - Create Account
     1. 신규로 등록할 username, email 중복검사(DB 존재 여부 확인)
     2. PASSWORD Hash 암호화 처리
     3. 신규 User 정보 DB 저장

2. Hashing(비밀번호 암호화 처리)
   - npm install bcrypt
   - 해쉬 처리
     : const hashedPassword = await bcrypt.hash(password, 10);

# 11/30

1.  SeeProfile Query 만들기

    - prisma에서 findunique를 사용하는 경우 where에 들어가는 컬렁은
      prisma table 생성시 @unique 로 설정되어있어야함

2.  Login 만들기
    - user가 DB에 존재하는지 확인(client.user.findfirst({where:{username}}))
    - 입력된 password가 DB에 저장된 db에 동일한지 확인
      (const paswordOk = await bcrypt.compare(password, user.password))
