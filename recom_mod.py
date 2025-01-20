import pandas as pd
from flask import Flask, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sqlalchemy import create_engine

app = Flask(__name__)

# Connexion à la base de données
engine = create_engine('mysql+mysqlconnector://root:@localhost/soom')

# Fonction pour récupérer les données de modules choisis
def get_modules_data():
    query = "SELECT em.employe_id, em.module_id FROM moduleemployes em"
    df = pd.read_sql(query, engine)
    return df

def recommend_modules(df):
    module_count = df['module_id'].nunique()
    employee_count = df['employe_id'].nunique()
    
    employee_indices = {id: index for index, id in enumerate(df['employe_id'].unique())}
    module_indices = {id: index for index, id in enumerate(df['module_id'].unique())}
    
    user_module_matrix = np.zeros((employee_count, module_count))
    
    for i, row in df.iterrows():
        user_module_matrix[employee_indices[row['employe_id']], module_indices[row['module_id']]] = 1
    
    similarity_matrix = cosine_similarity(user_module_matrix.T)
    return similarity_matrix, module_indices

def get_recommended_modules(module_id):
    df = get_modules_data()  # Récupérer df ici
    similarity_matrix, module_indices = recommend_modules(df)

    # Vérifier si module_id existe dans les indices
    if module_id not in module_indices:
        return []

    # Obtenir les modules auxquels l'employé actuel est associé
    current_employee_modules = df[df['module_id'] == module_id]['employe_id'].unique()
    
    # Filtrer les employés qui ont des modules en commun
    filtered_df = df[df['employe_id'].isin(current_employee_modules)]
    
    # Réexécuter la recommandation sur le DataFrame filtré
    if not filtered_df.empty:
        similarity_matrix, module_indices = recommend_modules(filtered_df)

        similar_modules = list(enumerate(similarity_matrix[module_indices[module_id]]))
        similar_modules = sorted(similar_modules, key=lambda x: x[1], reverse=True)

        recommended_modules = [module for module, score in similar_modules if module_indices[module_id] != module]

        # Convertir les modules recommandés en IDs de modules
        recommended_modules_ids = [list(module_indices.keys())[module] for module in recommended_modules]

        return recommended_modules_ids
    else:
        return []

# Route Flask pour obtenir des recommandations
@app.route('/recommend', methods=['GET'])
def recommend():
    module_id = request.args.get('module_id', type=int)
    
    if module_id:
        recommended_modules = get_recommended_modules(module_id)
        # Convertir les IDs en int standard
        recommended_modules = [int(module) for module in recommended_modules]
        return jsonify(recommended_modules)
    else:
        return jsonify({"error": "module_id is required"}), 400

if __name__ == '__main__':
    app.run(debug=True)