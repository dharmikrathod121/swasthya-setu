import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="landing-footer">
      <div className="lf-inner">
        <div className="lf-copy">
          &copy; 2026 Swasthya Setu &middot; For informational purposes only.
          Not medical advice.
        </div>
        <nav className="lf-links" aria-label="Footer">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/about">About</Link>
          <Link href="/emergency">Emergency</Link>
        </nav>
      </div>
    </footer>
  );
}
