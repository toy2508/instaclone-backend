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

1. SeeProfile Query 만들기

   - prisma에서 findunique를 사용하는 경우 where에 들어가는 컬렁은
     prisma table 생성시 @unique 로 설정되어있어야함

2. Login 만들기

   - user가 DB에 존재하는지 확인(client.user.findfirst({where:{username}}))
   - 입력된 password가 DB에 저장된 db에 동일한지 확인
     (const paswordOk = await bcrypt.compare(password, user.password))
   - jsonwebtoken 설치(npm install jsonwebtoken)
   - jwt.sign(payload, private_secret_key)을 통해 토큰을 발생

3. 기능 단위로 폴더 및 파일 분리(중요)

   - User 폴더안에 기능 단위로 폴더를 만들고 각 기능별로 typeDefs, resolvers를 구현하도록 구조 변경(코드 복잡도 해소)
   - 기존에 mutations, queries로 분리하던 것을 resolvers 파일 하나로 만든다
     (scheme.js 파일에 loadFileSync 부분을 const loadedTypes = loadFilesSync(`${__dirname}/**/*.resolvers.js`)로 변경한다. )

4. EditProfile Mutation 만들기

   - firstName, lastName, username, password, email를 matutaion 함수의 인자로 받는다.
   - Client에서 입력된 인자에 한해서만 인자로 넘어오고 나머지는 전부 "undefined" 상태로 넘어온다.
   - prisma에서 client.user.update({where:{id:1}, data:{firstName, lastName, username, password, email}})
     경우 "undefined"로 넘어온 인자에 대해서는 업데이트 처리를 하지 않는다.
   - password는 암호화 처리해서 bcrypt 함수를 통해 update 해야한다
   - jwt.verify(token, process.env.JWT_PRIVATE_KEY)을 통해서 유저가 가진 token에서 id 값을 추출한다.

5. Header를 통해 token 얻기(context 이용하기)

   - apollographql sandbox에서 header에 서버로부터 응답받은 token을 key-value 형태로 입력한다.(key는 token으로 입력했음(아무거나 해도됨))
   - sever.js 파일에 ApolloSever 변수 생성 부분에 context에 header의 token값을 등록할 수 있도록 수정
     수정) const sever = new ApolloSever({schema, context:({req}) => { return { token:req.headers.token }}})

# 12/08

1. protectUser 만들기 : 로그인이 필요한 기능에 대해서는 로그인 검사를 기능 수행전에 처리하는 기능
   - 커리(currying) 기능을 사용
   - const x = (resolver) => (root, args, context, info) => {
     <함수 수행전에 점검 해야하는 기능 ex)로그인 체크>
     return resolver(root, args, context, info) # 함수 실행
     }
   - 커리는 기존 함수 수행전에 수행되어야할 기능들을 먼저 수행할 수 있도록 기존함수를 wrapping 처리한다.

# 12/11

1.  protectUser 함수에서 context.loggedInUser의 값이 promise{null}로 잡혀서
    if (!context.loggedInuser) 조건문을 처리가 할 수 없었다.
    원인은 아래 코드인데 getUser 함수에 await(비동기처리) 를 하지 않아서
    promise{null} 형태로 값이 발생됨(중요)

    코드)
    const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
    return {
    loggedInUser: await getUser(req.headers.token),
    };
    },
    });

2.  파일 업로드

    - Apollo-Sever upload 기능 활성화 필요(활성화를 위해서 아래와 같은 조치 필요)
      조치 내용) schema -> typeDefs, resolvers 로 나누서 ApolloSever에 등록
      Apollo Sever3 버전 이상 부터는 추가적인 조치가 필요함(sever.js 파일 참고할 것)

      1. npm i apollo-server-express express graphql-upload 설치
      2. apollo-server 대신에 apollo-server-express 대체
      3. resolver.js 파일에 export default { Upload: GraphQLUpload,.... }
         typeDefs.js 파일에 export default gql`scalar Upload .....`
         추가 해야 upload를 사용할 수 있음(중요)

    - 파일 업로드를 테스트를 위해서 altire 프로그램을 받아서 설치(다운로드 사이트: https://altair.sirmuel.design/)
      (apollo-server에서 제공하는 studio에서는 파일 업로드 테스트를 할 수 없음)

    - resolver를 통해서 받은 데이터는 filename, mimetype, encoding, createReadStream 이다.
    - createReadStream에서 데이터를 가지고 있음
      예시) const {filename, createReadStream} = await avatar();
      const readStream = createReadStream(); //전송된 데이터를 읽는다.

            //서버내에 파일을 저장할 경우
            const writeStream = fs.createWriteStream(process.cwd() + "/upload/" + filename); //데이터를 쓸 저장위치 및 파일명 설정
            readStream.pipe(writeStrema) // readStream 과 writeStream 연결 => 파일 저장됨

            //aws에 파일을 저장할 경우
