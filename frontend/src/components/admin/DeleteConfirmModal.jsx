import { AlertTriangle } from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title || 'Delete Item'}</h3>
        <p className="text-gray-400 mb-6">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
        <div className="flex items-center gap-3 justify-center">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal
