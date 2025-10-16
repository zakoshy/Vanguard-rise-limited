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
        <path fill="#003087" d="M10.155 12.39L8.69 3.545h3.816l1.465 8.844zm3.985-5.918c-.42-.56-1.04-.9-1.815-.983H9.95l1.635 9.81h2.242c1.47 0 2.625-.494 3.12-1.927.435-1.282.045-2.73-.81-3.692-.78-.855-1.936-1.32-3.233-1.3z"/>
        <path fill="#009cde" d="M16.14 6.472c-.42-.56-1.04-.9-1.815-.983h-2.37l.81 4.882c.225.676.84 1.156 1.575 1.156h.435c.78 0 1.41-.48 1.56-.9.21-.614.135-1.274-.225-1.8z"/>
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3.8-4.3c.5 0 .9-.4.9-.9s-.4-.9-.9-.9-.9.4-.9.9.4.9.9.9zm4.4-3.3c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm3.2 1.3c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zM9 10.1c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7zm1.6 3.2c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z"/>
      <path d="M12 4.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13.5c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
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
