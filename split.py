import os
import re

html_path = r'd:\Tu Tiên\CuuThienTuTien_Modular\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Define the regions to extract
regions = {
    'combat': r'<!-- 1\. VIEW: TU LUYỆN \(Meditation Scene\) -->(.*?)<!-- 2\. VIEW: NHÂN VẬT -->',
    'char': r'<!-- 2\. VIEW: NHÂN VẬT -->(.*?)<!-- 3\. VIEW: ĐỘNG PHỦ -->',
    'dongphu': r'<!-- 3\. VIEW: ĐỘNG PHỦ -->(.*?)<!-- 4\. VIEW: LINH THÚ & TỌA KỴ -->',
    'companion': r'<!-- 4\. VIEW: LINH THÚ & TỌA KỴ -->(.*?)<!-- 5\. VIEW: TÚI ĐỒ -->',
    'inv': r'<!-- 5\. VIEW: TÚI ĐỒ -->(.*?)<!-- 6\. VIEW: CỬA HÀNG -->',
    'shop': r'<!-- 6\. VIEW: CỬA HÀNG -->(.*?)<!-- 8\. VIEW: BẢN ĐỒ & LEO THÁP -->',
    'map': r'<!-- 8\. VIEW: BẢN ĐỒ & LEO THÁP -->(.*?)</div>\s*</div>\s*<div class="h-24',
    'modal_meditate': r'<!-- Đột Phá Modal -->(.*?)<!-- Admin Modal -->',
    'modal_admin': r'<!-- Admin Modal -->(.*?)<div id="custom-dialog-overlay"',
    'modal_dialog': r'<div id="custom-dialog-overlay"(.*?)</div>\s*</div>\s*</div>\s*<script'
}

views_dir = r'd:\Tu Tiên\CuuThienTuTien_Modular\js\views'
os.makedirs(views_dir, exist_ok=True)

extracted_html = {}
for name, pattern in regions.items():
    match = re.search(pattern, html, re.DOTALL)
    if match:
        content = match.group(1).strip()
        if name == 'modal_dialog':
            content = '<div id="custom-dialog-overlay"' + match.group(1)
            # Find the last </div> before <script
            content = content.rsplit('</div>', 2)[0]
        extracted_html[name] = content
        
        # Write to js file safely escaping backticks and ${
        safe_content = content.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        js_content = f'const TPL_{name.upper()} = `{safe_content}`;\n'
        with open(os.path.join(views_dir, f'{name}.js'), 'w', encoding='utf-8') as jf:
            jf.write(js_content)
    else:
        print(f'Failed to match {name}')

# Now replace the regions in HTML with empty containers
# Find the start of views and end of views
views_start_match = re.search(r'<div class="absolute inset-0 smooth-scroll" id="main-scroll-area">', html)
views_end_match = re.search(r'</div>\s*</div>\s*<div class="h-24', html)

if views_start_match and views_end_match:
    views_start = views_start_match.end()
    views_end = views_end_match.start()
    new_html = html[:views_start] + '\n                <div id="views-container"></div>\n            ' + html[views_end:]
    
    modals_start_match = re.search(r'<!-- Đột Phá Modal -->', new_html)
    modals_end_match = re.search(r'</div>\s*</div>\s*</div>\s*<script', new_html)
    
    if modals_start_match and modals_end_match:
        modals_start = modals_start_match.start()
        modals_end = modals_end_match.start() + 18
        
        new_html = new_html[:modals_start] + '<div id="modals-container"></div>\n    ' + new_html[modals_end:]
        
        # Insert the script tags
        scripts_idx = new_html.find('<script src="js/audio.js">')
        script_tags = '\n'.join([f'    <script src="js/views/{name}.js"></script>' for name in regions.keys()])
        script_tags += '\n    <script>\n'
        script_tags += '        document.addEventListener("DOMContentLoaded", () => {\n'
        script_tags += '            document.getElementById("views-container").innerHTML = TPL_COMBAT + TPL_CHAR + TPL_DONGPHU + TPL_COMPANION + TPL_INV + TPL_SHOP + TPL_MAP;\n'
        script_tags += '            document.getElementById("modals-container").innerHTML = TPL_MODAL_MEDITATE + TPL_MODAL_ADMIN + TPL_MODAL_DIALOG;\n'
        
        script_tags += '        });\n'
        script_tags += '    </script>\n    '
        
        new_html = new_html[:scripts_idx] + script_tags + new_html[scripts_idx:]
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print('Successfully split HTML.')
    else:
        print('Failed to find modals boundaries.')
else:
    print('Failed to find views boundaries.')
