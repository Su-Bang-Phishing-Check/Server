import cv2 as cv
import numpy as np
import easyocr

reader = easyocr.Reader(['ko', 'en'])
target = 720


def ImagetoText(image_route):

    image = cv.imread(image_route, cv.IMREAD_COLOR)
    h1, w1 = image.shape[:2]
    nh1 = int(h1*(target/w1))
    image = cv.resize(image, (target, nh1),interpolation=cv.INTER_AREA)
    image = cv.cvtColor(image, cv.COLOR_RGB2GRAY)   #grayscale


    mean_brightness1 = np.mean(image)


    if mean_brightness1<127:   #필요할 시 색상반전
        image = cv.bitwise_not(image)

    th1 = cv.adaptiveThreshold(image, 255,  cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 7, 1)  #이진화

    contour, _= cv.findContours(th1, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)  #외곽선 찾기

    img_color = cv.cvtColor(image, cv.COLOR_GRAY2BGR)
    bubble_boxes = []
    texts = []

    H, W = th1.shape
    img_area = H*W

    for cnt in contour:  #말풍선 검출
        x, y, w, h = cv.boundingRect(cnt)
        area = w*h

        if area > img_area * 0.001 and w > 80 and h > 40:
            bubble_boxes.append((x, y, w, h))
            cv.rectangle(img_color, (x, y), (x+w, y+h), (0, 255, 0), 5)  # 초록 박스

    for i, (x, y, w, h) in enumerate(bubble_boxes):
        print("\n")
        if i%2==1: continue

        roi = image[y:y+h, x:x+w]
        results = reader.readtext(roi)
        fulltext=""
        for _, text, _ in results:
            fulltext+=text

        texts.append(fulltext)
    
    return texts
