#!/bin/sh

cd Dash-User-Contributions

echo "Syncing fork..."
git reset --hard upstream/master
git push origin master --force

echo "Generating new source..."
cd ../
node src/dist.js
cd Dash-User-Contributions

echo "Committing changes to fork..."
VERSION=$(cat ../package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

cd Dash-User-Contributions
git add -A
git commit -m "LifterLMS Version $VERSION"
git push origin master
cd ../

echo "Finished! Open a PR at https://github.com/Kapeli/Dash-User-Contributions/compare/master...gocodebox:master"