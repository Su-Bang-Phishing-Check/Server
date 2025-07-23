import easyocr
reader = easyocr.Reader(['ko', 'en'])


def group_text_into_paragraphs(results, y_threshold=30):
    """
    EasyOCR 결과에서 비슷한 y 위치에 있는 항목들을 묶고,
    문단 단위로 문자열만 추출한 리스트를 반환.

    :param results: EasyOCR 결과 (bbox, text, confidence) 리스트
    :param y_threshold: y 중심 기준으로 문단 묶음 허용 범위
    :return: ['문단1 문자열', '문단2 문자열', ...]
    """
    import numpy as np

    # 각 항목의 y 중심 좌표 구함
    lines = []
    for bbox, text, conf in results:
        y_center = np.mean([pt[1] for pt in bbox])
        lines.append((y_center, text))

    # y 기준 정렬
    lines.sort(key=lambda x: x[0])

    # 문단 단위로 그룹화
    paragraphs = []
    current_group = []
    last_y = None

    for y, text in lines:
        if last_y is None or abs(y - last_y) <= y_threshold:
            current_group.append(text)
        else:
            # 이전 문단 저장
            paragraph = ' '.join(current_group)
            paragraphs.append(paragraph)
            current_group = [text]
        last_y = y

    # 마지막 문단 추가
    if current_group:
        paragraphs.append(' '.join(current_group))

    return paragraphs


def ImagetoText(filename):
    results = reader.readtext(f'./uploads/{filename}')
    texts = group_text_into_paragraphs(results)
    for paragraphs in texts:
        print(f"{paragraphs}\n")
    return texts
