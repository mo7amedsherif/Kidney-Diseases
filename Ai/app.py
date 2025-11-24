import joblib
from flask import Flask, request, jsonify
import numpy as np


try:
    
    model = joblib.load('kidney_symptoms_model.pkl')
    print(" تم تحميل الموديل بنجاح.")
except Exception as e:
    print(f"خطأ في تحميل الموديل: {e}")
    model = None


EXPECTED_COLUMNS = ['back_pain', 'swelling', 'low_urine', 'fever', 'blood_in_urine', 'nausea', 'vomiting', 'fatigue', 'loss_of_appetite', 'burning_urination', 'dark_urine', 'abdomen_pain']


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
    
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON input or missing data"}), 400

    
    input_data = [data.get(col, 0) for col in EXPECTED_COLUMNS] 
    final_features = np.array([input_data])

    
    try:
        
        probabilities = model.predict_proba(final_features)[0]
        
        
        prediction_id = np.argmax(probabilities)
        
    except Exception as e:
         return jsonify({"error": f"Model prediction failed. Check feature count (expected 12). Error: {e}"}), 500
    
    
    diagnosis = FINAL_DIAGNOSIS_MAP.get(prediction_id, "تشخيص غير معروف")
    
    
    confidence_percentage = probabilities[prediction_id] * 100
    
    
    all_probabilities = {
        FINAL_DIAGNOSIS_MAP[i]: f"{prob * 100:.2f}%"
        for i, prob in enumerate(probabilities)
    }

    return jsonify({
        "status": "success",
        "prediction_id": int(prediction_id),
        "diagnosis": diagnosis,
        "confidence_percentage": f"{confidence_percentage:.2f}%", 
        "all_probabilities": all_probabilities                   
    })

if __name__ == '__main__':
    print("السيرفر جاهز للعمل. الآن قم بتشغيل app.py")
    app.run(debug=True, port=5000)