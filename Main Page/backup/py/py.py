import pandas as pd
import plotly.express as px
from sklearn.cluster import KMeans
import dash
from dash import dcc, html, Input, Output

# Load data from CSV file
data = pd.read_csv('/content/transaction_history (1).csv')

# Manually parse Timestamp column
data['Timestamp'] = pd.to_datetime(data['Timestamp'].apply(lambda x: ' '.join(x.split()[1:5])))

# Preprocess the data
# Convert 'Value' column to numeric
data['Value'] = data['Value'].str.extract('(\d+.\d+)').astype(float)

# Drop rows with null values in the 'Value' column
data = data.dropna(subset=['Value']).reset_index(drop=True)

# Drop non-numeric columns and Timestamp column
data_numeric = data.drop(['Block Number', 'From', 'To'], axis=1)

# Choose the features for clustering
features = ['Value']  # Update with the appropriate column names if needed

# Extract the selected features
data_selected = data_numeric[features]

# Determine the optimal number of clusters using the Elbow method
inertia = []
for i in range(1, 11):
    kmeans = KMeans(n_clusters=i, init='k-means++', random_state=42)
    kmeans.fit(data_selected)
    inertia.append(kmeans.inertia_)

# Choose the optimal number of clusters and perform k-means clustering
k = 3  # Adjust this value based on the Elbow Method plot
kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42)
clusters = kmeans.fit_predict(data_selected)

# Add cluster labels to the original DataFrame
data_numeric['Cluster'] = clusters

# Add hover information
data_hover = data_numeric.copy()
data_hover['HoverInfo'] = data.apply(lambda row: f"Timestamp: {row['Timestamp']}\nFrom: {row['From']}\nTo: {row['To']}", axis=1)

# Initialize the Dash app
app = dash.Dash(__name__)

# Define layout
app.layout = html.Div([
    dcc.RadioItems(
        id='plot-type',
        options=[
            {'label': '2D Plot', 'value': '2d'},
            {'label': '3D Plot', 'value': '3d'}
        ],
        value='2d',  # Default value
        labelStyle={'display': 'inline-block'}
    ),
    dcc.Graph(id='cluster-plot')
])

# Define callback to update the plot based on the selected plot type
@app.callback(
    Output('cluster-plot', 'figure'),
    [Input('plot-type', 'value')]
)
def update_cluster_plot(plot_type):
    if plot_type == '2d':
        fig = px.scatter(data_hover, x='Value', y=[0] * len(data_hover), color='Cluster', hover_data={'HoverInfo': True})
        fig.update_layout(title='K-Means Clustering', xaxis_title='Value', yaxis_title='', showlegend=False)
        fig.update_traces(marker=dict(size=10))
    else:
        fig = px.scatter_3d(data_hover, x='Value', y='Cluster', z='Timestamp', color='Cluster', hover_data={'HoverInfo': True})
        fig.update_layout(title='K-Means Clustering (3D)', xaxis_title='Value', yaxis_title='Cluster', showlegend=False)
        fig.update_traces(marker=dict(size=5))
    return fig

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)
