# node.js 16버전을 사용하겠다는 의미
FROM node:20-alpine 

# 컨테이터 내부 현 디렉토리를 frontend로 설정
WORKDIR /frontend

# package.json을 복사 (dependencies를 설치하기 위함)
COPY package.json .

# package.json에 있는 dependencies를 설치
RUN yarn

# /frontend에 있는 모든 파일들을 복사 (소스 코드)
COPY . ./

# 디버그 개발용 실행
# RUN yarm dev

# 아래는 배포용
# RUN yarn build