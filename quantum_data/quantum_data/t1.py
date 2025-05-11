import psycopg2

# Database connection settings
conn = psycopg2.connect(
    dbname="quantum", user="postgres", password="admin123", host="localhost", port="5432"
)

# Create a cursor object
cur = conn.cursor()

# Query the table
cur.execute("SELECT * FROM public.EfpDatabase LIMIT 5")
records = cur.fetchall()

# Print the results
for record in records:
    print(record)

# Close the connection
cur.close()
conn.close()
