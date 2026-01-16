from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

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

model = None
MODEL_PATH = 'kidney_model.pkl'

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded: {MODEL_PATH}")
    else:
        print(f"Model file not found: {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"status": "error", "message": "Model not loaded"}), 500
    
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        symptoms_dict = data.get('symptoms', data)
        
        input_vector = [float(symptoms_dict.get(col, 0)) for col in EXPECTED_COLUMNS]
        
        final_features = np.array([input_vector])

        probabilities = model.predict_proba(final_features)[0]
        prediction_id = np.argmax(probabilities)
        
        diagnosis_text = FINAL_DIAGNOSIS_MAP.get(prediction_id, "Unknown Diagnosis")
        confidence_score = probabilities[prediction_id] * 100

        all_probabilities = {
            FINAL_DIAGNOSIS_MAP.get(i, f"Type {i}"): f"{prob * 100:.2f}%"
            for i, prob in enumerate(probabilities)
        }

        return jsonify({
            "status": "success",
            "prediction_id": int(prediction_id),
            "predicted_disease": diagnosis_text,
            "confidence": f"{confidence_score:.2f}",
            "all_probabilities": all_probabilities
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)