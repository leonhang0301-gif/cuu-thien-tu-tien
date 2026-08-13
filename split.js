const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const viewsDir = path.join(__dirname, 'js', 'views');

if (!fs.existsSync(viewsDir)) {
    fs.mkdirSync(viewsDir, { recursive: true });
}

let html = fs.readFileSync(htmlPath, 'utf8');

const regions = {
    'combat': /<!-- 1\. VIEW: TU LUYỆN \(Meditation Scene\) -->([\s\S]*?)<!-- 2\. VIEW: NHÂN VẬT -->/,
    'char': /<!-- 2\. VIEW: NHÂN VẬT -->([\s\S]*?)<!-- 3\. VIEW: ĐỘNG PHỦ -->/,
    'dongphu': /<!-- 3\. VIEW: ĐỘNG PHỦ -->([\s\S]*?)<!-- 4\. VIEW: LINH THÚ & TỌA KỴ -->/,
    'companion': /<!-- 4\. VIEW: LINH THÚ & TỌA KỴ -->([\s\S]*?)<!-- 5\. VIEW: TÚI ĐỒ -->/,
    'inv': /<!-- 5\. VIEW: TÚI ĐỒ -->([\s\S]*?)<!-- 6\. VIEW: CỬA HÀNG -->/,
    'shop': /<!-- 6\. VIEW: CỬA HÀNG -->([\s\S]*?)<!-- 8\. VIEW: BẢN ĐỒ & LEO THÁP -->/,
    'map': /<!-- 8\. VIEW: BẢN ĐỒ & LEO THÁP -->([\s\S]*?)<\/div>\s*<\/div>\s*<div class="h-24/,
    'modal_meditate': /<!-- Đột Phá Modal -->([\s\S]*?)<!-- Admin Modal -->/,
    'modal_admin': /<!-- Admin Modal -->([\s\S]*?)<div id="custom-dialog-overlay"/,
    'modal_dialog': /<div id="custom-dialog-overlay"([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<script/
};

for (const [name, pattern] of Object.entries(regions)) {
    const match = html.match(pattern);
    if (match) {
        let content = match[1].trim();
        if (name === 'modal_dialog') {
            content = '<div id="custom-dialog-overlay"' + match[1];
            content = content.substring(0, content.lastIndexOf('</div>', content.lastIndexOf('</div>') - 1)); 
            // the regex matches up to </script, so there are 3 closing divs of the mobile-container and body that we don't want.
            // Actually let's just make it simpler:
            const lastDiv = content.lastIndexOf('</div>');
            content = content.substring(0, lastDiv + 6);
        }
        
        let safeContent = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
        let jsContent = `const TPL_${name.toUpperCase()} = \`${safeContent}\`;\n`;
        fs.writeFileSync(path.join(viewsDir, `${name}.js`), jsContent, 'utf8');
        console.log(`Saved ${name}.js`);
    } else {
        console.log(`Failed to match ${name}`);
    }
}

// Now replace in HTML
const viewsStartMatch = html.match(/<div class="absolute inset-0 smooth-scroll" id="main-scroll-area">/);
const viewsEndMatch = html.match(/<\/div>\s*<\/div>\s*<div class="h-24/);

if (viewsStartMatch && viewsEndMatch) {
    const viewsStart = viewsStartMatch.index + viewsStartMatch[0].length;
    const viewsEnd = viewsEndMatch.index;
    
    let newHtml = html.substring(0, viewsStart) + '\n                <div id="views-container"></div>\n            ' + html.substring(viewsEnd);
    
    const modalsStartMatch = newHtml.match(/<!-- Đột Phá Modal -->/);
    const modalsEndMatch = newHtml.match(/<\/div>\s*<\/div>\s*<\/div>\s*<script/);
    
    if (modalsStartMatch && modalsEndMatch) {
        const modalsStart = modalsStartMatch.index;
        const modalsEnd = modalsEndMatch.index + 18; // length of '</div>\n    </div>\n</div>' roughly, wait, it's safer to just replace everything before `<script`
        
        // Actually, just find `<script src="js/audio.js">`
        const scriptIdx = newHtml.indexOf('<script src="js/audio.js">');
        
        // So the modals are from `modalsStart` to `scriptIdx` minus the closing divs of main containers.
        // Wait, the end of modal_dialog was matched up to `<script`.
        // Let's just find the exact string to replace.
        const beforeModals = newHtml.substring(0, modalsStart);
        // The closing divs of the mobile container:
        const afterModals = `\n    </div>\n\n    <!-- Scripts -->\n    `;
        
        let scriptTags = Object.keys(regions).map(name => `<script src="js/views/${name}.js"></script>`).join('\n    ');
        scriptTags += `\n    <script>\n`;
        scriptTags += `        document.addEventListener("DOMContentLoaded", () => {\n`;
        scriptTags += `            const viewsHtml = TPL_COMBAT + TPL_CHAR + TPL_DONGPHU + TPL_COMPANION + TPL_INV + TPL_SHOP + TPL_MAP;\n`;
        scriptTags += `            document.getElementById("views-container").innerHTML = viewsHtml;\n`;
        scriptTags += `            const modalsHtml = TPL_MODAL_MEDITATE + TPL_MODAL_ADMIN + TPL_MODAL_DIALOG;\n`;
        scriptTags += `            // Append modals to mobile-container or body\n`;
        scriptTags += `            const modalsContainer = document.createElement('div');\n`;
        scriptTags += `            modalsContainer.id = 'modals-container';\n`;
        scriptTags += `            modalsContainer.innerHTML = modalsHtml;\n`;
        scriptTags += `            document.querySelector('.mobile-container').appendChild(modalsContainer);\n`;
        scriptTags += `        });\n`;
        scriptTags += `    </script>\n    `;
        
        const finalHtml = beforeModals + scriptTags + newHtml.substring(scriptIdx);
        
        fs.writeFileSync(htmlPath, finalHtml, 'utf8');
        console.log('Successfully split HTML.');
    } else {
        console.log('Failed to find modals boundaries');
    }
} else {
    console.log('Failed to find views boundaries');
}
