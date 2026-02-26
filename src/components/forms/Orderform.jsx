import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../helper/Context'
import { MdDeleteOutline } from 'react-icons/md'
import { generateReceipt } from '@/lib/database/print'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import BarScanner from '../helper/BarcodeScanner'
import { FaBarcode } from 'react-icons/fa'

const Orderform = ({ cartItems = [] }) => {
    const { decreaseQuantity, clearCart, addToCart, removeFromCart, setCart, customers, setIsCustomerBox } = useContext(Context)
    const [saleType, setSaleType] = useState('retail')
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    // --- NEW STATES FOR MODAL ---
    const [isPaymentModal, setIsPaymentModal] = useState(false)
    const [receivedAmount, setReceivedAmount] = useState(0)

    const [data, setData] = useState({
        customer_id: '22',
        extradiscount: 0,
        subTotal: 0,
        totalDiscount: 0,
        totalPrice: 0,
        transactionId: '',
        paymentMethod: 'cash',
        createdAt: new Date().toISOString().split('T')[0]
    })

    // Search functionality
    useEffect(() => {
        const fetchData = async () => {
            if (!searchTerm) {
                setProducts([])
                return
            }
            try {
                const response = await axios.get(`/api/product/search?q=${searchTerm}`, { withCredentials: true })
                setProducts(response.data.payload)
            } catch (error) {
                console.error(error)
                setProducts([])
            }
        }
        const delayDebounceFn = setTimeout(() => fetchData(), 300)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const handleBarcodeScan = async (code) => {
        if (!code) return
        try {
            const response = await axios.get(`/api/product/search?q=${code}`, { withCredentials: true })
            const foundItems = response.data.payload

            if (foundItems && foundItems.length === 1) {
                const item = foundItems[0];
                if (Number(item.stock) <= 0) {
                    toast.error('Out of stock')
                    return
                }
                const priceToSet = saleType === 'wholesale' ? item.wholesale_price : item.sale_price;
                addToCart({ ...item, price: parseFloat(priceToSet) || 0 })
                setSearchTerm('')
            }
        } catch (error) {
            console.error("Scanner lookup error:", error)
        }
    }

    const handleSaleTypeChange = (type) => {
        setSaleType(type)
        setCart(prev => ({
            ...prev,
            items: prev.items.map(item => ({
                ...item,
                price: type === 'wholesale'
                    ? (parseFloat(item.wholesale_price) || 0)
                    : (parseFloat(item.sale_price) || 0)
            }))
        }))
    }

    const handlePriceChange = (productId, newPrice) => {
        setCart(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.product_id === productId
                    ? { ...item, price: parseFloat(newPrice) || 0 }
                    : item
            )
        }))
    }

    // Master Calculation Effect
    useEffect(() => {
        const subTotal = cartItems.reduce((sum, item) => {
            // Priority: Manual price > default sale/wholesale price
            const itemPrice = item.price !== undefined ? item.price : (saleType === 'retail' ? item.sale_price : item.wholesale_price);
            return sum + (parseFloat(itemPrice) * (item.quantity || 0));
        }, 0)

        const productDiscountTotal = cartItems.reduce((sum, item) => {
            const discountPerUnit = saleType === 'wholesale' ? 0 : (parseFloat(item.discount_price) || 0);
            return sum + (discountPerUnit * (item.quantity || 0));
        }, 0)

        const manualDiscount = parseFloat(data.extradiscount) || 0
        const totalPrice = subTotal - productDiscountTotal - manualDiscount

        setData(prev => ({
            ...prev,
            subTotal,
            totalDiscount: productDiscountTotal,
            totalPrice: Math.max(0, totalPrice)
        }))
    }, [cartItems, data.extradiscount, saleType])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (cartItems.length === 0) return toast.error("Cart is empty")
        if (!data.customer_id) return toast.error("Please select a customer")
        
        setReceivedAmount(data.totalPrice) 
        setIsPaymentModal(true)
    }

    // Calculation for display in modal
    const changeAmount = (parseFloat(receivedAmount) || 0) - data.totalPrice

    const finalConfirm = async () => {
        if (changeAmount < 0) {
            toast.error("Received amount is less than total price");
            return
        }
        const selectedCustomer = customers.find(c => String(c.customer_id) === String(data.customer_id))
        
        const payload = {
            customer_id: data.customer_id,
            phone: selectedCustomer?.phone || '',
            customerName: selectedCustomer?.name || '',
            subtotal: data.subTotal,
            discount: data.totalDiscount + (parseFloat(data.extradiscount) || 0),
            total: data.totalPrice,
            paid_amount: parseFloat(receivedAmount) || 0, 
            change_amount: Math.max(0, changeAmount),                 
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            saleType: saleType,
            status: 'completed',
            createdAt: data.createdAt,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                // Ensure we send the current price from state
                price: item.price !== undefined ? item.price : (saleType === 'retail' ? item.sale_price : item.wholesale_price)
            }))
        }

        try {
            const response = await axios.post('/api/order', payload, { withCredentials: true })
            toast.success(response.data.message)
            if (generateReceipt) generateReceipt(response.data.payload)

            setIsPaymentModal(false)
            clearCart()
            setData({
                customer_id: '22',
                extradiscount: 0,
                transactionId: '',
                paymentMethod: 'cash',
                subTotal: 0,
                totalDiscount: 0,
                totalPrice: 0,
                createdAt: new Date().toISOString().split('T')[0]
            })
            setSaleType('retail')
        } catch (error) {
            toast.error(error?.response?.data?.message || "Checkout failed")
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-between gap-2 text-sm bg-white p-4 rounded-xl shadow-md border border-gray-100'>
                <input
                    type="date"
                    name="createdAt"
                    value={data.createdAt}
                    onChange={handleChange}
                    className='px-3 py-1 border border-black/10 rounded-lg outline-none w-full bg-white'
                />

                <div className='w-full flex flex-row items-center justify-center gap-1'>
                    <select
                        name="customer_id"
                        id="customer_id"
                        value={data.customer_id}
                        onChange={handleChange}
                        required
                        className='px-3 w-full py-2 border border-black/10 rounded-lg outline-none bg-white'
                    >
                        <option value="">--select customer--</option>
                        {customers.map((customer) => (
                            <option value={customer.customer_id} key={customer.customer_id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    <button type='button' onClick={() => setIsCustomerBox(true)} className='px-4 py-2 rounded-lg bg-sky-600 text-white font-bold'>+</button>
                </div>

                <div className='grid grid-cols-2 gap-2 bg-gray-100  rounded-lg w-full'>
                    <button type="button" onClick={() => handleSaleTypeChange('retail')}
                        className={`py-2 rounded-md font-bold transition-all ${saleType === 'retail' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>Retail</button>
                    <button type="button" onClick={() => handleSaleTypeChange('wholesale')}
                        className={`py-2 rounded-md font-bold transition-all ${saleType === 'wholesale' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-500'}`}>Wholesale</button>
                </div>

                <div className="w-full flex flex-col items-center gap-2 relative">
                    <BarScanner onScan={handleBarcodeScan} />
                    <div className="w-full px-2 flex flex-row border border-sky-400 items-center justify-between">
                        <FaBarcode  className='text-2xl text-sky-600'/>
                        <input
                            type="text"
                            name='searchTerm'
                            id='searchTerm'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            placeholder='search product name or barcode'
                            className='w-full  px-4 p-1 rounded-sm  outline-none'
                        />
                    </div>

                    {searchTerm.length > 0 && products && products.length > 0 && (
                        <div className="w-full flex flex-col gap-2 items-center justify-center absolute bg-white top-full border z-50 shadow-xl max-h-60 overflow-y-auto">
                            {products.map((product) => (
                                <div key={product.product_id} onClick={() => {
                                        if (Number(product.stock) > 0) {
                                            const price = saleType === 'wholesale' ? product.wholesale_price : product.sale_price;
                                            addToCart({ ...product, price: parseFloat(price) });
                                            setSearchTerm('')
                                        } else {
                                            toast.error('Out of stock')
                                        }
                                    }} className="w-full cursor-pointer flex flex-row even:bg-gray-200 items-center justify-between p-2">
                                    <p className="flex-1">{product.name}</p>
                                    <p className="mx-2"> ৳ {saleType === 'retail' ? (product.sale_price - product.discount_price) : product.wholesale_price}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='w-full flex flex-col gap-2 max-h-48 overflow-y-auto border-y border-black/5 py-2'>
                    <div className='w-full grid grid-cols-10 gap-2 font-bold text-gray-600 border-b pb-1'>
                        <p className='col-span-4'>Product</p>
                        <p className='col-span-2 text-center'>Quatityy</p>
                        <p className='col-span-1'>Rate</p>
                        <p className='col-span-1'>Disc</p>
                        <p className='col-span-1'>Total</p>
                        <p className='col-span-1 text-right'>Delete</p>
                    </div>

                    {cartItems.map(item => {
                        const itemRate = item.price !== undefined ? item.price : (saleType === 'wholesale'
                            ? (parseFloat(item.wholesale_price) || 0)
                            : (parseFloat(item.sale_price) || 0));

                        const itemDiscount = saleType === 'wholesale'
                            ? 0
                            : (parseFloat(item.discount_price) || 0);

                        const rowTotal = (itemRate - itemDiscount) * (item.quantity || 0);

                        return (
                            <div key={item.product_id} className='w-full grid grid-cols-10 gap-2 p-2 mb-1 even:bg-gray-50 shadow-sm border border-black/10 rounded-lg items-center'>
                                <div className='col-span-4'>
                                    <p className='text-xs font-bold truncate' title={item.name}>{item.name}</p>
                                    <p className='text-[10px] text-sky-600 font-bold uppercase'>{saleType}</p>
                                </div>

                                <div className='flex col-span-2 items-center justify-between bg-gray-100 px-2 py-1 rounded-full border border-black/5'>
                                    <FaMinus className='cursor-pointer text-gray-600 hover:text-red-500 text-xs' onClick={() => decreaseQuantity(item?.product_id)} />
                                    <span className='text-gray-800 font-bold'>{item?.quantity}</span>
                                    <FaPlus className='cursor-pointer text-gray-600 hover:text-sky-600 text-xs' onClick={() => addToCart(item)} />
                                </div>

                                <div className='col-span-1 flex items-center'>
                                    <input
                                        type="number"
                                        value={itemRate}
                                        onChange={(e) => handlePriceChange(item.product_id, e.target.value)}
                                        className='w-full bg-transparent border-b border-black/10 outline-none focus:border-sky-600'
                                        step="0.01"
                                    />
                                </div>

                                <p className='col-span-1 text-red-500 text-[10px]'>
                                    {itemDiscount > 0 ? `-${itemDiscount}` : '0'}
                                </p>

                                <p className='col-span-1 font-bold text-gray-800 text-xs'>৳{rowTotal.toFixed(1)}</p>

                                <div className='col-span-1 flex justify-end'>
                                    <MdDeleteOutline
                                        className='text-3xl text-red-400 cursor-pointer hover:text-red-600 transition-all'
                                        onClick={() => removeFromCart(item?.product_id)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className='w-full flex flex-col gap-2 pt-2'>
                    <div className='flex justify-between'>
                        <span>Sub Total</span>
                        <span>{data.subTotal.toFixed(2)}</span>
                    </div>
                    {data.totalDiscount > 0 && (
                        <div className='flex justify-between text-red-500 font-medium'>
                            <span>Auto Discount</span>
                            <span>-{data.totalDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className='flex justify-between items-center'>
                        <label>Manual Discount</label>
                        <input
                            type="number"
                            name="extradiscount"
                            min={0}
                            step="0.01"
                            value={data.extradiscount}
                            onChange={handleChange}
                            className='w-20 border-b border-black/10 outline-none text-right focus:border-sky-600 transition-colors'
                        />
                    </div>
                    <div className='flex justify-between font-extrabold text-xl border-t border-dashed pt-2 mt-2 text-sky-700'>
                        <span>TOTAL</span>
                        <span>৳{data.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <button className='w-full py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700 font-bold shadow-lg transition-all active:scale-95 uppercase' type='submit'>
                    Complete {saleType} Sale
                </button>
            </form>

            {isPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-sky-600 p-4 text-white text-center">
                            <h2 className="text-lg font-bold uppercase">Confirm Payment</h2>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between text-sm border-b pb-1">
                                <span className="text-gray-500">Sub Total:</span>
                                <span className="font-bold">৳{data.subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-1 text-red-500">
                                <span>Total Discount:</span>
                                <span className="font-bold">-৳{(data.totalDiscount + (parseFloat(data.extradiscount) || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 bg-sky-50 px-3 rounded-lg">
                                <span className="text-sky-800 font-bold">Total Payable</span>
                                <span className="text-2xl font-black text-sky-700">৳{data.totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-600 uppercase">Paid Amount (Customer Gives)</label>
                                <input
                                    type="number"
                                    autoFocus
                                    onFocus={(e) => e.target.select()}
                                    value={receivedAmount}
                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                    className="w-full text-3xl font-bold p-3 border-2 border-sky-400 rounded-xl outline-none text-center bg-gray-50 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                <span className="text-red-700 font-bold">Change Amount</span>
                                <span className="text-2xl font-black text-red-600">৳{changeAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 p-4 bg-gray-50">
                            <button 
                                onClick={() => setIsPaymentModal(false)}
                                className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                Back
                            </button>
                            <button 
                                onClick={finalConfirm}
                                className="flex-2 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all uppercase"
                            >
                                Confirm & Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Orderform;