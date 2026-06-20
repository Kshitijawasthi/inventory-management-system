from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.product import Product

product_bp = Blueprint(
    "product_bp",
    __name__
)


@product_bp.route("/products", methods=["POST"])
def create_product():

    data = request.get_json()

    name = data.get("name")
    quantity = data.get("quantity")
    price = data.get("price")

    if not name:
        return jsonify({
            "message": "Name is required"
        }), 400

    if quantity is None:
        return jsonify({
            "message": "Quantity is required"
        }), 400

    if price is None:
        return jsonify({
            "message": "Price is required"
        }), 400

    product = Product(
        name=name,
        quantity=quantity,
        price=price
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "Product created successfully",
        "id": product.id
    }), 201


@product_bp.route("/products", methods=["GET"])
def get_products():

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = request.args.get(
        "per_page",
        10,
        type=int
    )

    search = request.args.get(
        "search",
        ""
    )

    query = Product.query

    if search:
        query = query.filter(
            Product.name.ilike(
                f"%{search}%"
            )
        )

    paginated = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({
        "products": [
            product.to_dict()
            for product in paginated.items
        ],
        "total": paginated.total,
        "page": paginated.page,
        "pages": paginated.pages
    })


@product_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    return jsonify(
        product.to_dict()
    ), 200


@product_bp.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    data = request.get_json()

    product.name = data.get(
        "name",
        product.name
    )

    product.quantity = data.get(
        "quantity",
        product.quantity
    )

    product.price = data.get(
        "price",
        product.price
    )

    db.session.commit()

    return jsonify({
        "message": "Product updated successfully"
    }), 200


@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    }), 200


@product_bp.route("/low-stock", methods=["GET"])
def low_stock_products():

    products = Product.query.filter(
        Product.quantity < 5
    ).all()

    return jsonify([
        product.to_dict()
        for product in products
    ])

