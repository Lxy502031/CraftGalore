const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Folder with your markdown product files (changed to 'product')
const productsDir = path.join(__dirname, 'product');

const products = [];

fs.readdirSync(productsDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(productsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    const { data, content } = matter(fileContents);

    // Combine frontmatter and content as needed
    products.push({
      ...data,
      content: content.trim(),
      slug: file.replace('.md', '')
    });
  }
});

// Write JSON output to a file (or use directly in your build)
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log('Products JSON created:', products.length);
