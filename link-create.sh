linkCreate() {
  echo "Linking $1 in $2..."
  npm i -S "./projects/$1" -w $2 || echo 'Done' 
}

source ./link-shared.sh

checkDiff

linkCreate @express-typed-api/common @express-typed-api/client
linkCreate @express-typed-api/common @express-typed-api/server
linkCreate @express-typed-api/common @sample-express-app/common
linkCreate @express-typed-api/client @sample-express-app/client
linkCreate @express-typed-api/server @sample-express-app/server

echo "Reinstalling dependencies at root folder..."
npm i

echo "Discarding generated workspace changes..."
discardDiff
