from flask import Flask
from flask_cors import CORS

from app.extensions import db
from app.extensions import migrate
from app.config import Config
from app.routes.product_routes import product_bp
from app.routes.customer_routes import customer_bp
from app.routes.order_routes import order_bp

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.routes.dashboard_routes import dashboard_bp
from app.utils.error_handlers import (
    register_error_handlers
)




def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(product_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(dashboard_bp)
    register_error_handlers(app)
    return app