const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/nvs/monihari/src/app/api');

let changedFiles = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Remove import
    content = content.replace(/import\s+\{\s*getTenant\s*\}\s+from\s+['"]@\/lib\/database\/tenant['"];?\n?/g, '');

    // Remove website checking block (various forms)
    content = content.replace(/[ \t]*const\s+website\s*=\s*await\s+getTenant\([^)]*\);?\s*if\s*\(!website\)\s*\{\s*return\s+NextResponse\.json\(\{[^}]+\},\s*\{\s*status:\s*404\s*\}\);\s*\}\s*(const\s+tenant_id\s*=\s*website\.tenant_id;?)?\s*/g, '');
    
    content = content.replace(/[ \t]*const\s+website\s*=\s*await\s+getTenant\([^)]*\);?\s*if\s*\(!website\)\s*\{\s*return\s+NextResponse\.json\([^)]+\)\s*\}\s*(const\s+tenant_id\s*=\s*website\.tenant_id;?)?\s*/g, '');

    // Also just standalone tenant_id declarations if they were separated
    content = content.replace(/[ \t]*const\s+tenant_id\s*=\s*website\.tenant_id;?\s*/g, '');

    // Replace SQL parts
    // AND tenant_id = $X
    content = content.replace(/\s*AND\s+tenant_id\s*=\s*\$\d+/g, '');
    // WHERE tenant_id = $X AND -> WHERE 
    content = content.replace(/WHERE\s+tenant_id\s*=\s*\$\d+\s+AND\s+/g, 'WHERE ');
    // WHERE tenant_id = $X -> [remove WHERE if nothing else, but usually it's better to just leave WHERE 1=1 or similar. Let's just remove `tenant_id = $X`]
    // Actually, if it's WHERE tenant_id = $1, and it's the only condition, we can replace `WHERE tenant_id = \$\d+` with ``.
    // We have to be careful with ORDER BY or other clauses following it.
    content = content.replace(/WHERE\s+tenant_id\s*=\s*\$\d+(?=\s*(ORDER|LIMIT|OFFSET|GROUP|$|`|"))/g, '');

    // INSERT INTO (... tenant_id) VALUES (... $X)
    content = content.replace(/,\s*tenant_id/g, '');
    
    // Arrays with tenant_id: [var1, var2, tenant_id]
    content = content.replace(/,\s*tenant_id\s*\]/g, ']');
    content = content.replace(/\[\s*tenant_id\s*,\s*/g, '[');
    content = content.replace(/\[\s*tenant_id\s*\]/g, '[]');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log("Updated: " + file);
    }
}

console.log(`Updated ${changedFiles} files.`);
