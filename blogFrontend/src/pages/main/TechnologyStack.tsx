import React from 'react';
import Head from 'next/head';
import TechnologyStackHexGallery from '@/components/TechnologyStackGallery/TechnologyStackHexGallery';

const TechnologyStackPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>技术栈展示</title>
      </Head>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>技术栈展示</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 40 }}>
          这里展示了本站常用的开发技术与工具。
        </p>
        <TechnologyStackHexGallery />
      </div>
    </>
  );
};

export default TechnologyStackPage; 