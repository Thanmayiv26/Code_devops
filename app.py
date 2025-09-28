from flask import Flask, jsonify, request

app = Flask(__name__)

products = [
    {
        "title": "Smartphone Pro",
        "description": "OLED display, AI camera, ultra-fast charging.",
        "price": 59999,
        "rating": 4.6,
        "category": "Phones",
        "image": "https://m.media-amazon.com/images/I/71Sa3dqTqzL._SX679_.jpg"
    },
    {
        "title": "Wireless Headphones",
        "description": "Noise-cancelling, 35hr battery, premium sound.",
        "price": 9999,
        "rating": 4.7,
        "category": "Audio",
        "image": "https://m.media-amazon.com/images/I/71y1bUu3NwL._SX679_.jpg"
    },
    {
        "title": "Bluetooth Speaker",
        "description": "Portable, waterproof, deep bass, 24hr playtime.",
        "price": 4499,
        "rating": 4.5,
        "category": "Audio",
        "image": "https://m.media-amazon.com/images/I/61rQw3S5fHL._SX679_.jpg"
    },
    {
        "title": "Smart Watch X",
        "description": "AMOLED display, ECG, GPS, 7-day battery.",
        "price": 14999,
        "rating": 4.3,
        "category": "Accessories",
        "image": "https://m.media-amazon.com/images/I/71ZcN1FZcxL._SX679_.jpg"
    },
    {
        "title": "Ergo Laptop Stand",
        "description": "Adjustable, lightweight, aluminum build.",
        "price": 2299,
        "rating": 4.4,
        "category": "Accessories",
        "image": "https://m.media-amazon.com/images/I/71m1pWdsEUL._SX679_.jpg"
    }
]

@app.route('/api/products')
def get_products():
    category = request.args.get('category')
    max_price = request.args.get('max_price')
    filtered = products
    if category and category != "all":
        filtered = [p for p in filtered if p['category'].lower() == category.lower()]
    if max_price:
        filtered = [p for p in filtered if p['price'] <= int(max_price)]
    return jsonify(filtered)

if __name__ == '__main__':
    app.run(debug=True)