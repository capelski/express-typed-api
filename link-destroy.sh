linkDestroy() {
  echo "Installing $1 in $2..."
  cd "projects/$2"
  npm un -S $1
  npm i $1
  cd ../../..
}

source ./link-shared.sh

checkDiff

linkDestroy @express-typed-api/common @express-typed-api/client
linkDestroy @express-typed-api/common @express-typed-api/server
linkDestroy @express-typed-api/common @sample-express-app/common
linkDestroy @express-typed-api/client @sample-express-app/client
linkDestroy @express-typed-api/server @sample-express-app/server

echo "Reinstalling dependencies at root folder..."
npm i

echo "Discarding generated workspace changes..."
discardDiff
