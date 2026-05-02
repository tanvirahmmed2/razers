import Link from 'next/link'
import React from 'react'
import FooterTagline from './FooterTagline'
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='w-full bg-slate-900 text-slate-300 pt-12 px-4 border-t border-slate-800 pb-24'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Image src="/icon.png" alt="Logo" width={32} height={32} />
            <h2 className='text-xl font-bold text-white uppercase tracking-tighter'>
              Nizam <span className='text-primary'>Varieties Store</span>
            </h2>
          </div>
          <p className='text-sm leading-relaxed text-slate-400'>
            Your one-stop shop for premium quality variety products. We bring excellence to your doorstep with every purchase.
          </p>
          <div className='flex items-center gap-4 mt-2'>
            <SocialIcon icon={<Facebook size={18} />} href='#' />
            <SocialIcon icon={<Twitter size={18} />} href='#' />
            <SocialIcon icon={<Instagram size={18} />} href='#' />
          </div>
        </div>

        <FooterColumn title='Quick Links'>
          <FooterLink href='/offers'>Special Offers</FooterLink>
          <FooterLink href='/products'>New Arrivals</FooterLink>
          <FooterLink href='/products/category'>Categories</FooterLink>
          <FooterLink href='/dashboard'>Admin Access</FooterLink>
        </FooterColumn>

        <FooterColumn title='Company Policy'>
          <FooterLink href='/'>Privacy & Policy</FooterLink>
          <FooterLink href='/'>Payment Methods</FooterLink>
          <FooterLink href='/'>Refund Policy</FooterLink>
          <FooterLink href='/'>Terms of Service</FooterLink>
        </FooterColumn>

        <FooterColumn title='Contact Us'>
          <ContactItem icon={<Mail size={16} />} text='support@nizamvarieties.com' />
          <ContactItem icon={<Phone size={16} />} text='+880 1234-567890' />
          <ContactItem icon={<MapPin size={16} />} text='Dhaka, Bangladesh' />
        </FooterColumn>
      </div>
      
      <div className='max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col items-center gap-4'>
        <FooterTagline />
      </div>
    </footer>
  )
}

const FooterColumn = ({ title, children }) => (
  <div className='flex flex-col gap-6'>
    <h3 className='text-white font-semibold uppercase text-sm tracking-widest'>{title}</h3>
    <div className='flex flex-col gap-3'>
      {children}
    </div>
  </div>
)

const FooterLink = ({ href, children }) => (
  <Link href={href} className='text-sm hover:text-primary transition-colors hover:translate-x-1 duration-200 inline-block'>
    {children}
  </Link>
)

const SocialIcon = ({ icon, href }) => (
  <Link href={href} className='w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all'>
    {icon}
  </Link>
)

const ContactItem = ({ icon, text }) => (
  <div className='flex items-center gap-3 text-sm text-slate-400'>
    <div className='text-primary'>{icon}</div>
    <span>{text}</span>
  </div>
)

export default Footer
