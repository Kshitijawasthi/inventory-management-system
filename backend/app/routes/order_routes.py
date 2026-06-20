from flask import Blueprint, request, jsonify

from app.extensions import db

from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem

order_bp = Blueprint(
    "order_bp",
    __name__
)

@order_bp.route("/orders", methods=["POST"])
def create_order():

    data = request.get_json()

    customer_id = data.get("customer_id")
    items = data.get("items")

    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    if not items:
        return jsonify({
            "message": "Order items required"
        }), 400

    total_amount = 0

    order = Order(
        customer_id=customer_id
    )

    db.session.add(order)

    for item in items:

        product = Product.query.get(
            item["product_id"]
        )

        if not product:
            return jsonify({
                "message": f"Product {item['product_id']} not found"
            }), 404

        quantity = item["quantity"]

        if product.stock_quantity < quantity:
            return jsonify({
                "message": f"Insufficient stock for {product.name}"
            }), 400

        product.stock_quantity -= quantity

        line_total = quantity * product.price

        total_amount += line_total

        order_item = OrderItem(
            order=order,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )

        db.session.add(order_item)

    order.total_amount = total_amount

    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order_id": order.id,
        "total_amount": total_amount
    }), 201

@order_bp.route("/orders", methods=["GET"])
def get_orders():

    orders = Order.query.all()

    response = []

    for order in orders:

        response.append({
            "id": order.id,
            "customer_id": order.customer_id,
            "total_amount": order.total_amount,
            "created_at": order.created_at
        })

    return jsonify(response)

@order_bp.route("/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):

    order = Order.query.get(order_id)

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    items = []

    for item in order.order_items:

        items.append({
            "product_id": item.product_id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price": item.price
        })

    return jsonify({
        "id": order.id,
        "customer_id": order.customer_id,
        "total_amount": order.total_amount,
        "items": items
    })

