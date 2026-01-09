import { AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const CartMismatchModal = () => {
    const {
        isMismatchModalOpen,
        handleConfirmMismatch,
        handleCancelMismatch,
        mismatchData
    } = useCart();

    if (!isMismatchModalOpen) return null;

    const footer = (
        <>
            <Button
                onClick={handleConfirmMismatch}
                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
            >
                Replace Cart Items
            </Button>
            <Button
                variant="secondary"
                onClick={handleCancelMismatch}
            >
                Cancel
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isMismatchModalOpen}
            onClose={handleCancelMismatch}
            title="Replace Cart Items?"
            footer={footer}
        >
            <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <p className="text-gray-600 leading-relaxed">
                        Your cart contains items from
                        <span className="font-bold text-gray-900 mx-1">
                            {/* Assuming the first item in cart defines the restaurant */}
                            another restaurant
                        </span>.
                        Do you want to clear your current cart and add
                        <span className="font-bold text-gray-900 mx-1">
                            {mismatchData?.name}
                        </span>
                        instead?
                    </p>
                    <p className="text-sm text-gray-500 mt-2 italic">
                        * This action cannot be undone.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default CartMismatchModal;
