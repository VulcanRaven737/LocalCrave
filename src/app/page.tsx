import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

export default function Home() {
  return (
    <Navbar
      position="sticky"
      className="flex flex-wrap items-center justify-between p-4 bg-black text-white"
    >
      {/* Left section with logo */}
      <NavbarBrand className="flex justify-start">
        <Image 
          src='icons/main-logo.svg'
          alt='main-logo'
          width={300}
          height={300}
          className="w-300 h-300 max-w-[400px] sm:max-w-[150px]" 
        />
      </NavbarBrand>

      {/* Navigation links in the center */}
      <NavbarContent className="flex justify-center space-x-4"> 
        <NavbarItem>
          <Link href="#" className="text-gray-300 hover:text-white">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" className="text-gray-300 hover:text-white">
            Customers
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Buttons aligned to the right */}
      <NavbarContent className="flex justify-end items-center space-x-4">
        <NavbarItem>
          <Button as={Link} href="#" variant="ghost" radius="lg" className="bg-blueish-100">
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} href="#" variant="shadow" radius="lg" className="bg-blueish-100">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
