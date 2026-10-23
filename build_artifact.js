// Builds the Claude artifact copy of index.html: strips the document wrapper and the PWA-only head lines.
const fs = require('fs');
const [, , out] = process.argv;
const h = fs.readFileSync(__dirname + '/index.html', 'utf8');
const a = h.replace(/<!--PWA-->[\s\S]*?<!--\/PWA-->\n/, '')
  .replace(/^<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n/, '')
  .replace('</head>\n<body>\n', '').replace(/<\/body>\n<\/html>\n?$/, '');
fs.writeFileSync(out, a);
