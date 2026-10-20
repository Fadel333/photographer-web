import os, shutil

base = r'C:\Users\User\photographer-web\public\gallery'
images = []

for root, dirs, files in os.walk(base):
    for f in files:
        if 'jpg' in f.lower() or 'jpeg' in f.lower() or 'png' in f.lower():
            images.append(os.path.join(root, f))

images.sort()

for i, img_path in enumerate(images, start=1):
    new_name = f'{i}.jpg'
    new_path = os.path.join(base, new_name)
    
    if img_path == new_path: 
        continue
        
    if os.path.exists(new_path):
        os.remove(new_path)
        
    shutil.move(img_path, new_path)
    print(f'Renamed: {os.path.basename(img_path)} -> {new_name}')

print(f'DONE! Total images: {len(images)}')