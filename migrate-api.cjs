const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) files.push(...walk(fp));
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) files.push(fp);
  }
  return files;
}

const srcFiles = walk('src');

for (const f of srcFiles) {
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;

  // Replace useNavigate() calls with useRouter()
  c = c.replace(/const\s+navigate\s*=\s*useNavigate\s*\(\s*\)\s*;?/g, 'const router = useRouter();');
  
  // Replace navigate(...) calls with router.push(...)
  // But be careful not to replace when it's inside a string or when it's useNavigate
  c = c.replace(/navigate\s*\(\s*"/g, 'router.push("');
  c = c.replace(/navigate\s*\(\s*`/g, 'router.push(`');
  c = c.replace(/navigate\s*\(\s*'/g, "router.push('");
  // Handle navigate(-1) for back
  c = c.replace(/navigate\s*\(\s*-1\s*\)/g, 'router.back()');
  
  // Replace useLocation patterns
  c = c.replace(/const\s*{\s*pathname\s*}\s*=\s*useLocation\s*\(\s*\)\s*;?/g, 'const pathname = usePathname();');
  c = c.replace(/const\s+location\s*=\s*useLocation\s*\(\s*\)\s*;?/g, 'const pathname = usePathname();');
  // Replace location.pathname with pathname (but not window.location.pathname)
  c = c.replace(/(?<!window\.)location\.pathname/g, 'pathname');
  
  // Replace { slug } = useParams() - in Next.js it returns the params object  
  // This pattern stays the same, useParams() works similarly

  // Add "use client" if it uses hooks and doesn't have it yet
  const needsClient = /\b(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRouter|useParams|usePathname|useAuth|useCms|useTheme)\b/.test(c);
  if (needsClient && !c.startsWith('"use client"') && !c.startsWith("'use client'")) {
    c = '"use client";\n\n' + c;
  }
  
  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Updated API:', f);
  }
}

console.log('Done!');
