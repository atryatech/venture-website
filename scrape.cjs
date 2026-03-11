const fs = require('fs');
const path = require('path');

const urls = [
    'https://venture.com.br/',
    'https://venture.com.br/#contatos',
    'https://venture.com.br/#parceiros',
    'https://venture.com.br/publicacoes/',
    'https://venture.com.br/category/cases/',
    'https://venture.com.br/servicos/',
    'https://venture.com.br/#empresa'
];

async function scrape() {
    for (const url of urls) {
        try {
            console.log(`Scraping: ${url}`);
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
                }
            });
            if (!res.ok) {
                console.error(`Status ${res.status} for ${url}`);
                continue;
            }
            const html = await res.text();
            
            // Basic text extraction
            let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '\n');
            text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '\n');
            text = text.replace(/<[^>]+>/g, '\n'); // remove html tags
            text = text.replace(/\n\s+\n/g, '\n\n'); // remove multiple empty lines
            
            const name = url.replace(/[^a-z0-9]/gi, '_');
            const targetPath = path.join(__dirname, 'webscrap', `${name}.txt`);
            
            if (!fs.existsSync(path.join(__dirname, 'webscrap'))) {
              fs.mkdirSync(path.join(__dirname, 'webscrap'), { recursive: true });
            }

            fs.writeFileSync(targetPath, text);
            console.log(`Saved ${targetPath}`);
        } catch(e) {
            console.error(e);
        }
    }
}

scrape();
