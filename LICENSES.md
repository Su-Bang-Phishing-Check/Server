# Third-Party Licenses & Attributions

본 프로젝트는 다음 오픈소스 구성요소를 사용합니다. 각 구성요소의 라이선스와 권리자(가능한 경우)를 다음과 같이 고지합니다.  
※ “원문” 링크는 공식 LICENSE/문서 위치입니다.

## Database
- **MySQL (Docker 이미지 기반 실행)**
  - License: **GPL v2** (Community Server)
  - Copyright: © 1997–2025 Oracle and/or its affiliates
  - 메모: 서버를 **컨테이너로 실행(비배포)** 하는 것은 통상 GPL 의무를 유발하지 않음. 다만 **서버 바이너리 자체를 함께 배포**하거나 **커넥터를 함께 재배포**하는 경우 GPL/예외(FOSS Exception) 조항을 검토 필요.
  - 원문: MySQL 8.0 Community Licensing Information (PDF)

## Backend (Node.js)
- **Node.js**
  - License: **MIT**
  - Copyright: OpenJS Foundation & Node.js contributors
  - 원문: Node.js LICENSE

- **express**
  - License: **MIT**
  - Copyright: Express contributors
  - 원문: expressjs/express (MIT)

- **cors (expressjs/cors)**
  - License: **MIT**
  - Author: Troy Goode
  - 원문: expressjs/cors (LICENSE)

- **promise-mysql**
  - License: **MIT**
  - 원문: CodeFoodPixels/node-promise-mysql (LICENSE)

- **axios**
  - License: **MIT**
  - Copyright: © 2014–present Matt Zabriskie and contributors
  - 원문: axios project site / GitHub

- **cheerio**
  - License: **MIT**
  - Copyright: Cheerio contributors
  - 원문: cheeriojs/cheerio (LICENSE)

- **cron (kelektiv/node-cron)**
  - License: **MIT**
  - 원문: kelektiv/node-cron (LICENSE)

## Frontend (Next.js)
- **Next.js**
  - License: **MIT**
  - Copyright: Vercel, Inc.
  - 원문: vercel/next.js (LICENSE)

- **Tailwind CSS**
  - License: **MIT**
  - Copyright: Tailwind Labs, Inc.
  - 원문: tailwindlabs/tailwindcss (LICENSE)

- **Tailwind CSS Spinner – Flowbite**
  - License: **MIT**
  - Copyright: Themesberg (Bergside Inc.)
  - 원문: flowbite.com License / themesberg/flowbite (LICENSE)

- **react-icons**
  - License: **MIT**（패키지 자체）
  - Copyright: React Icons contributors
  - **중요**: react-icons에 포함된 각 **아이콘 팩의 라이선스**는 별도로 존재(예: 일부는 MIT, 일부는 CC BY 등). 프로젝트에서 특정 아이콘 팩을 번들/재배포한다면 해당 팩의 라이선스도 확인/표기 권장.
  - 원문: react-icons/react-icons (LICENSE)

- **next-pwa**
  - License: **MIT**
  - Copyright: shadowwalker
  - 원문: shadowwalker/next-pwa (LICENSE)

## AI / Python
- **Python**
  - License: **PSF License 2.0**（MIT 계열）
  - Copyright: © 2001–2025 Python Software Foundation
  - 원문: Python 공식 문서 “History and License”

- **Flask**
  - License: **BSD-3-Clause**
  - Copyright: Pallets team
  - 원문: pallets/flask (LICENSE)

- **Werkzeug (werkzeug.utils 포함)**
  - License: **BSD-3-Clause**
  - Copyright: Pallets team
  - 원문: pallets/werkzeug (LICENSE)

- **OpenCV / opencv-python**
  - License: **Apache-2.0 (OpenCV 코어)**, **MIT (opencv-python 래퍼 스크립트)**
  - 메모: Apache-2.0의 경우 NOTICE 파일이 있으면 함께 포함.
  - 원문: opencv.org License / PyPI opencv-python “Licensing”

- **PyTorch**
  - License: **BSD-3-Clause**
  - Copyright: Meta Platforms, Inc. & PyTorch contributors
  - 원문: pytorch/pytorch (LICENSE)

- **Transformers (Hugging Face)**
  - License: **Apache-2.0**
  - 원문: huggingface/transformers (LICENSE)

## Infra
- **Docker Engine (Moby)**
  - License: **Apache-2.0**
  - 원문: moby/moby (LICENSE)

- **Docker Compose**
  - License: **Apache-2.0**
  - 원문: docker/compose (LICENSE)

- **Certbot (Let’s Encrypt)**
  - License: **Apache-2.0**
  - 원문: certbot/certbot (LICENSE)

- **Nginx**
  - License: **BSD-2-Clause**
  - Copyright: © 2002–2021 Igor Sysoev; © 2011–2025 NGINX, Inc.
  - 원문: nginx.org (License / OSS Components)
