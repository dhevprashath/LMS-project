import mysql.connector
import urllib.parse
import sys

password_raw = "Dhev@1234"
print(f"Testing connection with password: {password_raw}")

try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password=Dhev@1234,
# database="lms_db"
    )
    mycursor = mydb.cursor()
    mycursor.execute("CREATE DATABASE IF NOT EXISTS lms_db")
    print("Database lms_db created successfully or already exists.")
    mydb.close()
    sys.exit(0)
except mysql.connector.Error as err:
    print(f"Error: {err}")
    sys.exit(1)
