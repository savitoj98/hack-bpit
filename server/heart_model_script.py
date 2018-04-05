# -*- coding: utf-8 -*-
"""
Created on Thu Apr  5 03:53:38 2018
@author: Vasudev
"""
#
#age	sex	cp	trestbps	chol	fbs	restecg	thalach	exang	oldpeak	slop
#65	1	4	110	248	0	2	158	0	0.6	1
from sklearn.externals import joblib
import numpy as np
import sys

svc_classifier=joblib.load('heart_model.json')
#test_point=sys.argv[1]

test_point= [[65,1,4,110,248,0,2,158,0,0.6,1]]
test_point=np.array(test_point)
result=svc_classifier.predict_proba(test_point)
print(result[0][0])
sys.stdout.flush()