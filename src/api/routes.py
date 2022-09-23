"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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
    if data["email"] not in data or data["password"] not in data:
        return jsonify({"message": "Faltan datos"}), 400
    if user is not None:
        return jsonify({"message": "El usuario ya existe"}), 400
    new_user = User(
        email = data.get("email"),
        password = data.get("password"),
        is_active = True,
        favorites = None
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 200

@api.route('/addfavorite', methods=['POST'])
def add_favorite():
    data = request.get_json()
    user = User.query.get(data["user_id"])
    if user is None:
        return jsonify({"message": "El usuario no existe"}), 400
    product = Product.query.get(data["product_id"])
    if product is None:
        return jsonify({"message": "El producto no existe"}), 400
    user.favorites.append(product)
    db.session.commit()
    return jsonify({"message": "El producto se añadio correctamente"}), 200