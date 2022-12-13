source ./link-shared.sh

checkDiff

cd projects/@express-typed-api/client
npm un -S @express-typed-api/common
npm i @express-typed-api/common

cd ../server
npm un -S @express-typed-api/common
npm i @express-typed-api/common

cd ../../..
npm i

discardDiff
