mkdir temp
cd temp
rm -rf ./*

git clone https://github.com/Su-Bang-Phishing-Check/Front-Phishing-Check.git
cd Front-Phishing-Check
git checkout main

cd ../../

cp -r ./temp/Front-Phishing-Check/* ./Front/web/

sudo docker compose down
sudo docker compose up -d --build
