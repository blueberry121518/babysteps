import './globals.css'; 

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body>
        <main className="bg-black h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
