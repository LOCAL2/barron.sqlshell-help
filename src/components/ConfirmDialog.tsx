import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div className="dialog-title">
            {isDangerous && <AlertTriangle size={24} color="#ef4444" />}
            <h3>{title}</h3>
          </div>
          <button className="dialog-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="dialog-body">
          <p>{message}</p>
        </div>

        <div className="dialog-footer">
          <button className="btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={isDangerous ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
