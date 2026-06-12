import { ENDAVA_HOMEPIXEL_STYLE_HREFS } from "@/constants/endavaPixelStylesheets";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Endava | Transforming businesses with intelligence</title>
        <meta
          name="description"
          content="Combining world-class engineering, AI-native delivery and industry expertise to enable businesses to shape the future with intelligence."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta httpEquiv="content-language" content="en" />
        {ENDAVA_HOMEPIXEL_STYLE_HREFS.map((href) => (
          <link rel="stylesheet" href={href} key={href} />
        ))}
      </head>
      <body className="en">{children}</body>
    </html>
  );
}
