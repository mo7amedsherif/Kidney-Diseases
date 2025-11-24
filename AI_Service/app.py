import joblib
from flask import Flask, request, jsonify
import numpy as np


try:
    model = joblib.load('kidney_symptoms_model.pkl')
    print(" Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# ترتيب الأعراض (لازم يكون نفس الترتيب اللي الموديل تدرب عليه)
EXPECTED_COLUMNS = [
    'back_pain', 'swelling', 'low_urine', 'fever', 'blood_in_urine', 
    'nausea', 'vomiting', 'fatigue', 'loss_of_appetite', 
    'burning_urination', 'dark_urine', 'abdomen_pain'
]

FINAL_DIAGNOSIS_MAP = {
    0: "AKI (قصور كلوي حاد)",
    1: "CKD (فشل كلوي مزمن)",
    2: "Kidney_Stones (حصوات الكلى)",
    3: "Nephrotic_Syndrome (متلازمة الكلوية)",
    4: "UTI (التهاب المسالك البولية)"
}

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    # 1. استقبال البيانات
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON input or missing data"}), 400

    # 2. (التعديل الهام) استخراج الأعراض من المفتاح 'symptoms' لو موجود
    # Node.js sends: { "symptoms": { "back_pain": 1, ... } }
    input_symptoms = data.get('symptoms', data) 

    # 3. تحويل البيانات لقائمة أرقام بنفس الترتيب المتوقع
    try:
        # input_data will be like [1, 0, 1, 0, ...]
        input_data = [int(input_symptoms.get(col, 0)) for col in EXPECTED_COLUMNS]
        final_features = np.array([input_data])
        
        # 4. التنبؤ
        probabilities = model.predict_proba(final_features)[0]
        prediction_id = np.argmax(probabilities)
        
        diagnosis = FINAL_DIAGNOSIS_MAP.get(prediction_id, "تشخيص غير معروف")
        confidence_percentage = probabilities[prediction_id] * 100
        
        all_probabilities = {
            FINAL_DIAGNOSIS_MAP[i]: f"{prob * 100:.2f}%"
            for i, prob in enumerate(probabilities)
        }

        # 5. إرسال الرد بنفس الصيغة اللي Node.js مستنيها
        return jsonify({
            "status": "success",
            "prediction_id": int(prediction_id),
            "predicted_disease": diagnosis, # Node expects this key
            "diagnosis": diagnosis,
            "confidence": float(f"{confidence_percentage:.2f}"), # Number for DB
            "confidence_percentage": f"{confidence_percentage:.2f}%", 
            "all_probabilities": all_probabilities                   
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": f"Model prediction failed. Error: {str(e)}"}), 500

if __name__ == '__main__':
    print(" AI Server running on port 5000")
    app.run(debug=True, port=5000)