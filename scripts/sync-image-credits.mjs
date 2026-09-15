import fs from "node:fs";
const files=fs.readdirSync("lib").filter(x=>/^lesson-images.*\.ts$/.test(x));
const names=new Set();
for(const file of files){const source=fs.readFileSync(`lib/${file}`,"utf8");for(const m of source.matchAll(/(?:u\("https:\/\/upload\.wikimedia\.org\/[^\"]+\/([^\/\"?]+)|c\("([^"]+)")/g)){try{names.add(decodeURIComponent(m[1]||m[2]))}catch{names.add(m[1]||m[2])}}}
const strip=(s="")=>s.replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g," ").trim();
const out={checkedAt:new Date().toISOString().slice(0,10),files:{}};
const list=[...names];
for(let i=0;i<list.length;i+=25){const titles=list.slice(i,i+25).map(x=>`File:${x}`).join("|");const url=new URL("https://commons.wikimedia.org/w/api.php");for(const [k,v] of Object.entries({action:"query",format:"json",formatversion:"2",prop:"imageinfo",iiprop:"url|extmetadata",iiurlwidth:"960",titles}))url.searchParams.set(k,v);const json=await fetch(url,{headers:{"User-Agent":"History-Ebook/1.0 image-credit-sync"}}).then(r=>{if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json()});for(const page of json.query?.pages??[]){const info=page.imageinfo?.[0],meta=info?.extmetadata??{};const name=page.title?.replace(/^File:/,"");if(!name||!info)continue;out.files[name]={artist:strip(meta.Artist?.value)||"저작자 정보 없음",license:strip(meta.LicenseShortName?.value)||"라이선스 정보 없음",licenseUrl:meta.LicenseUrl?.value||null,sourceUrl:info.descriptionurl,originalUrl:info.url};}}
fs.writeFileSync("content/image-credits.json",JSON.stringify(out,null,2)+"\n");console.log(`${Object.keys(out.files).length}/${names.size} image credits saved`);
