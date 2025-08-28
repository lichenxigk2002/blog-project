import Head from 'next/head';
import Navbar from "@/client/components/Navbar/Navbar";
import Background from "@/components/Background/Background";
import Footer from "@/client/components/Footer/Footer";
import React from "react";
import { useTheme } from '@/hooks/useTheme';
import AppLayoutProps from './types';
import ClickSpark from "@/components/ClickSpark/ClickSpark";

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { isDarkMode } = useTheme();
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Background />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'relative'
            }}>
                <Navbar />
                <main
                    className={`container mx-auto relative ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
                    style={{
                        marginTop: '60px',
                        paddingBottom: '60px',
                        flex: '1 0 auto',
                        position: 'relative',
                        zIndex: 1
                    }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        {children}
                    </div>
                </main>
                <div style={{ flexShrink: 0, zIndex: 2 }}>
                    <Footer />
                </div>
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 3,
                    pointerEvents: 'none',
                    height: '100vh'
                }}>
                    <ClickSpark />
                </div>
            </div>
        </>
    );
}

export default AppLayout;