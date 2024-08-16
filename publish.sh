# Meant for documentation purposes, since the publish step requires 2FA validation

cd projects/@express-typed-api/common
npm version patch # patch, minor or major
npm publish
cd ../../..

cd projects/@express-typed-api/client
npm i -S @express-typed-api/common@latest
npm version patch # patch, minor or major
npm publish
cd ../../..

cd projects/@express-typed-api/server 
npm i -S @express-typed-api/common@latest
npm version patch # patch, minor or major
npm publish
cd ../../..

cd projects/@sample-express-app/common 
npm i -S @express-typed-api/common@latest
cd ../../..

cd projects/@sample-express-app/client 
npm i -S @express-typed-api/client@latest
cd ../../..

cd projects/@sample-express-app/server 
npm i -S @express-typed-api/server@latest
cd ../../..

npm i # Necessary to adjust package-lock.json after installs

npm run dev # Check the sample app runs correctly

git add .
git commit -m "version X.Y.Z"
