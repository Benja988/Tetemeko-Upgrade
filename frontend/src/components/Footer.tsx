import { CompanyInfo } from './CompanyInfo';
import { QuickLinks } from './QuickLinks';
import { ContactInfo } from './ContactInfo';
import { SocialLinks } from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 pt-48 pb-36 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
        <CompanyInfo />
        <QuickLinks />
        <ContactInfo />
        <SocialLinks />
      </div>
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
      </div>
    </footer>
  );
}
