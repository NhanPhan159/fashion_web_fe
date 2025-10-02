import { Button } from "@/components/ui/button";
import { Facebook, Heart, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <div className="px-20 pt-16 pb-8">
      <div className="grid grid-cols-4 gap-2 mb-10">
        <div className="col-span-1">
          <h2 className="uppercase mb-4">Conntect</h2>
          <div className="flex gap-3">
            <Facebook />
            <Instagram />
            <Twitter />
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="uppercase mb-4">Information</h2>
          <div className="flex flex-col gap-3">
            <span>Term & Conditions</span>
            <span>Cookie Policy</span>
            <span>Privacy Policy</span>
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="uppercase mb-4">Online services</h2>
          <div className="flex flex-col gap-3">
            <span>Shipping</span>
            <span>Return</span>
            <span>Client Service</span>
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="uppercase mb-4">The company</h2>
          <div className="flex gap-3 flex-col">
            <span>120%Lino</span>
            <span>Flagship Store</span>
            <span>Client Service</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button className="flex justify-center gap-2">
            <Heart/>
            Follow on shop
        </Button>
      </div>
    </div>
  );
};

export default Footer;
