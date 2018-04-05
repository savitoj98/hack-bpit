
# -*- coding: utf-8 -*-
"""
Created on Thu Apr  5 03:53:38 2018
@author: Vasudev
"""

from sklearn.externals import joblib
import numpy as np
import sys

svc_classifier=joblib.load('kidney_mlp_file')
a=np.array([[31, 30,  5,  1,  3,  0, 47, 57, 31,  3,  4, 67, 10,  1,  1]])
#test_point_input=sys.argv[1]
test_point=a
result=svc_classifier.predict_proba(test_point)
print(result[0][0]*(1000000))
sys.stdout.flush()