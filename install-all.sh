# Using postinstall hooks ends up in never ending install loops.
# Using explicit install commands for each package.json file instead

# Usage: ./install-all.sh [ ci | i ]

INSTALL_COMMAND=${1:-"ci"}

npm $INSTALL_COMMAND

cd projects/@express-typed-api
npm $INSTALL_COMMAND
cd client; npm $INSTALL_COMMAND; cd ..
cd common; npm $INSTALL_COMMAND; cd ..
cd server; npm $INSTALL_COMMAND; cd ..
cd ../..

cd projects/@sample-express-app
npm $INSTALL_COMMAND
cd client; npm $INSTALL_COMMAND; cd ..
cd common; npm $INSTALL_COMMAND; cd ..
cd server; npm $INSTALL_COMMAND; cd ..
cd ../..
