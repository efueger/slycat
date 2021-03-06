FROM centos:6.6

# setup needed environment

# install required additional OS packages
RUN yum -y update
RUN yum install -y epel-release hdf5-devel haproxy lapack-devel openldap-devel openssl-devel lcms2-devel tcl-devel tkinter libjpeg-turbo-devel openjpeg-devel libtiff-devel libffi-devel libX11-devel htop

# for some twisted reason we don't get hdf5-devel from above
RUN yum install -y hdf5-devel

RUN yum groupinstall -y Base "Development Tools" Emacs

# additional OS packages needed by couchdb
RUN yum install -y automake libcurl-devel erlang erlang-asn1 erlang-erts erlang-eunit erlang-os_mon erlang-xmerl js-devel help2man libicu-devel

# create a slycat user
RUN groupadd -g 500 slycat; useradd -u 500 -g 500 slycat
RUN mkdir /etc/slycat; chgrp slycat /etc/slycat; chmod g+w /etc/slycat

# slycat's environment, directories, and files
USER slycat
RUN mkdir -p /home/slycat/src/python; mkdir /home/slycat/install; echo "export PATH=/home/slycat/install/conda/bin:$PATH" >> /home/slycat/.bashrc; echo "export PYTHONPATH=/home/slycat/src/slycat/packages" >> /home/slycat/.bashrc;

RUN cd /home/slycat/src/python; wget -nv --no-check-certificate https://repo.continuum.io/miniconda/Miniconda-3.7.0-Linux-x86_64.sh; chmod u+x Miniconda-3.7.0-Linux-x86_64.sh; ./Miniconda-3.7.0-Linux-x86_64.sh -b -p /home/slycat/install/conda

COPY .condarc /home/slycat/.condarc
RUN /home/slycat/install/conda/bin/conda install --yes h5py ipython paramiko pip Pillow scipy scikit-image tornado
RUN /home/slycat/install/conda/bin/pip install --no-use-wheel CouchDB "cherrypy==4.0.0" "pyparsing>=2.0.3" pystache routes tornado-couchdb ipyparallel pyzmq

# checkout the slycat 
RUN cd /home/slycat/src; git clone https://github.com/sandialabs/slycat.git

# Move service files
RUN cp /home/slycat/src/slycat/open-source-docker/deploy/common/slycat-* /etc/slycat/

# build couchdb
RUN cd /home/slycat/src; wget -nv http://www.apache.org/dist/couchdb/source/1.6.1/apache-couchdb-1.6.1.tar.gz; tar -xzf apache-couchdb-1.6.1.tar.gz

RUN cd /home/slycat/src/apache-couchdb-1.6.1; ./configure -q --with-erlang=/usr/lib64/erlang/usr/include/; make -s

# back to root, install couchdb, complete system setup
USER root
RUN cd /home/slycat/src/apache-couchdb-1.6.1; make -s install

RUN useradd --home /usr/local/var/lib/couchdb --system couchdb

RUN chown -R couchdb:couchdb /usr/local/etc/couchdb; chown -R couchdb:couchdb /usr/local/var/lib/couchdb; chown -R couchdb:couchdb /usr/local/var/log/couchdb; chown -R couchdb:couchdb /usr/local/var/run/couchdb

RUN chmod 0770 /usr/local/etc/couchdb; chmod 0770 /usr/local/var/lib/couchdb; chmod 0770 /usr/local/var/log/couchdb; chmod 0770 /usr/local/var/run/couchdb; chmod 0644 /usr/local/etc/couchdb/default.ini

RUN cp /usr/local/etc/rc.d/couchdb /etc/rc.d/init.d/couchdb;


RUN cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg_orig; cp /home/slycat/src/slycat/open-source-docker/deploy/common/proxy-server-config.conf /etc/haproxy/haproxy.cfg; cp /home/slycat/src/slycat/open-source-docker/deploy/common/rsyslog-config.conf /etc/rsyslog.d/haproxy.conf

RUN ln -s /etc/slycat/slycat-web-server /etc/rc.d/init.d/slycat-web-server; ln -s /etc/slycat/slycat-feed-server /etc/rc.d/init.d/slycat-feed-server

# Create a directory to contain HDF5 files stored by Slycat.
RUN mkdir -p /var/lib/slycat/data-store
RUN chown --recursive slycat:slycat /var/lib/slycat
# Create a directory to contain the Slycat logfiles.
RUN mkdir -p /var/log/slycat
RUN chown slycat:slycat /var/log/slycat

EXPOSE 443

COPY run-slycat.sh /etc/slycat/
CMD /etc/slycat/run-slycat.sh
