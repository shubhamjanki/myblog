const fs = require('fs');

// Fix NotFound.tsx
let c1 = fs.readFileSync('src/views/NotFound.tsx', 'utf8');
c1 = c1.replace('<a href="/"', '<Link href="/"');
c1 = c1.replace('</a>', '</Link>');
c1 = c1.replace('import { useEffect } from "react";', 'import { useEffect } from "react";\nimport Link from "next/link";');
fs.writeFileSync('src/views/NotFound.tsx', c1);

// Fix OpportunityDetailPage.tsx
let c2 = fs.readFileSync('src/views/OpportunityDetailPage.tsx', 'utf8');
c2 = c2.replace("Don't miss out!", "Don&apos;t miss out!");
fs.writeFileSync('src/views/OpportunityDetailPage.tsx', c2);

console.log('Fixed');
