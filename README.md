test 2 - 3600
# Slycat
[![TravisCI](https://travis-ci.org/sandialabs/slycat.svg?branch=master)](https://travis-ci.org/sandialabs/slycat)
[![Coverage Status](https://coveralls.io/repos/github/sandialabs/slycat/badge.svg?branch=master)](https://coveralls.io/github/sandialabs/slycat?branch=master)
[![Documentation Status](https://readthedocs.org/projects/slycat/badge/?version=latest)](http://slycat.readthedocs.org/en/latest/)

This is Slycat - a web-based ensemble analysis and visualization platform, created at [Sandia National Laboratories](http://www.sandia.gov).

For installation, tutorials, and developer documentation, go to http://slycat.readthedocs.org

# [Slycat-data](https://github.com/sandialabs/slycat-data)
A github repo of sample data that can be used by slycat

# Quick Start

## Run from docker hub image (fastest way to start playing with slycat)

* install [Docker](http://www.docker.com)
```bash
docker run -p 2222:22 -p 80:80 -p 443:443 -p 5984:5984 -d --name slycat slycat/slycat-developer
```
* log into slycat @ (https:/192.168.99.100 for mac/windows and localhost for linux) and play around!
* for logging into this quick container the only requirement is username = pasword
* root user:pass is slycat:slycat for the container

## Build slycat image from scratch command line
* install [Docker](http://www.docker.com) 
* clone the slycat repo 
```bash
git clone https://github.com/sandialabs/slycat.git
```
* in a terminal shell move into the /open-source-build directory inside the repo
```bash
cd /open-source-docker/docker/open-source-build/
python build.py slycat-developer-image
````
* load the newly built images into docker
```bash
docker load -i slycat-developer-****-****.image
```
* make the container
```bash
docker run -p 2222:22 -p 80:80 -p 443:443 -p 5984:5984 -d --name slycat-developer sandialabs/slycat-developer
```
* log into slycat @ (https:/192.168.99.100 for mac/windows and localhost for linux) and play around!
* for logging into this quick container the only requirement is username = pasword
* root user:pass is slycat:slycat for the container

****

# Ensemble analysis and Visualization

## Multiple Levels of Abstraction

* Ensemble summaries (correlations or similarities)

![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/LevelsOfAbstraction.png)

* Individual runs relative to the group (distributions or behaviors)

![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/LevelsOfAbstraction2.png)

* Run-specific data (numeric values, images, or videos)

![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/LevelsOfAbstraction3.png)

##Sensitivity Analysis
1. Model Understanding 
2. Model Validation
3. Model Simplification


![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/LevelsOfAbstraction4.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/LevelsOfAbstraction5.png)

## Parameter Space Exploration
1. Results Clustering
2. Design Optimization
3. Model Tuning

![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/ParameterSpaceExploration1.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/ParameterSpaceExploration2.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/ParameterSpaceExploration/ParameterSpaceExploration3.png)


## Anomaly Detection
1. Unique Features
2. Bugs


![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection1.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection2.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection3.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection4.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection5.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection6.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection7.png)
![alt tag](https://github.com/sandialabs/slycat/blob/master/Sample-Images/Anomaly%20detection/AnomalyDetection8.png)
