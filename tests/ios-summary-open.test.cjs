const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const s=fs.readFileSync(require('node:path').join(__dirname,'../needs-finder.html'),'utf8');
test('M65 supersedes M64 iOS HTML preview with direct PDF download',()=>{assert.match(s,/\$\("dlBtn"\)\.onclick=function\(\)\{downloadSummaryPdf\(\)\}/);assert.doesNotMatch(s,/openSavedSummaryPreview/)});
test('direct PDF download works through browser save link',()=>{assert.match(s,/link\.download="life-cover-needs-summary\.pdf"/);assert.match(s,/link\.click\(\)/)});
test('three-sheet landscape export preserved',()=>{assert.match(s,/id="summaryPage"/);assert.match(s,/id="summaryAppendix"/);assert.match(s,/id="summaryDetail"/);assert.match(s,/@page\{size:A4 landscape;margin:8mm\}/)});
test('privacy allowlist unchanged',()=>{assert.match(s,/Explicit allowlist: never export future advisor-only UI/)});
