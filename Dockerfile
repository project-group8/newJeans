FROM node:latest AS builder

# Work Directory 설정
WORKDIR /app
# 패키지 설치를 위한 Package.json 복사
COPY ["package.json" , "package-lock.json" , "./"]
# package.json 에 작성된 package 설치
RUN npm install
# Build를 위한 파일 복사
COPY ["tsconfig.build.json" , "tsconfig.json", "./"]
COPY ["nest-cli.json" , "./"]
COPY ["src/", "./src/"]
RUN npm run build

# Step 2 : Run
FROM node
# Work Directory 설정
WORKDIR /app
# Stemp 1의 builder에서 build된 프로젝트를 복사
COPY --from=builder /app ./
# 3000번 포트 열음
EXPOSE 3000
# npm run start:prod
CMD ["npm" , "run" ,"start:prod"]