const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 压缩图片的脚本
async function compressImages() {
  const inputDir = './public/images'; // 输入目录
  const outputDir = './public/images/compressed'; // 输出目录

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const files = fs.readdirSync(inputDir);

    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

        console.log(`压缩: ${file}`);

        await sharp(inputPath)
          .webp({ quality: 80 }) // 转换为 WebP，质量 80%
          .toFile(outputPath);

        console.log(`完成: ${file} -> ${path.basename(outputPath)}`);
      }
    }

    console.log('所有图片压缩完成！');
  } catch (error) {
    console.error('压缩失败:', error);
  }
}

compressImages(); 