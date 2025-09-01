import React from 'react';
import styles from './TechnologyStackHexGallery.module.scss';

const techImages = [
  'expo.png',
  'uniapp.png',
  'tailwindcss.png',
  'scss.png',
  'git.png',
  '鸿蒙.png',
  'wireshark.png',
  'Photoshop.png',
  'docker.png',
  '宝塔.png',
  'nginx.png',
  'Angular.png',
  'NextJS.png',
  'matlab.png',
  'webpack.png',
  'mongodb.png',
  'Mysql.png',
  'spring.png',
  'java.png',
  'python.png',
  'c语言.png',
  'redux.png',
  'React.png',
  'vite.png',
  'Vue.png',
  'Typescript.png',
  'js.png',
  'css.png',
  'html.png',
  'nodejs.png',
];

function chunk(arr: string[], size: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const HEX_PER_ROW = 6;

const TechnologyStackHexGallery: React.FC = () => {
  const rows = chunk(techImages, HEX_PER_ROW);
  return (
    <div className={styles.hexGalleryWrapper}>
      {rows.map((row, idx) => (
        <div className={`${styles.hexRow} ${idx % 2 === 1 ? styles.even : ''}`} key={idx}>
          {row.map(img => {
            const name = img.replace(/\.(png|jpg|jpeg|svg)$/i, '');
            return (
              <div className={styles.hexagonBox} key={img}>
                <img
                  className={styles.hexagonImg}
                  src={`/technologyStack/${img}`}
                  alt={name}
                  title={name}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TechnologyStackHexGallery; 