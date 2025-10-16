import type { SVGProps } from "react";

export const Icons = {
  mastercard: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="8" cy="12" r="7" fill="#EB001B"/>
      <circle cx="16" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/>
    </svg>
  ),
  paypal: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path fill="#003087" d="M10.155 12.39L8.69 3.545h3.816l1.465 8.844z"/>
      <path fill="#009cde" d="M14.14 6.472c-.42-.56-1.04-.9-1.815-.983h-2.37l.81 4.882c.225.676.84 1.156 1.575 1.156h.435c.78 0 1.41-.48 1.56-.9.21-.614.135-1.274-.225-1.8z"/>
      <path fill="#002f86" d="M14.355 15.337h-2.24l-.315-1.89h-.03c-.285.96-1.05 1.89-2.325 1.89H6.98l1.695-10.17h3.81l-1.32 7.89c.525.18 1.38.255 1.935-.045.915-.495 1.23-1.56 1.425-2.475l.6-3.45h2.895l-1.215 7.23c-.21 1.28-.84 2.31-2.025 2.91-.555.285-1.185.45-1.815.45z"/>
    </svg>
  ),
  mpesa: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 40" {...props}>
        <rect width="128" height="40" fill="#43BF43" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white">M-PESA</text>
    </svg>
  ),
  crypto: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" {...props}>
      <path d="M148,128a20,20,0,1,1-20-20A20,20,0,0,1,148,128Zm-20-64a12,12,0,1,0-12,12A12,12,0,0,0,128,64Zm48,88a12,12,0,1,0,12,12A12,12,0,0,0,176,152Zm-88,8a12,12,0,1,0,12,12A12,12,0,0,0,88,160Zm-4-60a12,12,0,1,0-12,12A12,12,0,0,0,84,100ZM128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>
    </svg>
  ),
  logo: (props: SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
};
