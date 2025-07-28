import React, { createContext, useContext, useState, ReactNode } from 'react';
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';

type TipType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface TipState {
    open: boolean;
    message: string;
    type: TipType;
}

interface GlobalTipContextType {
    showTip: (message: string, type?: TipType) => void;
}

const GlobalTipContext = createContext<GlobalTipContextType | undefined>(undefined)


export const GlobalTipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tip, setTip] = useState<TipState>({ open: false, message: '', type: 'info'})

    const showTip = (message: string, type: TipType = 'info') => {
        setTip({ open: true, message, type });
    };

    const handleClose = () => setTip(t => ({ ...t, open: false }));

    return (
        <GlobalTipContext.Provider value={{ showTip }}>
            {children}
            <OperationTipModal
                open={tip.open}
                onClose={handleClose}
                message={tip.message}
                type={tip.type}
                autoClose
                autoCloseDelay={2000}
                position="center"
            />
        </GlobalTipContext.Provider>
    );
};

export default GlobalTipContext;