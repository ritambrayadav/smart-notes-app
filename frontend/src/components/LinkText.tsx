import Link from "next/link";
import React from "react";

interface LinkTextProps {
  href: string;
  children: React.ReactNode;
}

const LinkText = ({ href, children }: LinkTextProps) => (
  <Link href={href} className="text-indigo-600 underline">
    {children}
  </Link>
);

export default LinkText;
