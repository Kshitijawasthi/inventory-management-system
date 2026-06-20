from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.customer import Customer

customer_bp = Blueprint(
    "customer_bp",
    __name__
)

@customer_bp.route("/customers", methods=["POST"])
def create_customer():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")

    if not name:
        return jsonify({
            "message": "Name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    existing_customer = Customer.query.filter_by(
        email=email
    ).first()

    if existing_customer:
        return jsonify({
            "message": "Email already exists"
        }), 400

    customer = Customer(
        name=name,
        email=email,
        phone=phone
    )

    db.session.add(customer)
    db.session.commit()

    return jsonify({
        "message": "Customer created successfully",
        "id": customer.id
    }), 201

@customer_bp.route("/customers", methods=["GET"])
def get_customers():

    customers = Customer.query.all()

    return jsonify(
        [customer.to_dict() for customer in customers]
    ), 200

@customer_bp.route("/customers/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):

    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    return jsonify(customer.to_dict()), 200

@customer_bp.route("/customers/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):

    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")

    if email:

        existing_customer = Customer.query.filter(
            Customer.email == email,
            Customer.id != customer_id
        ).first()

        if existing_customer:
            return jsonify({
                "message": "Email already exists"
            }), 400

        customer.email = email

    if name:
        customer.name = name

    if phone is not None:
        customer.phone = phone

    db.session.commit()

    return jsonify({
        "message": "Customer updated successfully"
    }), 200


@customer_bp.route("/customers/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):

    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    db.session.delete(customer)
    db.session.commit()

    return jsonify({
        "message": "Customer deleted successfully"
    }), 200

