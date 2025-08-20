mkdir temp
cd temp
rm -rf ./*

git clone https://github.com/Su-Bang-Phishing-Check/Front-Phishing-Check.git  #깃허브 주소
cd Front-Phishing-Check
git checkout main   ## 브랜치명

cd ../../

cp -r ./temp/Front-Phishing-Check/* ./Front/web/

sudo docker compose down
sudo docker compose up -d --build
