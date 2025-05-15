interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </header>
  );
}