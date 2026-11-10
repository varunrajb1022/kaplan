import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import products from './data/products'
import { useCart } from './context/CartContext'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const PAYMENTS_DISABLED = true
const PAYMENTS_DISABLED_MESSAGE = 'Payments are coming soon. Add Razorpay API credentials to enable secure checkout.'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failure" element={<PaymentFailurePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function StethoscopeLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-label="Kaplan1 logo" role="img">
      <circle cx="32" cy="20" r="14" fill="none" stroke="#0f4b3f" strokeWidth="3.5" />
      <path d="M18 19c0-9 6-15 14-15s14 6 14 15" fill="none" stroke="#0f4b3f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 34v16" stroke="#0f4b3f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M18 34c0 6 6 10 14 10s14-4 14-10" fill="none" stroke="#0f4b3f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M20 48a8 8 0 1 0 16 0" fill="none" stroke="#f4d56c" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 48a8 8 0 1 0 16 0" transform="translate(-18 0)" fill="none" stroke="#f4d56c" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 36l10 10" stroke="#0f4b3f" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M46 36l-10 10" stroke="#0f4b3f" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}

function Header() {
  const { cart } = useCart()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5f1] p-1 shadow-sm ring-1 ring-[#d8e7df]">
              <StethoscopeLogo />
            </div>
            <div className="text-xl font-semibold tracking-wide text-slate-900">Kaplan1</div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
              <span aria-hidden="true">🛒</span>
              Cart
              {totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3c1d5a] px-1.5 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function HomePage() {
  const [promoVisible, setPromoVisible] = useState(true)

  return (
    <>
      {promoVisible && (
        <div className="bg-[#f4d56c] px-4 py-2 text-center text-xs font-medium text-slate-800">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <span>Save 30% on USMLE® prep. Get early access to our biggest sale of 2026.</span>
            <button
              type="button"
              aria-label="Close offer banner"
              onClick={() => setPromoVisible(false)}
              className="text-xl leading-none text-slate-700 hover:text-slate-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <section className="bg-[#0f4b3f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6 lg:pr-6">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#cfe1d4] uppercase">USMLE Step 1 Prep</p>
              <h1 className="max-w-xl font-serif text-4xl leading-none text-white sm:text-5xl lg:text-[4rem]">
                Join the 90% of Committed<br />
                Students Who Passed
              </h1>
              <p className="max-w-xl text-base text-[#dce8e0] lg:text-lg">
                Step 1 is where your future in medicine begins, and our USMLE prep is built to help you get there.
                Thoughtful study systems, expert direction, and real-world exam practice help turn daily effort into measurable progress.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/product/qbank" className="rounded-full bg-[#2d1147] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1f0a2d]/30 transition hover:bg-[#210d32]">
                  Explore Program
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-[#041b17]/30">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1100&q=80"
                  alt="Medical student using a laptop"
                  className="h-[420px] w-full rounded-[22px] object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f5f4] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-4xl tracking-tight text-slate-900">Explore #1 Rated USMLE Prep</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
              Why does Test Prep Insight name Kaplan their #1 choice? We designed each study system to deliver focused guidance, realistic practice and dependable accountability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [addedMessage, setAddedMessage] = useState('')

  const handleAddToCart = () => {
    addToCart(product, 1)
    setAddedMessage(`${product.name} added to cart`)
    window.clearTimeout(handleAddToCart.timeout)
    handleAddToCart.timeout = window.setTimeout(() => setAddedMessage(''), 2200)
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{product.category}</span>
        {product.badge && (
          <span className="rounded-full bg-[#f7ebba] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="mt-6 mb-2 text-2xl font-semibold text-slate-900">{product.name}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">Save 30%</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
        <span className="text-base text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to={`/product/${product.slug}`} className="flex-1 rounded-full bg-[#2d1147] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#210d32]">
          Learn More
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
        >
          Add to cart
        </button>
      </div>

      {addedMessage && (
        <div className="mt-3 rounded-full bg-emerald-50 px-3 py-1.5 text-center text-xs font-medium text-emerald-700">
          {addedMessage}
        </div>
      )}

      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-0.5 text-[#1b7d46]">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function ProductDetailPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const product = products.find((item) => item.slug === slug)
  const [addedMessage, setAddedMessage] = useState('')
  let showAddedMessageTimeout = null

  if (!product) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Product not found</h1>
        <Link to="/" className="mt-6 inline-block rounded-full bg-[#2d1147] px-5 py-3 text-sm font-semibold text-white">
          Back to courses
        </Link>
      </section>
    )
  }

  return (
    <section className="bg-[#f7f6f4] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#2d1147] hover:text-[#210d32]">
          ← Back to home
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center text-sm font-medium text-[#2d1147]">
          ← Back to all courses
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-10 p-6 lg:grid-cols-[1.1fr_1fr] lg:p-10">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{product.category}</span>
                <span className="rounded-full bg-[#f7ebba] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                  {product.badge}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-4xl leading-tight text-slate-900">{product.name}</h1>
                <p className="mt-3 text-lg text-slate-600">{product.longDescription}</p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
                <span className="text-xl text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, 1)
                    setAddedMessage(`${product.name} added to cart`)
                    window.clearTimeout(showAddedMessageTimeout)
                    showAddedMessageTimeout = window.setTimeout(() => setAddedMessage(''), 2200)
                  }}
                  className="rounded-full bg-[#2d1147] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#210d32]"
                >
                  Add to cart
                </button>
              </div>

              {addedMessage && (
                <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  {addedMessage}
                </div>
              )}

              <div className="rounded-2xl bg-[#f0f7f3] p-4 text-sm text-slate-700">
                <div className="mb-2 font-semibold text-slate-900">Included in this package</div>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#1b7d46]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-slate-900">Why students choose this program</h2>
            <ul className="space-y-4 text-slate-700">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <span className="mt-1 text-[#1b7d46]">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
            <div className="space-y-4">
              {product.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-slate-200 pb-4 last:border-none last:pb-0">
                  <div className="font-semibold text-slate-900">{faq.question}</div>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mb-6 text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1147] hover:text-[#210d32]">
            ← Back to home
          </Link>
        </div>
        <h1 className="font-serif text-4xl text-slate-900">Your cart is empty</h1>
        <Link to="/" className="mt-6 inline-block rounded-full bg-[#2d1147] px-6 py-3 text-sm font-semibold text-white">
          Continue shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1147] hover:text-[#210d32]">
          ← Back to home
        </Link>
      </div>
      <h1 className="font-serif text-4xl text-slate-900">Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          {cart.map((item) => {
            const product = products.find((entry) => entry.id === item.productId)
            if (!product) return null
            return (
              <div key={item.productId} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <img src={product.image} alt={product.name} className="h-28 w-full rounded-xl object-cover sm:w-32" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{product.subtitle}</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.productId)} className="text-sm font-medium text-red-600">
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 rounded-full border border-slate-200 px-2 py-1">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-8 w-8 rounded-full hover:bg-slate-100">−</button>
                      <span className="min-w-5 text-center text-sm font-medium">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-8 w-8 rounded-full hover:bg-slate-100">+</button>
                    </div>
                    <div className="text-lg font-semibold text-slate-900">{formatCurrency(product.price * item.quantity)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>Calculated at checkout</span></div>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4 flex items-center justify-between text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2d1147] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#210d32]">
            Checkout
          </Link>
        </aside>
      </div>
    </section>
  )
}

function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId)
        return sum + (product ? product.price * item.quantity : 0)
      }, 0),
    [cart],
  )

  const sendOtp = async () => {
    const trimmedEmail = customerEmail.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Enter a valid email before requesting the OTP.')
      return
    }

    setOtpLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/payments/email/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      if (!response.ok) {
        throw new Error('OTP request failed')
      }
      setOtpSent(true)
      setOtpVerified(false)
      setOtpCode('')
      setError('')
    } catch (otpError) {
      console.error(otpError)
      setError('Could not send the email verification code. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOtp = async () => {
    const trimmedEmail = customerEmail.trim()
    const trimmedOtp = otpCode.trim()

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Enter a valid email before verifying the OTP.')
      return
    }
    if (!trimmedOtp) {
      setError('Enter the 6-digit code you received by email.')
      return
    }

    setOtpVerifying(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/payments/email/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, otp: trimmedOtp }),
      })
      const result = await response.json()
      if (!response.ok || result.status !== 'verified') {
        throw new Error(result.message || 'OTP verification failed')
      }
      setOtpVerified(true)
    } catch (otpError) {
      console.error(otpError)
      setError(otpError.message || 'The OTP is invalid or expired.')
      setOtpVerified(false)
    } finally {
      setOtpVerifying(false)
    }
  }

  const handleCheckout = async () => {
    if (PAYMENTS_DISABLED) {
      setError(PAYMENTS_DISABLED_MESSAGE)
      return
    }

    if (!cart.length) {
      navigate('/cart')
      return
    }

    const trimmedName = customerName.trim()
    const trimmedEmail = customerEmail.trim()
    if (!trimmedName) {
      setError('Your full name is required for the order confirmation email.')
      return
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Email is required to complete the purchase.')
      return
    }
    if (!otpVerified) {
      setError('Please verify the email OTP before paying.')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const payload = {
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      }

      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        const orderId = result.orderId || `demo_${Date.now()}`
        const total = result.amount || subtotal

        if (window.Razorpay) {
          const options = {
            key: result.keyId || 'rzp_test_demo',
            amount: total,
            currency: 'INR',
            name: 'Kaplan1',
            description: 'Course purchase',
            order_id: orderId,
            handler: async (paymentResponse) => {
              try {
                const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    order_id: orderId,
                    payment_id: paymentResponse.razorpay_payment_id,
                    signature: paymentResponse.razorpay_signature,
                    customer_name: trimmedName,
                    email: trimmedEmail,
                    amount: subtotal,
                    currency: 'USD',
                    product_name: cart.map((item) => products.find((product) => product.id === item.productId)?.name || item.productId).join(', '),
                    otp: otpCode.trim(),
                  }),
                })

                if (verifyResponse.ok) {
                  clearCart()
                  navigate('/payment-success', {
                    state: {
                      orderId,
                      amount: formatCurrency(total / 100),
                      paymentId: paymentResponse.razorpay_payment_id,
                    },
                  })
                  return
                }
              } catch (verificationError) {
                console.error('Verification request failed', verificationError)
              }

              navigate('/payment-failure', {
                state: { message: 'Payment verification failed. Please contact support.' },
              })
            },
            prefill: { name: 'Student', email: 'student@example.com', contact: '+919999999999' },
            theme: { color: '#1f3d2c' },
            modal: { ondismiss: () => navigate('/payment-failure') },
          }

          const razorpay = new window.Razorpay(options)
          razorpay.open()
          return
        }

        throw new Error('Razorpay is not available in the browser yet.')
      }

      if (response.status === 503 || response.status === 400) {
        throw new Error('Payments are temporarily unavailable while Razorpay is not configured.')
      }

      throw new Error('Backend order creation failed')
    } catch (checkoutError) {
      console.error(checkoutError)
      setError(checkoutError.message || 'Payments are temporarily unavailable while Razorpay is not configured.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1147] hover:text-[#210d32]">
          ← Back to home
        </Link>
      </div>
      <h1 className="font-serif text-4xl text-slate-900">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Order summary</h2>
          <div className="mt-6 space-y-4">
            {cart.map((item) => {
              const product = products.find((entry) => entry.id === item.productId)
              if (!product) return null
              return (
                <div key={item.productId} className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-none last:pb-0">
                  <div>
                    <div className="font-medium text-slate-900">{product.name}</div>
                    <div className="text-sm text-slate-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-slate-900">{formatCurrency(product.price * item.quantity)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Payment</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="customer-name" className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="customer-name"
                type="text"
                required
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 transition focus:border-[#2d1147] focus:bg-white"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="customer-email" className="mb-2 block text-sm font-medium text-slate-700">
                Email for order confirmation
              </label>
              <input
                id="customer-email"
                type="email"
                required
                value={customerEmail}
                onChange={(event) => {
                  setCustomerEmail(event.target.value)
                  setOtpSent(false)
                  setOtpVerified(false)
                  setOtpCode('')
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 transition focus:border-[#2d1147] focus:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading || !customerEmail.trim()}
                className="rounded-full border border-[#2d1147] bg-white px-4 py-2 text-xs font-semibold text-[#2d1147] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {otpLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>

            {otpSent && (
              <div className="space-y-2">
                <label htmlFor="otp-code" className="mb-2 block text-sm font-medium text-slate-700">
                  Verify your email code
                </label>
                <div className="flex gap-2">
                  <input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 transition focus:border-[#2d1147] focus:bg-white"
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otpVerifying || otpCode.length < 6}
                    className="rounded-full bg-[#2d1147] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {otpVerifying ? 'Checking...' : 'Verify'}
                  </button>
                </div>
                {otpVerified && <p className="text-sm font-medium text-emerald-700">Email verified successfully.</p>}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>Included</span></div>
            <div className="flex justify-between"><span>Security</span><span>SSL Protected</span></div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          {PAYMENTS_DISABLED && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
              {PAYMENTS_DISABLED_MESSAGE}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={processing || PAYMENTS_DISABLED}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2d1147] px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#210d32]"
          >
            {processing ? 'Processing...' : PAYMENTS_DISABLED ? 'Payments coming soon' : 'Pay securely'}
          </button>
        </aside>
      </div>
    </section>
  )
}

function PaymentSuccessPage() {
  const { state } = useLocation()

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center">
      <div className="mb-6 text-left">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1147] hover:text-[#210d32]">
          ← Back to home
        </Link>
      </div>
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-[#edf9f0] p-8 shadow-sm">
        <div className="mb-4 text-5xl">✓</div>
        <h1 className="font-serif text-4xl text-slate-900">Payment successful</h1>
        <p className="mt-3 text-slate-600">Your order has been confirmed and a confirmation email will be sent shortly.</p>
        <div className="mt-6 space-y-2 text-left rounded-2xl bg-white p-4 text-sm text-slate-700">
          <div className="flex justify-between"><span>Order ID</span><span>{state?.orderId || 'N/A'}</span></div>
          <div className="flex justify-between"><span>Amount</span><span>{state?.amount || '$0'}</span></div>
          <div className="flex justify-between"><span>Payment Ref</span><span>{state?.paymentId || 'N/A'}</span></div>
        </div>
        <Link to="/" className="mt-6 inline-block rounded-full bg-[#2d1147] px-6 py-3 text-sm font-semibold text-white">
          Return to courses
        </Link>
      </div>
    </section>
  )
}

function PaymentFailurePage() {
  const { state } = useLocation()

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center">
      <div className="mb-6 text-left">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1147] hover:text-[#210d32]">
          ← Back to home
        </Link>
      </div>
      <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <div className="mb-4 text-5xl">!</div>
        <h1 className="font-serif text-4xl text-slate-900">Payment was not completed</h1>
        <p className="mt-3 text-slate-600">{state?.message || 'Your payment could not be processed. Please try again or contact support.'}</p>
        <Link to="/checkout" className="mt-6 inline-block rounded-full bg-[#2d1147] px-6 py-3 text-sm font-semibold text-white">
          Try again
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0f1b1b] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="text-lg font-semibold text-white">Kaplan1</div>
          <p className="mt-3 text-sm text-slate-400">Learning programs that blend structure, expert feedback and performance tracking for confident exam preparation.</p>
        </div>
        <div>
          <div className="font-semibold text-white">Programs</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Qbank</li>
            <li>FlexTrack</li>
            <li>Live Online</li>
            <li>Tutoring</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white">Resources</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Study guides</li>
            <li>Webinars</li>
            <li>Success stories</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>+1 (800) 555-0147</li>
            <li>support@kaplan1.com</li>
            <li>Mon–Sat, 8am–8pm</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default App
