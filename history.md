11/25

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
   - npm install --save-dev
   - package.json 파일 script 수정( "dev": "nodemon --exec node server.js )

11/26

1. Apollo server 설치

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
   - table 구조 작성

5. Pogresql 설치 및 셋업
   - .env 파일에 DATABASE_URL 설정
     예시 : DATABASE_URL="postgresql://postgres:toy2508@49.175.169.117:5432/instaclone?schema=public"
   -
