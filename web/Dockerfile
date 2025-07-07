FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 현재 디렉토리의 모든 파일 복사 (index.html, style.css 등)
COPY . .

# 정적 웹서버 설치
RUN npm install -g http-server

# 내부 포트 8080 사용
EXPOSE 8080

# 정적 서버 실행
CMD ["http-server", "-p", "8080"]
