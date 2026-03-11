export default function Header() {
  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-16 items-center border-b border-border bg-white px-6"
      style={{
        left: "220px",
        boxShadow: "0 1px 0 var(--color-border)",
      }}
    >
      <h1 className="text-base font-medium text-text-primary">
        企业碳减排与节能技术平台
      </h1>
    </header>
  );
}
