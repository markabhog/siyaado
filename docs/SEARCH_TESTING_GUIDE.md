# 🧪 Search Testing Guide

## Quick Test Steps

### 1. Basic Search Test
1. Go to homepage
2. Type "book" in the search bar
3. Press Enter or click "Search"
4. **Expected:** Redirects to `/search?q=book` and shows all books

### 2. Case Sensitivity Test
1. Search for "BOOK"
2. Search for "Book"
3. Search for "book"
4. **Expected:** All three searches return the same results

### 3. Empty Search Test
1. Leave search bar empty
2. Click "Search"
3. **Expected:** Shows all products (or stays on current page)

### 4. Filter Test
1. Search for "laptop"
2. Select "Electronics" category filter
3. **Expected:** Only laptops in Electronics category

### 5. Sort Test
1. Search for "laptop"
2. Select "Price: Low to High"
3. **Expected:** Results sorted by ascending price

### 6. No Results Test
1. Search for "xyzabc123nonexistent"
2. **Expected:** "No products found" message

### 7. Add to Cart from Search
1. Search for any product
2. Click "Add to Cart" on a product
3. **Expected:** Product added to cart, cart count updates

## Test Checklist

- [ ] Header search bar is visible
- [ ] Search redirects to `/search` page
- [ ] Search results display correctly
- [ ] Filters work (category, brand, price)
- [ ] Sorting works (price, rating, newest)
- [ ] Product images display
- [ ] Product prices display correctly
- [ ] "Add to Cart" buttons work
- [ ] Product links navigate to product pages
- [ ] Loading states show during search
- [ ] Empty state shows when no results
- [ ] Mobile responsive design works

## Common Issues & Solutions

### Issue: Search redirects to 404
**Solution:** Ensure `/search/page.tsx` exists

### Issue: No results for existing products
**Solution:** Check if products have `active: true` in database

### Issue: Images not showing
**Solution:** Check image paths and ensure they're properly stored

### Issue: Filters not working
**Solution:** Check API response includes filter data

---

**All tests passing? Search is ready! ✅**

