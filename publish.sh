# Meant for documentation purposes, since the publish step requires 2FA validation

source ./link-destroy.sh

cd projects/@express-typed-api/common
npm version patch # patch, minor or major
npm publish

cd ../client 
npm i -S @express-typed-api/common@latest
npm version patch # patch, minor or major
npm publish

cd ../server 
npm i -S @express-typed-api/common@latest
npm version patch # patch, minor or major
npm publish

cd ../../..
npm i