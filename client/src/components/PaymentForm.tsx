import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Payment failed');
      toast.error(error.message || 'Payment failed');
    } else {
      toast.success('Payment successful!');
      onSuccess();
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
      >
        {processing ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
}
