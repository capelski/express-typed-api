allFiles=(
  "package-lock.json"
  "projects/@express-typed-api/package-lock.json"
  "projects/@express-typed-api/client/package-lock.json"
  "projects/@express-typed-api/client/package.json"
  "projects/@express-typed-api/server/package-lock.json"
  "projects/@express-typed-api/server/package.json"
  "projects/@sample-express-app/package-lock.json"
  "projects/@sample-express-app/client/package-lock.json"
  "projects/@sample-express-app/client/package.json"
  "projects/@sample-express-app/common/package-lock.json"
  "projects/@sample-express-app/common/package.json"
  "projects/@sample-express-app/server/package-lock.json"
  "projects/@sample-express-app/server/package.json"
);

checkDiff() {
  for file in ${allFiles[@]}; do
    DIFF=$(git diff $file)

    if [[ $DIFF != "" ]]; then
      echo "Cannot link with changes in \"$file\""
      exit 1;
    fi
  done
}

discardDiff() {
  for file in ${allFiles[@]}; do
    git checkout $file;
  done
}
