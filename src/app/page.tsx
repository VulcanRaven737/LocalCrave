import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

export default function Home() {
  return (
    <Navbar
      position="sticky"
      className="flex flex-wrap items-center justify-between p-4 bg-black text-white"
    >
      <NavbarBrand>
        <Image 
          src='icons/main-logo.svg'
          alt='main-logo'
          width={150}
          height={150}
          className="w-auto h-auto max-w-[100px] sm:max-w-[150px]" 
        />
      </NavbarBrand>

      <NavbarContent className="hidden md:flex justify-center space-x-4"> 
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

      <NavbarContent className="flex items-center space-x-4">
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat" className="bg-blueish-100">
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat" className="bg-blueish-100">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="flex md:hidden mt-2 space-x-4 justify-center">
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
    </Navbar>
  );
}
