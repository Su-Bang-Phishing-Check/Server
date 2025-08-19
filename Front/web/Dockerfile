# 1. Node.js 베이스 이미지 사용
FROM node:18

# 2. 앱 디렉토리 설정
WORKDIR /app

# 3. 패키지 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 앱 전체 복사
COPY . .

# 5. 프로덕션 빌드
# RUN npm run build

# 6. 앱 실행
CMD ["npm", "run", "dev"]

