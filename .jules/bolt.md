
## 2024-05-18 - [Memoizing Controlled Form Inputs in React]
**Learning:** Controlled form inputs (`<Input value={input} onChange={...} />`) force a full component re-render on *every keystroke*. If the component also renders complex lists using `O(N)` mapping or filtering (like parsing an entire array of chat messages), those expensive operations happen on *every single typed character*, causing severe input lag.
**Action:** Always memoize derived arrays/lists with `useMemo` when they sit in the same component as a controlled text input, ensuring the array transformations only run when the actual data changes, not when the user types.
