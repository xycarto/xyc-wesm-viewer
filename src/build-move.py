import os
import subprocess
import shutil
import sys

# python3 src/build-move.py site-dev docs

dir_from = sys.argv[1]
dir_to = sys.argv[2]

# Run NPM build
subprocess.call("npm run build", cwd=dir_from, shell=True)

# Copy Dirs
shutil.copytree(f"{dir_from}/dist/assets", f"{dir_to}/assets", dirs_exist_ok=True)

# Copy Files
shutil.copy(f"{dir_from}/dist/index.html", f"{dir_to}")
shutil.copy(f"{dir_from}/sidebar.js", f"{dir_to}")
shutil.copy(f"{dir_from}/copyJS.js", f"{dir_to}")

# Fix "assets" path in HTML
with open(f"{dir_to}/index.html", 'r') as file:
    data = file.read()
    data = data.replace("/assets", "./assets")
  
# Write new HTML
with open(f"{dir_to}/index.html", 'w') as file:
    file.write(data)