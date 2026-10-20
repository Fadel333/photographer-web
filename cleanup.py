import os
import shutil

base = r'C:\Users\User\photographer-web\public\gallery'
valid_exts = ('.jpg', '.jpeg', '.png')
images = []

# 1. Find all images recursively
for root, dirs, files in os.walk(base):
    for f in files:
        if f.lower().endswith(valid_exts):
            images.append(os.path.join(root, f))

# 2. Sort them so the numbered ones stay at the front
images.sort()

# 3. Move and rename them
for i, img_path in enumerate(images, start=1):
    new_name = f'{i}.jpg'
    new_path = os.path.join(base, new_name)
    
    # If the file is already named correctly and in the right place, skip
    if img_path == new_path: 
        continue
        
    # Move/Rename
    shutil.move(img_path, new_path)
    print(f'Renamed: {os.path.basename(img_path)} -> {new_name}')

# 4. Delete empty subfolders
for item in os.listdir(base):
    item_path = os.path.join(base, item)
    if os.path.isdir(item_path):
        shutil.rmtree(item_path)
        print(f'Deleted folder: {item}')

print(f'DONE! Total images: {len(images)}')