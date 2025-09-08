from flask import Flask, render_template, request, redirect, url_for, flash, session
import MySQLdb
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this to a secure secret key
bcrypt = Bcrypt(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'gaurav12'  # Use your actual MySQL password
app.config['MYSQL_DB'] = 'resume'

def get_db():
    try:
        db = MySQLdb.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            passwd=app.config['MYSQL_PASSWORD'],
            db=app.config['MYSQL_DB']
        )
        return db
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        return None

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

# About Route
@app.route('/about')
@app.route('/about.html')
def about():
    return render_template('about.html')

# Services Route
@app.route('/templates')
@app.route('/templates.html')
def templates():
    return render_template('templates.html')

# Project Route
@app.route('/pricing')
@app.route('/pricing.html')
def pricing():
    return render_template('pricing.html')

@app.route('/terms-of-service')
@app.route('/terms-of-service.html', endpoint='terms_of_service')
def terms_of_service():
    return render_template('terms-of-service.html')

@app.route('/privacy-policy')
@app.route('/privacy-policy.html', endpoint='privacy_policy')
def privacy_policy():
    return render_template('privacy-policy.html')

@app.route('/signup')
@app.route('/signup.html', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        try:
            # Get form data
            name = request.form.get('name')
            email = request.form.get('email')
            password = request.form.get('password')
            confirm_password = request.form.get('confirm_password')
            
            # Print debug information
            print(f"Received signup data - Name: {name}, Email: {email}")
            
            # Validate form data
            if not all([name, email, password, confirm_password]):
                print("Error: Missing required fields")
                flash("All fields are required!", "danger")
                return redirect(url_for('signup'))
            
            if password != confirm_password:
                print("Error: Passwords do not match")
                flash("Passwords do not match!", "danger")
                return redirect(url_for('signup'))
            
            # Connect to database
            db = get_db()
            if not db:
                print("Error: Could not connect to database")
                flash("Database connection error. Please try again.", "danger")
                return redirect(url_for('signup'))

            cursor = db.cursor()
            
            # Check if email exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                print(f"Error: Email {email} already exists")
                flash("Email already registered!", "danger")
                return redirect(url_for('signup'))
            
            # Hash password and create user
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            print("Password hashed successfully")
            
            # Insert user into database
            cursor.execute("""
                INSERT INTO users (name, email, password)
                VALUES (%s, %s, %s)
            """, (name, email, hashed_password))
            db.commit()
            print("User created successfully")
            
            flash("Registration successful! Please login.", "success")
            return redirect(url_for('login'))
            
        except Exception as e:
            print(f"Error during signup: {str(e)}")
            if 'db' in locals():
                db.rollback()
            flash("An error occurred during registration. Please try again.", "danger")
            return redirect(url_for('signup'))
        finally:
            if 'db' in locals() and db:
                cursor.close()
                db.close()
    
    return render_template('signup.html')

@app.route('/login')
@app.route('/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        db = get_db()
        if not db:
            flash("Database connection error. Please try again.", "danger")
            return redirect(url_for('login'))

        cursor = db.cursor()
        try:
            email = request.form.get('email')
            password = request.form.get('password')
            
            # Basic validation
            if not all([email, password]):
                flash("All fields are required!", "danger")
                return redirect(url_for('login'))
            
            # Check user credentials
            cursor.execute("SELECT id, name, password FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            
            if user and bcrypt.check_password_hash(user[2], password):
                session['user_id'] = user[0]
                session['user_name'] = user[1]
                flash(f"Welcome back, {user[1]}!", "success")
                return redirect(url_for('index'))
            else:
                flash("Invalid email or password!", "danger")
                return redirect(url_for('login'))
                
        except Exception as e:
            flash("An error occurred. Please try again.", "danger")
            return redirect(url_for('login'))
        finally:
            cursor.close()
            db.close()
    
    return render_template('login.html')

@app.route('/contact')
@app.route('/contact.html', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        db = get_db()
        if not db:
            flash("Database connection error. Please try again.", "danger")
            return redirect(url_for('contact'))

        cursor = db.cursor()
        try:
            name = request.form.get('name')
            email = request.form.get('email')
            subject = request.form.get('subject')
            message = request.form.get('message')
            
            # Basic validation
            if not all([name, email, subject, message]):
                flash("All fields are required!", "danger")
                return redirect(url_for('contact'))
            
            # Save contact message
            cursor.execute("""
                INSERT INTO contacts (name, email, subject, message)
                VALUES (%s, %s, %s, %s)
            """, (name, email, subject, message))
            db.commit()
            
            flash("Your message has been sent! We'll get back to you soon.", "success")
            return redirect(url_for('contact'))
            
        except Exception as e:
            db.rollback()
            flash("An error occurred. Please try again.", "danger")
            return redirect(url_for('contact'))
        finally:
            cursor.close()
            db.close()
    
    return render_template('contact.html')


if __name__ == "__main__":
    # Test database connection
    try:
        db = get_db()
        if db:
            print("Successfully connected to MySQL database!")
            cursor = db.cursor()
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print("Available tables:", [table[0] for table in tables])
            cursor.close()
            db.close()
        else:
            print("Failed to connect to database. Please check your MySQL configuration.")
    except Exception as e:
        print(f"Database connection error: {str(e)}")
    
    app.run(debug=True)