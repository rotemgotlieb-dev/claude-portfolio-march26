/* Demo engine — reduced-motion gate.
   Re-evaluated on each call (not cached) so a mid-session OS-level toggle
   takes effect on the next loop iteration. See CLAUDE.md "Recurring Bug
   Rule" failure-mode note: any cached boolean here would miss the toggle.
*/
export function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
