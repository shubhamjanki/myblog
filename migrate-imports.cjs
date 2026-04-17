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

const replacements = [
  // Link, useParams, useNavigate
  [/import\s*{\s*Link\s*,\s*useParams\s*,\s*useNavigate\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import Link from "next/link";\nimport { useParams, useRouter } from "next/navigation";'],
  // useParams, Link, useNavigate
  [/import\s*{\s*useParams\s*,\s*Link\s*,\s*useNavigate\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import Link from "next/link";\nimport { useParams, useRouter } from "next/navigation";'],
  // Link, useNavigate
  [/import\s*{\s*Link\s*,\s*useNavigate\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import Link from "next/link";\nimport { useRouter } from "next/navigation";'],
  // Link, useParams
  [/import\s*{\s*Link\s*,\s*useParams\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import Link from "next/link";\nimport { useParams } from "next/navigation";'],
  // useNavigate, useParams
  [/import\s*{\s*useNavigate\s*,\s*useParams\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import { useParams, useRouter } from "next/navigation";'],
  // Link only
  [/import\s*{\s*Link\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import Link from "next/link";'],
  // useNavigate only
  [/import\s*{\s*useNavigate\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import { useRouter } from "next/navigation";'],
  // useParams only
  [/import\s*{\s*useParams\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import { useParams } from "next/navigation";'],
  // useLocation only
  [/import\s*{\s*useLocation\s*}\s*from\s*"react-router-dom"\s*;?/g, 
   'import { usePathname } from "next/navigation";'],
];

for (const f of srcFiles) {
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  
  for (const [pattern, replacement] of replacements) {
    c = c.replace(pattern, replacement);
  }
  
  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Updated imports:', f);
  }
}

console.log('Done!');
