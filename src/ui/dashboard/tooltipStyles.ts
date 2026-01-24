export const getTooltipStyles = (isDark: boolean) => {
  const shadow = isDark
    ? "0 12px 30px -24px rgba(15, 23, 42, 0.5)"
    : "0 10px 30px -24px rgba(15, 23, 42, 0.35)";
  return {
    borderRadius: 12,
    borderColor: "var(--border)",
    backgroundColor: "var(--card)",
    color: "var(--text-1)",
    fontSize: 12,
    boxShadow: shadow,
  };
};
