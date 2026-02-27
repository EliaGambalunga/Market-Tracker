import React from 'react';
import { X, BellRing } from 'lucide-react';
import './AlertToast.css';

function AlertToast({ toast, onClose }) {
    if (!toast) return null;

    const { title, message, icon: Icon, time } = toast;

    return (
        <div className="alert-toast glass-effect slide-in">
            <div className="toast-icon-wrap">
                {Icon ? <Icon size={24} className="toast-icon pulse" /> : <BellRing size={24} className="toast-icon pulse" />}
            </div>
            <div className="toast-content">
                <div className="toast-header">
                    <strong className="toast-title">{title}</strong>
                    <span className="toast-time">{time}</span>
                    <button className="toast-close" onClick={onClose} title="Dismiss">
                        <X size={16} />
                    </button>
                </div>
                <p className="toast-message">{message}</p>
            </div>
        </div>
    );
}

export default AlertToast;
