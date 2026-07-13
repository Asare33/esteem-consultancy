export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export interface FooterNavGroup {
  title: string;
  links: NavLink[];
}

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Event Management", href: "/services/event-management" },
      { label: "Strategic Communication", href: "/services/strategic-communications" },
      { label: "Training", href: "/services/training" },
    ],
  },
  { label: "Rentals", href: "/services/equipment-rentals" },
  { label: "Gallery", href: "/gallery" },
  { label: "News & Updates", href: "/news" },
  { label: "Contact", href: "/contact" },
  { label: "Customer Portal", href: "/portal" },
];

export const footerNavigation: FooterNavGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Event Management", href: "/services/event-management" },
      { label: "Strategic Communication", href: "/services/strategic-communications" },
      { label: "Training", href: "/services/training" },
      { label: "Equipment Rentals", href: "/services/equipment-rentals" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Customer Portal", href: "/portal" },
      { label: "Book Consultation", href: "/book-consultation" },
      { label: "Request Quote", href: "/request-quote" },
      { label: "Admin Login", href: "/admin/login" },
      { label: "News", href: "/news" },
    ],
  },
];

export const ctaNavigation: NavLink = {
  label: "Book Consultation",
  href: "/book-consultation",
};
