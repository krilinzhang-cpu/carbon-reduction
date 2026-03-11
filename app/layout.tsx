import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "碳减排平台",
  description: "企业碳减排与节能技术平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <Sidebar />
          <Header />
          <main
            className="min-h-screen pt-16 pb-8 pl-[220px]"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <div className="mx-auto max-w-[1280px] px-6">{children}</div>
          </main>
        </AntdRegistry>
      </body>
    </html>
  );
}
