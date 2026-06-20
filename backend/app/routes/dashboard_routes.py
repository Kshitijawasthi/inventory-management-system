from flask import Blueprint, jsonify

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order

from app.extensions import db

dashboard_bp = Blueprint(
    "dashboard_bp",
    __name__
)

@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard_summary():

    total_products = Product.query.count()

    total_customers = Customer.query.count()

    total_orders = Order.query.count()

    inventory_value = db.session.query(
        db.func.sum(
            Product.price * Product.stock_quantity
        )
    ).scalar() or 0

    return jsonify({
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "inventory_value": inventory_value
    })

@dashboard_bp.route("/low-stock", methods=["GET"])
def low_stock_products():

    products = Product.query.filter(
        Product.stock_quantity < 5
    ).all()

    return jsonify([
        product.to_dict()
        for product in products
    ])

