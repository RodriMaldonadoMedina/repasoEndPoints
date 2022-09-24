from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

favorite = db.Table('favorite',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    favorites = db.relationship('Product', secondary = favorite, lazy='subquery',
            backref = db.backref('users', lazy = True))

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "favorites": list(map(lambda x: x.serialize, self.favorites))
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(40), unique = False, nullable = False)
    description = db.Column(db.String(), unique = False, nullable = False)
    category = db.Column(db.String(), unique = False, nullable = True)
    price = db.Column(db.String(10), unique = False, nullable = True)
    stock = db.Column(db.Integer, unique = False, nullable = True)
    carts = db.relationship('Cart', backref='product', lazy = True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "price": self.price,
            "stock": self.stock
        }

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable = False)
    product_name = db.Column(db.String(40), unique = False, nullable = False)
    amount = db.Column(db.Integer, unique = False, nullable = False)
    price = db.Column(db.String(10), unique = False, nullable = False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "amount": self.amount
        }


