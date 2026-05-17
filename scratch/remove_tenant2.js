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

    // Remove `AND [alias].tenant_id = [alias].tenant_id`
    content = content.replace(/\s+AND\s+[a-zA-Z0-9_]+\.tenant_id\s*=\s*[a-zA-Z0-9_]+\.tenant_id/g, '');
    
    // Remove `AND [alias].tenant_id = $[0-9]+`
    content = content.replace(/\s+AND\s+[a-zA-Z0-9_]+\.tenant_id\s*=\s*\$[0-9]+/g, '');

    // Remove `[alias].tenant_id = $[0-9]+ AND `
    content = content.replace(/[a-zA-Z0-9_]+\.tenant_id\s*=\s*\$[0-9]+\s+AND\s+/g, '');

    // Remove `WHERE tenant_id = $[0-9]+`
    // If it is just WHERE tenant_id = $X followed by ) or end of string, remove WHERE too.
    content = content.replace(/WHERE\s+tenant_id\s*=\s*\$[0-9]+\s*\)/g, ')');
    content = content.replace(/WHERE\s+tenant_id\s*=\s*\$[0-9]+\s*(ORDER|GROUP|LIMIT|OFFSET|;|$|`|")/gi, ' $1');

    // Same for alias.tenant_id
    content = content.replace(/WHERE\s+[a-zA-Z0-9_]+\.tenant_id\s*=\s*\$[0-9]+\s*\)/g, ')');
    content = content.replace(/WHERE\s+[a-zA-Z0-9_]+\.tenant_id\s*=\s*\$[0-9]+\s*(ORDER|GROUP|LIMIT|OFFSET|;|$|`|")/gi, ' $1');

    // Parameters with tenant_id (remnants)
    // There are places where we pass tenant_id as a parameter but now it's undefined. We need to check if there are lingering tenant_id variables.
    // Also, if `$2` or `$3` is removed from query, the parameter array needs to be adjusted, but that might be tricky if we don't adjust the whole array.
    // However, if we just removed `AND tenant_id = $X`, the query will have e.g. `$1` and `$3`. The PG driver might complain if parameter count mismatches.
    // Actually, it's safer to remove `tenant_id` from the array. The user said:
    // "stripping getTenant() logic from all backend API routes, and refactoring SQL queries to function without tenant-based filtering"
    // Let's just do text replacements for now and we will fix parameter errors manually if they occur.

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log("Updated: " + file);
    }
}

console.log(`Updated ${changedFiles} files.`);
