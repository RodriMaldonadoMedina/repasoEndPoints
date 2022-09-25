"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Cart, favorite
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


api = Blueprint('api', __name__)


@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email = email, password = password).first()
    if user is None:
        return jsonify({"message":"Error en las credenciales"}), 401
    access_token = create_access_token(identity = user.id)
    return jsonify({"token":access_token, "user_id": user.id}), 200

@api.route('/signup', methods=['POST'])
def register():
    data = request.get_json()
    user = User.query.filter_by(email = data.get("email")).first()
    if len(data["email"]) == 0 or len(data["password"]) == 0:
        return jsonify({"message": "Faltan datos"}), 400
    if user is not None:
        return jsonify({"message": "El usuario ya existe"}), 400
    new_user = User(
        email = data.get("email"),
        password = data.get("password"),
        is_active = True,
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 200

@api.route('/addfavorite', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"message": "El usuario no existe"}), 400
    product = Product.query.get(data["product_id"])
    if product is None:
        return jsonify({"message": "El producto no existe"}), 400
    user.favorites.append(product)
    db.session.commit()
    return jsonify({"message": "El producto se añadio correctamente"}), 200

@api.route('/products', methods=['GET'])
#@jwt_required()
def get_products():
    products = Product.query.all()
    serializer = list(map(lambda x: x.serialize(), products))
    return jsonify({"data": serializer}), 200

@api.route('/addtocart', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    amount = request.json.get("amount", None)
    product_id = request.json.get("product_id", None)
    product = Product.query.get(product_id)
    if amount is None or product_id is None:
        return jsonify({"message":"datos invalidos"}), 400
    cart = Cart(
        user_id = user.id,
        product_id = product_id,
        product_name = product.name,
        price = product.price,
        amount = amount
    )
    db.session.add(cart)
    db.session.commit()
    return jsonify(cart.serialize()), 201
