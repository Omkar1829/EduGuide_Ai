import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, Check, Sparkles, Shield, Star, Crown, 
  CreditCard, Smartphone, ShieldCheck, ArrowLeft, Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { setUser } from '../../store/slices/authSlice';
import Spinner from './Spinner';

const PricingModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [paymentScreenTier, setPaymentScreenTier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'NEWBIE',
      name: 'Newbie',
      price: 'Free',
      period: '',
      description: 'Perfect for getting started and exploring career possibilities.',
      icon: <Shield className="w-6 h-6 text-gray-400" />,
      color: 'border-white/10 bg-white/5 text-gray-300',
      buttonText: 'Current Plan',
      features: [
        '5 Free AI Counselor chats daily',
        'Basic career path guidance',
        'Profile completion assessment',
        'Search verified course listings',
        'Search active job postings',
      ],
      disabled: true,
    },
    {
      id: 'PRO',
      name: 'Pro Career',
      price: '₹299',
      numericPrice: 299,
      period: '/ month',
      gst: '+ 18% GST',
      description: 'For active students looking to upgrade their skills and domain knowledge.',
      icon: <Star className="w-6 h-6 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-500/5 text-white ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/5',
      buttonText: 'Upgrade to Pro',
      features: [
        '20 Free AI Counselor chats daily',
        'AI Personalized Knowledge Center',
        'Industry specific news matching profile',
        'Access to standard AI assessments',
        'Save and track unlimited jobs/courses',
      ],
      disabled: user?.subscriptionTier === 'PRO' || user?.subscriptionTier === 'PRO_PLUS',
    },
    {
      id: 'PRO_PLUS',
      name: 'Pro Plus',
      price: '₹699',
      numericPrice: 699,
      period: '/ month',
      gst: '+ 18% GST',
      description: 'The ultimate tier for maximum career support, interview prep, and direct guidance.',
      icon: <Crown className="w-6 h-6 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />,
      color: 'border-amber-500/30 bg-amber-500/5 text-white ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/5',
      buttonText: 'Upgrade to Pro+',
      features: [
        '50 Free AI Counselor chats daily',
        'Premium AI Resume Builder (Custom matches)',
        'Unlimited AI Career Roadmap generations',
        'Preloaded premium interactive quizzes',
        'Limited Career Counseling call support',
      ],
      disabled: user?.subscriptionTier === 'PRO_PLUS',
    },
  ];

  const handleUpgrade = async () => {
    if (!paymentScreenTier) return;
    setLoading(true);
    try {
      const response = await api.put('/auth/subscription', { tier: paymentScreenTier.id });
      if (response.success) {
        dispatch(setUser(response.data));
        toast.success(`Success! Upgraded to ${paymentScreenTier.name} successfully!`);
        setPaymentScreenTier(null);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  const getPriceDetails = () => {
    if (!paymentScreenTier) return { base: 0, gst: 0, total: 0 };
    const base = paymentScreenTier.numericPrice;
    const gst = Math.round(base * 0.18 * 100) / 100;
    const total = Math.round((base + gst) * 100) / 100;
    return { base, gst, total };
  };

  const { base, gst, total } = getPriceDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl glass border border-white/10 rounded-3xl shadow-glass overflow-hidden bg-gray-900/90 backdrop-blur-2xl animate-scale-in max-h-[90vh] flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            {paymentScreenTier ? (
              <button 
                onClick={() => setPaymentScreenTier(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {paymentScreenTier ? 'Secure Checkout' : 'Upgrade Membership'}
              </h2>
              <p className="text-xs text-gray-400">
                {paymentScreenTier 
                  ? 'Complete your payment securely using Stripe or Razorpay.' 
                  : 'Supercharge your learning & job search with AI premium features.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 scrollbar-thin">
          {paymentScreenTier ? (
            /* PAYMENT CHECKOUT PORTAL SCREEN */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
              
              {/* Left Column: Summary & Payment Methods */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass border border-white/10 rounded-2xl p-5 space-y-4 bg-slate-900/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Select Payment Method</h3>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                          : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-xs font-semibold">Stripe Checkout</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'upi' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                          : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs font-semibold">Razorpay UPI / QR</span>
                    </button>
                  </div>
                </div>

                {/* Form fields depending on payment method */}
                {paymentMethod === 'card' ? (
                  /* Stripe Mock Form */
                  <div className="glass border border-white/10 rounded-2xl p-6 space-y-4 bg-slate-900/40">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" />
                        Card Details (Stripe Secured)
                      </h3>
                      <span className="text-[10px] text-gray-500 font-semibold">TEST MODE</span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Cardholder Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Omkar Kale'}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="4242 4242 4242 4242"
                            maxLength="19"
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                          />
                          <CreditCard className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Expiration</label>
                          <input 
                            type="text" 
                            placeholder="12/28" 
                            maxLength="5"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">CVC</label>
                          <input 
                            type="password" 
                            placeholder="•••" 
                            maxLength="3"
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Razorpay QR Code Simulation */
                  <div className="glass border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 bg-slate-900/40">
                    <div className="flex items-center justify-between w-full pb-2 border-b border-white/5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                        UPI Instant Payment (Razorpay)
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">ACTIVE QR</span>
                    </div>

                    {/* QR Code Container Mock */}
                    <div className="p-3 bg-white rounded-2xl border-4 border-slate-700 shadow-xl relative mt-2 group">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=egaidb@razorpay%26pn=EduGuideAI%26am=${total}%26cu=INR`} 
                        alt="Razorpay UPI QR Code" 
                        className="w-36 h-36"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 max-w-xs leading-normal">
                      Scan this secure QR code using any UPI app (GPay, PhonePe, Paytm, or BHIM) to execute payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 glass border border-white/10 rounded-2xl p-6 bg-slate-900/30 space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-3">Order Summary</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>{paymentScreenTier.name} Plan</span>
                    <span className="text-white font-medium">₹{base}.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-400">
                    <span>GST (18% Accrued)</span>
                    <span className="text-white font-medium">₹{gst}</span>
                  </div>

                  <div className="h-px bg-white/10 my-2" />

                  <div className="flex justify-between items-baseline">
                    <span className="text-white font-bold">Total Amount Due</span>
                    <span className="text-xl font-black text-indigo-400">₹{total}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-2.5 text-xs text-gray-400 leading-normal">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>256-Bit SSL Secure Connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Instant activation of premium features</span>
                  </div>
                </div>

                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      Authorizing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Complete Secure Payment (₹{total})
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            /* STANDARD PLANS TIER SELECTION SCREEN */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier) => {
                const isCurrent = user?.subscriptionTier === tier.id;
                return (
                  <div 
                    key={tier.id}
                    className={`flex flex-col h-full rounded-2xl border p-5 md:p-6 transition-all duration-300 ${tier.color} relative overflow-hidden`}
                  >
                    {/* Popular Badge */}
                    {tier.id === 'PRO' && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        Popular
                      </div>
                    )}
                    {tier.id === 'PRO_PLUS' && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        Premium
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex items-center gap-2 mb-4">
                      {tier.icon}
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    </div>

                    <p className="text-xs text-gray-400 mb-4 h-12 overflow-hidden">{tier.description}</p>

                    {/* Price */}
                    <div className="mb-6 flex flex-col">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                        <span className="text-gray-500 text-sm ml-1">{tier.period}</span>
                      </div>
                      {tier.gst && <span className="text-[10px] text-gray-500 mt-0.5 font-medium">{tier.gst}</span>}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      disabled={tier.disabled || isCurrent}
                      onClick={() => setPaymentScreenTier(tier)}
                      className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-6 ${
                        isCurrent 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : tier.id === 'NEWBIE'
                            ? 'bg-white/5 text-gray-400 border border-white/5 cursor-not-allowed'
                            : tier.id === 'PRO_PLUS'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : (tier.id === 'NEWBIE' ? 'Basic Plan' : tier.buttonText)}
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mb-6" />

                    {/* Features List */}
                    <ul className="space-y-3 flex-1">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
