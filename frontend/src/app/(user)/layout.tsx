import Footer from '@/components/Footer';
import TopNav from '@/components/TopNav';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-grow mb-12">{children}</main> {/* Added margin-bottom */}
      {/* <Footer /> */}
    </>
  );
}
