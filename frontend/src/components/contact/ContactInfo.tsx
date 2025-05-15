import Link from "next/link";

export default function ContactInfo() {
  const contactDetails = [
    { icon: "📍", label: "Address", value: "123 Main Street, Dar es Salaam, Tanzania" },
    { icon: "📞", label: "Phone", value: "+255 700 000 000", link: "tel:+255700000000" },
    { icon: "✉️", label: "Email", value: "contact@tetemekomedia.com", link: "mailto:contact@tetemekomedia.com" },
  ];

  return (
    <ul className="space-y-6">
      {contactDetails.map((detail, index) => (
        <li key={index} className="flex items-start gap-4">
          <span className="text-2xl">{detail.icon}</span>
          <div>
            <p className="text-sm text-gray-400">{detail.label}</p>
            {detail.link ? (
              <Link href={detail.link} className="block text-lg font-semibold text-white hover:underline break-words">
                {detail.value}
              </Link>
            ) : (
              <p className="text-lg font-semibold text-white break-words">
                {detail.value}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
