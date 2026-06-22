export type HomeNavItemViewModel = {
  id: string;
  label: string;
  to: string;
};

export type HomeStatViewModel = {
  id: string;
  label: string;
  value: string;
  caption: string;
};

export type HomeViewModel = {
  productName: string;
  eyebrow: string;
  description: string;
  navItems: HomeNavItemViewModel[];
  stats: HomeStatViewModel[];
};
