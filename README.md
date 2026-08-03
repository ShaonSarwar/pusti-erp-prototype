# PUSTI ERP — HTML Prototype

Client-approval prototype mapped to **Pusti 2026** workbook (not a full ERP backend).

## Live demo (GitHub Pages)

**https://shaonsarwar.github.io/pusti-erp-prototype/**

Repo: https://github.com/ShaonSarwar/pusti-erp-prototype

Open on phone or PC browser — no install.

## Sheet reality (3 layers)

| Layer | Sheet area | Meaning | Prototype screens |
|-------|------------|---------|-------------------|
| **A** | Day blocks (per product) | Samari / Firot / Delivery / stock; Due qty + Receive (goods, sparse) | Load, return, stock, goods-due, light receive |
| **B** | UO–UY | Monthly **product** totals (sale, profit, due product Tk) | Product summary |
| **C** | UZ–VO | **Daily money** settle (Due ৳, Credit, commission, sort, banking, net Receive Amount) | Daily cash settle |

**Naming trap:** “Receive” / “Due” appear in both goods and money contexts with different meaning.

## Principals

Demo mapping only (not proven from sheet branding): PRAN, Square, ACI, Meghna, City, Akij, Abul Khair.

## Open

Double-click `index.html` or serve the folder.

## What was corrected

- Daily cash settlement is first-class (was missing)
- Product Due qty vs money Due separated
- Warehouse “purchase receive” demoted to optional
- Carton sizes from sheet formulas
- SR names include Monir, Arif, Manik, Santo
- Help / dashboard / PnL / reports aligned to sheet
