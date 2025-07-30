#volume을 만든다
sudo docker volume create certloc
sudo docker volume create challengeloc
sudo docker volume create app_data

sudo docker compose -f get-ssl.yml up --abort-on-container-exit

sudo docker compose up -d --build

