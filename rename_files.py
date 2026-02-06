import os
import glob
import re

def main():
    files = glob.glob('src/**/*.ts', recursive=True)
    # Filter files that have a dot in the filename (excluding the extension)
    files_to_rename = []
    for f in files:
        dirname = os.path.dirname(f)
        basename = os.path.basename(f)
        name_without_ext = basename[:-3] # remove .ts
        if '.' in name_without_ext:
            new_name_without_ext = name_without_ext.replace('.', '-')
            new_basename = new_name_without_ext + '.ts'
            new_path = os.path.join(dirname, new_basename)
            files_to_rename.append((f, new_path, name_without_ext, new_name_without_ext))

    # Rename files
    for old_path, new_path, old_name_no_ext, new_name_no_ext in files_to_rename:
        print(f"Renaming {old_path} -> {new_path}")
        os.rename(old_path, new_path)

    # Update imports in ALL .ts files (including those we just renamed)
    # We need to re-scan files because names changed
    all_ts_files = glob.glob('src/**/*.ts', recursive=True)
    
    for file_path in all_ts_files:
        with open(file_path, 'r') as f:
            content = f.read()
        
        original_content = content
        
        # For each renamed file, replace its usage in imports
        # Sort by length of name descending to avoid partial matches being replaced first
        # e.g. 'app.controller.spec' should be processed before 'app.controller' 
        # (though here with dot replacement it might be less critical, but good practice)
        files_to_rename.sort(key=lambda x: len(x[2]), reverse=True)

        for _, _, old_name_no_ext, new_name_no_ext in files_to_rename:
            # We are looking for something like:
            # from './user.service' -> from './user-service'
            # require('./user.service') -> require('./user-service')
            # The pattern is: check if the IMPORT PATH ends with /old_name_no_ext 
            # or is exactly old_name_no_ext
            
            # Simple string replacement might be dangerous if 'user.service' matches something else.
            # But in this codebase, it's likely safe for import paths.
            
            # Escape dots for regex
            old_literal = re.escape(old_name_no_ext)
            
            # Regex to match:
            # 1. Quote (single or double)
            # 2. Any path chars
            # 3. / (or start of string)
            # 4. old_name_no_ext
            # 5. Quote
            
            # Actually easier: just replace the string if it looks like an import part.
            # Let's try direct replacement of the base name. 
            # Note: TypeScript imports don't usually include .ts, but valid to check.
            
            content = content.replace(old_name_no_ext, new_name_no_ext)

        if content != original_content:
            print(f"Updating imports in {file_path}")
            with open(file_path, 'w') as f:
                f.write(content)

if __name__ == "__main__":
    main()
