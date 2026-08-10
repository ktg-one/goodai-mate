1. **Add `gai-input` class to `globals.css`**
   - We need to define the `gai-input` class in `globals.css` to style form inputs.
   - It will have brutalist styling: `font-family: var(--font-sans); font-size: 16px; border: 2px solid var(--ink); background: var(--paper); color: var(--ink); padding: 10px 14px; outline: none; transition: box-shadow 120ms, transform 120ms;`
   - Include a `:focus-visible` state: `outline: 2px solid var(--ink); outline-offset: 2px; box-shadow: 3px 3px 0 var(--ink);`
   - Ensure `outline: none` is set correctly and use a custom focus state to align with the brand guidelines ("explicitly disable default browser outlines (`outline: none;`) and apply custom native focus outlines").

2. **Update `.gai-intake-input` class in `globals.css` to have proper focus outline**
   - It currently has `outline: none;`. Add `:focus-visible` with `outline: 2px solid var(--ink); outline-offset: 2px;` or similar, as per the brand guidelines.

3. **Verify Changes via frontend_verification_complete**
   - Start the next server, write a playwright script to capture a screenshot of an input using `gai-input` or the intake input.

4. **Update `public/log.md`**
   - Tick the implemented area for adding brutalist styling to `gai-input` and `.gai-intake-input` focus states.

5. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
