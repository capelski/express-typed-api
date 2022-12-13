source ./link-shared.sh

checkDiff

npm i -S ./projects/@express-typed-api/common -w @express-typed-api/client || echo 'Done'

npm i -S ./projects/@express-typed-api/common -w @express-typed-api/server || echo 'Done'

npm i

discardDiff
