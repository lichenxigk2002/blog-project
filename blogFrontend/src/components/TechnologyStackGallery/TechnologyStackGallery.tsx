import React from 'react';

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
];

const TechnologyStackGallery: React.FC = () => {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center', padding: '2rem 0'
    }}>
      {techImages.map((img) => {
        const name = img.replace(/\.(png|jpg|jpeg|svg)$/i, '');
        return (
          <div key={img} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 90 }}>
            <img
              src={`/technologyStack/${img}`}
              alt={name}
              title={name}
              style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 8, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            />
            <span style={{ fontSize: 14, color: '#555', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TechnologyStackGallery; 