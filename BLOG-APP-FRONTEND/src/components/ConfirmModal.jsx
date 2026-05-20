import React from 'react';
import { primaryBtn, secondaryBtn, headingClass, bodyText } from '../styles/common';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "primary" }) => {
  if (!isOpen) return null;

  const confirmBtnClass = type === "danger" 
    ? "bg-[#ff3b30] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#ff453a] transition-all" 
    : primaryBtn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
        <h3 className={headingClass + " mb-2"}>{title}</h3>
        <p className={bodyText + " mb-8"}>{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel} 
            className={secondaryBtn + " !px-6"}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={confirmBtnClass}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
