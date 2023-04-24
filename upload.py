import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

measurement_one = {
    "record_type" : "temperature",
    "record_value" : "34.5C",
    "thing_type" : "TempSensor"
}

measurement_two = {
    "record_type" : "humidity",
    "record_value" : "55%",
    "thing_type" : "HumSensor"
}

data  = [measurement_one, measurement_two]
for record in data:
    doc_ref = db.collection(u'records').add(record)

