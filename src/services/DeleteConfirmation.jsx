import React from 'react';

const DeleteConfirmation = ({ productName, onConfirm, onCancel }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <p>Yakin ingin menghapus {productName} dari keranjang?</p>
        <div className="confirmation-buttons">
          <button 
            className="confirm-button"
            onClick={onConfirm}
          >
            Ya, Hapus
          </button>
          <button 
            className="cancel-button"
            onClick={onCancel}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;