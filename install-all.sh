# Using postinstall hooks ends up in never ending install loops.
# Using explicit install commands for each package.json file instead

# Usage: ./install-all.sh [ ci | i ]

INSTALL_COMMAND=${1:-"i"}

echo Installing root dependencies...
npm $INSTALL_COMMAND

cd projects/@express-typed-api
echo Installing @express-typed-api/client dependencies...
cd client; npm $INSTALL_COMMAND; cd ..
echo Installing @express-typed-api/common dependencies...
cd common; npm $INSTALL_COMMAND; cd ..
echo Installing @express-typed-api/server dependencies...
cd server; npm $INSTALL_COMMAND; cd ..
cd ../..

cd projects/@sample-express-app
echo Installing @sample-express-app/client dependencies...
cd client; npm $INSTALL_COMMAND; cd ..
echo Installing @sample-express-app/common dependencies...
cd common; npm $INSTALL_COMMAND; cd ..
echo Installing @sample-express-app/server dependencies...
cd server; npm $INSTALL_COMMAND; cd ..
cd ../..
