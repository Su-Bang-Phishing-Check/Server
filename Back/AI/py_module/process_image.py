import pytesseract
from PIL import Image

def ImagetoText(filename):
    result = pytesseract.image_to_boxes(f'./uploads/{filename}')
    print(result)
    return result