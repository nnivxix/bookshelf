# Payload

## POST

### Good Case : General

```json
  {
    "name" : "Menjadi Seorang Perogeramer",
    "year" : 2020,
    "author": "Hanasa", 
    "summary": "Menjadi seorang perogeramer akan menjadi seorang pembelajar sepanjang hidup",
    "publisher": "PT. Bukan Gramedia",
    "pageCount" : 322,
    "readPage": 0,
    "reading": false
  }
```

### Good Case : finished property is true

```json
  {
    "name" : "Menjadi Seorang Perogeramer",
    "year" : 2020,
    "author": "Hanasa", 
    "summary": "Menjadi seorang perogeramer akan menjadi seorang pembelajar sepanjang hidup",
    "publisher": "PT. Bukan Gramedia",
    "pageCount" : 322,
    "readPage": 322,
    "reading": false
  }
```

### Fail Case : If doesn't have name book

```json
  {
    "year" : 2020,
    "author": "Hanasa", 
    "summary": "Menjadi seorang perogeramer akan menjadi seorang pembelajar sepanjang hidup",
    "publisher": "PT. Bukan Gramedia",
    "pageCount" : 322,
    "readPage": 0,
    "reading": false
  }
  ```

### Fail Case: If readPage more than pageCount

```json
  {
    "name" : "Menjadi Seorang Perogeramer",
    "year" : 2020,
    "author": "Hanasa", 
    "summary": "Menjadi seorang perogeramer akan menjadi seorang pembelajar sepanjang hidup",
    "publisher": "PT. Bukan Gramedia",
    "pageCount" : 322,
    "readPage": 330,
    "reading": false
  }
```
