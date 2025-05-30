"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Montserrat } from "next/font/google"


  const monstserrat = Montserrat({ subsets: ["latin"] });

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
   <>
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Adzra Camp Logo" width={80} height={80} className="h-16 w-auto" />
            <div className={`flex flex-col justify-center text-center`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            <h1 className="text-xl font-bold">Adzra Camping</h1>
            <p className="text-lg font-extralight tracking-extra-widest uppercase">equipment</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center font-semibold">
            <Link
              href="/"
              className=" py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 hover:border-b-2 hover:border-green-600 dark:hover:text-primary-light"
            >
              Beranda
            </Link>
            <Link
              href="/produk"
              className=" py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 hover:border-b-2 hover:border-green-600 dark:hover:text-primary-light"
            >
              Produk
            </Link>
            <Link
              href="/blog"
              className=" py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 hover:border-b-2 hover:border-green-600 dark:hover:text-primary-light"
            >
              Blog
            </Link>
            <div className="relative group">
              <Link
                href="/jual-rental"
              className=" py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 hover:border-b-2 hover:border-green-600 dark:hover:text-primary-light"
            >
                Jual & Rental
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  href="/jual-rental/form-pembelian"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Form Pembelian
                </Link>
                <Link
                  href="/jual-rental/form-persewaan"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Form Persewaan
                </Link>
                <Link
                  href="/jual-rental/syarat-ketentuan"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Syarat & Ketentuan
                </Link>
                <Link
                  href="/jual-rental/pricelist"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Pricelist Rental
                </Link>
              </div>
            </div>
            <Link
              href="/tentang-kami"
              className=" py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 hover:border-b-2 hover:border-green-600 dark:hover:text-primary-light"
            > 
              Tentang Kami
            </Link>
            <ThemeToggle />
          </div>  

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-gray-800 dark:text-gray-200">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-800 dark:text-gray-200 hover:text-primary-dark dark:hover:text-primary-light font-medium"
                onClick={toggleMenu}
              >
                Beranda
              </Link>
              <Link
                href="/produk"
                className="text-gray-800 dark:text-gray-200 hover:text-primary-dark dark:hover:text-primary-light font-medium"
                onClick={toggleMenu}
              >
                Produk
              </Link>
              <Link
                href="/blog"
                className="text-gray-800 dark:text-gray-200 hover:text-primary-dark dark:hover:text-primary-light font-medium"
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <div className="space-y-2">
                <div className="text-gray-800 dark:text-gray-200 font-medium">Jual & Rental</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/jual-rental/form-pembelian"
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light"
                    onClick={toggleMenu}
                  >
                    Form Pembelian
                  </Link>
                  <Link
                    href="/jual-rental/form-persewaan"
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light"
                    onClick={toggleMenu}
                  >
                    Form Persewaan
                  </Link>
                  <Link
                    href="/jual-rental/syarat-ketentuan"
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light"
                    onClick={toggleMenu}
                  >
                    Syarat & Ketentuan
                  </Link>
                  <Link
                    href="/jual-rental/pricelist"
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light"
                    onClick={toggleMenu}
                  >
                    Pricelist Rental
                  </Link>
                </div>
              </div>
              <Link
                href="/tentang-kami"
                className="text-gray-800 dark:text-gray-200 hover:text-primary-dark dark:hover:text-primary-light font-medium"
                onClick={toggleMenu}
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
   </>
  )
}

export default Navbar
