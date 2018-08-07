# Data Preprocessing

# Importing the libraries
# Support for large, multi-dimensional arrays along with a large collection of high-level mathematical functions.
import numpy as np
# Plotting library for Python and its mathematical extension NumPy
import matplotlib.pyplot as plt
# library for data manipulation and analysis. Offers data structures and operations for manipulating numerical tables and time series
import pandas as pd

# Importing the dataset
dataset = pd.read_csv('data.csv')
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, 3].values
