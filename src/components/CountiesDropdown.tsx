import { useCallback, useEffect, useId, useRef, useState } from "react";

const COUNTIES = [
  "Burke County",
  "Columbia County",
  "Emanuel County",
  "Glascock County",
  "Jefferson County",
  "Jenkins County",
  "Lincoln County",
  "McDuffie County",
  "Richmond County",
  "Screven County",
  "Taliaferro County",
  "Warren County",
  "Wilkes County",
];

interface CountiesDropdownProps {
  /** Slug of the county currently being viewed, e.g. "burke" — marks aria-current. */
  currentSlug?: string;
}

/**
 * Accessible Counties dropdown for the primary nav.
 *
 * Behavior:
 *  - Hover opens the menu (mouse users).
 *  - Click / Enter / Space / ArrowDown on the trigger opens the menu and focuses
 *    the first item. ArrowUp opens and focuses the last item.
 *  - Inside the menu: ArrowUp/ArrowDown move between items, Home/End jump to
 *    first/last, Esc closes and returns focus to the trigger, Tab closes
 *    (allowing natural focus flow), and clicking outside closes.
 *  - aria-haspopup / aria-expanded / aria-controls are kept in sync.
 *  - role="menu" with role="menuitem" links and roving focus via tabIndex.
 */
const CountiesDropdown = ({ currentSlug }: CountiesDropdownProps) => {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const focusItem = useCallback((index: number) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!items.length) return;
    const wrapped = (index + items.length) % items.length;
    items[wrapped]?.focus();
  }, []);

  const openAndFocus = useCallback(
    (index: number) => {
      setOpen(true);
      // Wait for menu to render before focusing.
      requestAnimationFrame(() => focusItem(index));
    },
    [focusItem],
  );

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Click outside closes.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        openAndFocus(0);
        break;
      case "ArrowUp":
        e.preventDefault();
        openAndFocus(COUNTIES.length - 1);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          close();
        }
        break;
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(COUNTIES.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        // Allow natural tab flow but close the menu.
        setOpen(false);
        break;
    }
  };

  return (
    <li
      ref={containerRef}
      className="relative flex flex-1 items-stretch"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Label → navigates to the Counties landing page. */}
      <a
        href="/counties"
        className="flex flex-1 items-center justify-center px-3 py-3 text-center text-sm font-medium hover:bg-brand-hover focus-visible:bg-brand-hover"
      >
        Counties
      </a>
      {/* Caret → toggles the dropdown without navigating. */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close counties menu" : "Open counties menu"}
        onClick={() => (open ? close() : openAndFocus(0))}
        onKeyDown={onTriggerKeyDown}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center pr-3 text-xs hover:bg-brand-hover focus-visible:bg-brand-hover"
      >
        <span aria-hidden="true">▾</span>
      </button>
      <ul
        id={menuId}
        role="menu"
        aria-label="Counties"
        className={`absolute left-0 top-full z-50 min-w-[220px] rounded-b border border-t-[3px] border-border border-t-accent-gold bg-popover p-1.5 text-popover-foreground shadow-lg transition-opacity ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {COUNTIES.map((county, index) => {
          const slug = county.replace(" County", "").toLowerCase();
          const isCurrent = currentSlug === slug;
          return (
            <li key={county} role="none">
              <a
                ref={(el) => (itemRefs.current[index] = el)}
                role="menuitem"
                href={`/counties/${slug}`}
                tabIndex={open ? 0 : -1}
                aria-current={isCurrent ? "page" : undefined}
                onKeyDown={(e) => onItemKeyDown(e, index)}
                className={`block rounded px-3 py-2 text-sm font-medium text-primary underline-offset-2 hover:bg-muted hover:underline focus-visible:bg-muted focus-visible:underline ${
                  isCurrent ? "bg-muted" : ""
                }`}
              >
                {county}
              </a>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default CountiesDropdown;
