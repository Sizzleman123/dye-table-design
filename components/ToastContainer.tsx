'use client';
import { useTableStore } from '@/store/tableStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useTableStore();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast-enter flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium pointer-events-auto cursor-pointer"
          style={{
            background: toast.type === 'success'
              ? 'linear-gradient(135deg, #065f46, #047857)'
              : 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          onClick={() => removeToast(toast.id)}
        >
          <span>{toast.type === 'success' ? '✓' : 'ℹ'}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
