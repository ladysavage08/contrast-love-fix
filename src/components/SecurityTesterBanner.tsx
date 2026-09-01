type Props = {
  expiresAt: string | null;
};

/**
 * Persistent label for the temporary CISA read-only security testing account.
 * Display only — all restrictions are enforced server-side by RLS.
 */
const SecurityTesterBanner = ({ expiresAt }: Props) => {
  const expires = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "no expiration set";

  return (
    <div
      role="status"
      className="mb-6 rounded-md border-2 border-destructive bg-destructive/10 p-4 text-sm font-medium text-foreground"
    >
      Temporary CISA security testing account — READ ONLY — Expires {expires}.
    </div>
  );
};

export default SecurityTesterBanner;
