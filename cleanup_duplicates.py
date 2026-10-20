import os

base = r'C:\Users\User\photographer-web\public\gallery'

# ⚠️ PUT THE NUMBERS OF THE PHOTOS YOU WANT TO KEEP HERE ⚠️
KEEP = [1, 3, 4, 7, 10, 15, 20] 

# 1. Delete all files NOT in the KEEP list
for i in range(1, 100): # Check up to 100
    filename = f'{i}.jpg'
    filepath = os.path.join(base, filename)
    if os.path.exists(filepath):
        if i not in KEEP:
            os.remove(filepath)
            print(f'Deleted: {filename}')

# 2. Rename the remaining files to 1.jpg, 2.jpg, 3.jpg... sequentially
for new_index, old_index in enumerate(KEEP, start=1):
    old_name = f'{old_index}.jpg'
    new_name = f'{new_index}.jpg'
    old_path = os.path.join(base, old_name)
    new_path = os.path.join(base, new_name)
    
    if old_name != new_name and os.path.exists(old_path):
        # Move old to temp name first to avoid overwrite conflicts
        temp_name = f'temp_{new_index}.jpg'
        temp_path = os.path.join(base, temp_name)
        os.rename(old_path, temp_path)
        os.rename(temp_path, new_path)
        print(f'Renamed: {old_name} -> {new_name}')

print(f'DONE! You now have {len(KEEP)} photos.')