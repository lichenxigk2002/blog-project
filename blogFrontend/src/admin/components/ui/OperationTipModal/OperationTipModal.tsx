import React from 'react';
import Modal from '../Modal/Modal'

interface OperationTipModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
    type?: 'success' | 'failure' | 'info' | 'warning';
    width?: number;
    iconSize?: number;
}

const iconMap: Record<string, string> = {
    success: '/images/success.png',
    failure: '/images/failure.png',
    info: '/images/info.png',      // 可自定义
    warning: '/images/warning.png' // 可自定义
};

const OperationTipModal: React.FC<OperationTipModalProps> = ({open, onClose, message, type = 'success', width = 300, iconSize = 100}) => {
    return (
        <Modal open={open} onClose={onClose} width={width}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <img
                    src={iconMap[type] || iconMap.success}
                    alt={type}
                    style={{ width: iconSize, height: iconSize, marginBottom: 18 }}
                />
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontFamily: "'Comic Sans MS', 'PingFang SC', 'Arial', sans-serif",
                        color: '#a259ff',
                        fontWeight: 700,
                        letterSpacing: 1,
                        marginTop: 4
                    }}
                >
                    {message}
                </div>
            </div>
        </Modal>
    );
};

export default OperationTipModal;