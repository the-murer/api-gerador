# Project Limits

## Handler Limits

Preferred:
- <= 300 lines
- <= 5 dependencies
- <= 3 nesting levels

---

## Controller Limits

Preferred:
- <= 150 lines

---

## Repository Limits

Preferred:
- <= 250 lines

Split repositories if they become excessively complex.

---

## Utility Creation

Utilities are allowed when they:
- reduce duplication
- improve readability
- encapsulate repeated transformations

Avoid creating generic utilities without reuse.

---

## Feature Scope

Each feature should:
- remain isolated
- have explicit responsibilities
- avoid leaking logic into unrelated modules
