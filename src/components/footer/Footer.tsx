
const Footer: React.FC = () => (
  <footer className="bg-[#200f39] text-white pt-12 pb-6 border-t border-[#3c2c5a] font-sans">
    <div className="max-w-[100rem] mx-auto flex flex-wrap justify-between gap-8 px-6">
      {/* Brand & Description */}
      <div className="flex-1 min-w-[220px]">
        <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-[#6366f1] to-[#3b82f6] rounded-lg w-10 h-10 flex items-center justify-center">
            <img src="/ic_train.svg" alt="KAI Logo" className="w-6 h-6" />
        </div>
          <span className="font-bold text-2xl text-white">KAI</span>
        </div>
        <p className="text-[#b6a7d6] text-base mb-6">
          Indonesia's leading railway service provider, connecting cities across the archipelago with comfort and reliability.
        </p>
        <div className="flex gap-4 mt-2">
          <a href="#" aria-label="Facebook" className="rounded-full bg-[#2e2342] hover:bg-[#6c4ad2] p-2 transition"><img src="/ic_facebook.svg" alt="Facebook" className="w-7 h-7" /></a>
          <a href="#" aria-label="Twitter" className="rounded-full bg-[#2e2342] hover:bg-[#6c4ad2] p-2 transition"><img src="/ic_twitter.svg" alt="Twitter" className="w-7 h-7" /></a>
          <a href="#" aria-label="Instagram" className="rounded-full bg-[#2e2342] hover:bg-[#6c4ad2] p-2 transition"><img src="/ic_instagram.svg" alt="Instagram" className="w-7 h-7" /></a>
          <a href="#" aria-label="YouTube" className="rounded-full bg-[#2e2342] hover:bg-[#6c4ad2] p-2 transition"><img src="/ic_youtube.svg" alt="YouTube" className="w-7 h-7" /></a>
        </div>
      </div>
      {/* Quick Links */}
      <div className="flex-1 min-w-[160px]">
        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
        <ul className="space-y-2 text-[#b6a7d6] text-base">
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Book Tickets</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Check Schedule</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Track Train</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Cancel Booking</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Station Info</a></li>
        </ul>
      </div>
      {/* Support */}
      <div className="flex-1 min-w-[160px]">
        <h4 className="text-white font-semibold text-lg mb-4">Support</h4>
        <ul className="space-y-2 text-[#b6a7d6] text-base">
          <li><a href="#" className="hover:text-[#6c4ad2] transition">FAQ</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Contact Us</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Terms & Conditions</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-[#6c4ad2] transition">Refund Policy</a></li>
        </ul>
      </div>
      {/* Contact Info */}
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-white font-semibold text-lg mb-4">Contact Info</h4>
        <ul className="space-y-3 text-[#b6a7d6] text-base">
          <li className="flex items-center gap-2">
            <img src="/ic_phone.svg" alt="Phone" className="w-5 h-5 filter drop-shadow" />
            <span className="text-[#6c4ad2]">+62 21 1234 5678</span>
          </li>
          <li className="flex items-center gap-2">
            <img src="/ic_mail.svg" alt="Email" className="w-5 h-5 filter drop-shadow" />
            <span className="text-[#6c4ad2]">info@kai.id</span>
          </li>
          <li className="flex items-center gap-2">
            <img src="/ic_location.svg" alt="Location" className="w-5 h-5 filter drop-shadow" />
            <span className="text-[#b6a7d6]">Jl. Perintis Kemerdekaan No.1<br />Jakarta Pusat, Indonesia</span>
          </li>
        </ul>
      </div>
    </div>
    <hr className="border-none border-t border-[#3c2c5a] my-8" />
    <div className="text-center text-[#b6a7d6] text-sm">
      © 2024 PT Kereta Api Indonesia. All rights reserved.
    </div>
  </footer>
);

export default Footer;
