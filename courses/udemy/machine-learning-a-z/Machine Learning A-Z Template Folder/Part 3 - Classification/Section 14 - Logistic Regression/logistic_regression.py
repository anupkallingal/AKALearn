# Logistic Regression

# Importing the libraries
# Support for large, multi-dimensional arrays along with a large collection of high-level mathematical functions.
import numpy as np
# Plotting library for Python and its mathematical extension NumPy
import matplotlib.pyplot as plt
# library for data manipulation and analysis. Offers data structures and operations for manipulating numerical tables and time series
import pandas as pd

# Importing the dataset
dataset = pd.read_csv("Social_Network_Ads.csv")
X = dataset.iloc[:, [2,3]].values
y = dataset.iloc[:, 4].values

# Splitting the dataset into training set and test set
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)

# Feature Scaling
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# Fitting Logistic Regression to dataset
from sklearn.linear_model import LogisticRegression
classifier = LogisticRegression(random_state = 0)
classifier.fit(X_train, y_train)

# Predicting test set results
y_pred = classifier.predict(X_test)
